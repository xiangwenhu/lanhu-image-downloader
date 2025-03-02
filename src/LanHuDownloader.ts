
import { execFileSync } from 'child_process';
import fsp from "fs/promises";
import path from 'path';
import { DownloadProjectByUrlOptions, DownloadProjectGroupByUrlOptions, DownloadProjectGroupInnerOptions, DownloadProjectGroupOptions, DownloadProjectOptions, DownloadSingleByUrlOptions, DownloadSingleItemOptions, LanHuDownloaderOptions } from './LanHuDownloader.type';
import lanHuServices, { GetPSItemParams } from './services';
import { ProjectImageInfo, SectorItem } from './services/types';
import { ensureDir, genEnglishNames, getQueryStringObject, sleep } from './utils';
import { resizeImages } from './utils/image';
import { getPSItemAssets, sanitizeAssetNames } from './utils/lanhu';
import { Logger } from './types';
import { getLogger } from './logger';

export class LanHuDownloader {

    private logger: Logger = getLogger();

    private options: LanHuDownloaderOptions;

    constructor(options: LanHuDownloaderOptions = {}) {
        this.options = Object.assign({}, options);
    }

    /**
     * 通过设计稿地址，下载切图
     * @param url 
     * @param targetFolder 
     * @returns 
     */
    private async downloadImageSliceImages(url: string, targetFolder: string) {

        const psItemData = await lanHuServices.getPSItemData(url);
        let assets = getPSItemAssets(psItemData, this.options.downloadScale) || [];

        if (assets.length <= 0) {
            this.logger.log(`${psItemData?.board?.name} 没有可下载的切图`);
            return assets;
        }

        ensureDir(targetFolder);

        // 是否启用翻译
        if (!!this.options.enableTranslation) {
            this.logger.log(`${psItemData?.board?.name} 启动翻译，准备调用翻译`);
            assets = await genEnglishNames(assets, 'name', 'enName');
        }

        // 非法文件名字符, 以及重名处理
        assets = sanitizeAssetNames(assets);

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            // eslint-disable-next-line no-await-in-loop
            const targetPath = path.join(targetFolder, `${asset.enName || asset.name}.png`);

            if (!assets[i]?.url) {
                this.logger.log('asset download failed:', assets[i]);
                continue;
            }


            this.logger.log("下载切图：", asset.name);

            await lanHuServices.downloadAssert(assets[i]?.url!, targetPath);
            // this.logger.log('成功下载资源：', targetPath);
        }
        return assets;
    }

    /**
     * 通过 projectId 和 image_id 下载单张设计稿的切图
     */
    async downloadImageItem({ targetFolder, imageId, projectId }: DownloadSingleItemOptions) {

        const options = this.options;
        const { resizeScale = 1, teamId } = options;

        const needScale = resizeScale !== 1;
        const sourceFolder = !needScale ? targetFolder : path.join(targetFolder, '__temp');

        // 获取json_url
        const itemUrl = await lanHuServices.getPSItemUrl({
            params: {
                image_id: imageId,
                team_id: teamId!,
                project_id: projectId,
            }
        });
        this.logger.log('url:', itemUrl);

        if (itemUrl == null) {
            return this.logger.warn(`设计稿 ${imageId} 没有切图`);
        }


        try {
            // 下载图片
            // this.logger.log('psItem url:', itemUrl);
            const assets = await this.downloadImageSliceImages(itemUrl, sourceFolder);

            this.logger.log('needScale:', needScale);
            if (needScale && assets.length > 0) {
                ensureDir(targetFolder);
                const resizeOptions = {
                    sourceFolder,
                    targetFolder,
                    scale: resizeScale,
                };

                // 默认尺寸为1倍，所以压缩，如果2倍，无需
                await resizeImages(resizeOptions);

                // 删除临时文件
                this.logger.log('del:', sourceFolder);
            }
        } catch (err) {
            this.logger.log('downloadSingleItem error:', err);
            throw err;
        } finally {
            if (needScale && execFileSync(sourceFolder)) {
                // TODO:: 中文问题
                // await del([sourceFolder]);
                fsp.rm(sourceFolder, {
                    recursive: true,
                });
            }
        }
    }

    /**
     * 通过 url 下载单张设计稿的切图
     */
    async downloadSingleByUrl({ url, targetFolder }: DownloadSingleByUrlOptions) {

        const queryObj = getQueryStringObject(url);

        const projectId = queryObj.get("project_id") || queryObj.get("pid");
        const imageId = queryObj.get("image_id");
        const teamId = queryObj.get("tid");

        if (!teamId) throw new Error(`url缺少参数 tid`);
        if (!projectId) throw new Error(`url缺少参数 project_id 或者 pid`);
        if (!imageId) throw new Error(`url缺少参数 image_id`);

        this.options.teamId = teamId;

        const queryParam: GetPSItemParams = {
            project_id: projectId,
            image_id: imageId,
            team_id: teamId,
        };

        return this.downloadImageItem({
            targetFolder,
            imageId: queryParam.image_id,
            projectId: queryParam.team_id,
        });
    }


    /**
     * 通过 project_id 和 groupName下载
     * @param param0 
     * @returns 
     */
    async downloadProjectGroup({ projectId: project_id, sectorName, targetFolder }: DownloadProjectGroupOptions) {

        this.logger.log(`开始下载分组：${sectorName}`);
        const { teamId } = this.options;

        // 获取分组
        const projectSectors = await lanHuServices.getProjectSectors({ params: { project_id } });
        const projectImages = await lanHuServices.getProjectImages({ params: { project_id, team_id: teamId! } });

        // 未分组 的特殊组
        const emptySector = this.createDefaultSector({ sectors: projectSectors, projectImages });
        projectSectors.push(emptySector);

        const sector = (projectSectors || []).find(s => s.name === sectorName);
        if (!sector) {
            return this.logger.error(`未找到组:${sectorName}`);
        }

        if (sector.images.length === 0) {
            return this.logger.log(`${sector.name}的设计稿数量为0, 无需下载`);
        }

        // 获取全部信息

        return this.downloadProjectGroupInner({
            projectImages,
            projectId: project_id,
            targetFolder,
            sector
        })
    }


    private async downloadProjectGroupInner({ projectImages, sector, targetFolder, projectId: project_id }: DownloadProjectGroupInnerOptions) {
        // 合并信息
        const projectImagesMap: Record<string, ProjectImageInfo> = projectImages.reduce((obj: any, cur) => {
            obj[cur.id] = cur;
            return obj;
        }, {});
        let images = sector.images.map(id => projectImagesMap[id]).filter(Boolean);

        if (!!this.options.enableTranslation) {
            images = await genEnglishNames<ProjectImageInfo>(images, 'name', 'enName');
        }

        await sleep(100);

        const namesMap = images.map(i => ({
            name: i.name,
            eName: i.enName,
            englishName: i.englishName,
        }));

        if (images.length === 0) return this.logger.log(`${sector.name} 分组下的设计稿数量为0, 跳过`);
        ensureDir(targetFolder);

        fsp.writeFile(path.join(targetFolder, '__map.json'), JSON.stringify(namesMap, undefined, '\t'));

        // 下载
        for (let i = 0; i < images.length; i++) {
            this.logger.log('download PS Item:', images[i].name);
            const tf = path.join(targetFolder, images[i].enName || images[i].name);

            await this.downloadImageItem({
                imageId: images[i].id,
                targetFolder: tf,
                projectId: project_id,
            });

            // 翻译软件 200ms 1次
            await sleep(200)
        }
    }

    /**
     * 通过 url 下载单张设计稿的切图
     */
    async downloadProjectGroupByUrl({ url, targetFolder, sectorName }: DownloadProjectGroupByUrlOptions) {
        const queryObj = getQueryStringObject(url);

        const project_id = queryObj.get("project_id") || queryObj.get("pid");

        const teamId = queryObj.get("tid");

        if (!teamId) throw new Error(`url缺少参数 tid`);
        if (!project_id) throw new Error(`url缺少参数 project_id 或者 pid`);

        this.options.teamId = teamId;

        return this.downloadProjectGroup({
            projectId: project_id, sectorName, targetFolder
        })
    }


    /**
     * 创建未分组 这个特殊的分组
     */
    private createDefaultSector({
        sectors,
        projectImages
    }: {
        projectImages: ProjectImageInfo[],
        sectors: SectorItem[]
    }): SectorItem {

        const set = new Set<string>();

        sectors.forEach(sector => {
            (sector.images || []).forEach(imgId => set.add(imgId))
        });

        const images: string[] = projectImages.filter(img => !set.has(img.id)).map(img => img.id);

        return {
            name: "未分组",
            images
        } as SectorItem
    }


    async downloadProjectByUrl({ url, targetFolder }: DownloadProjectByUrlOptions) {
        const queryObj = getQueryStringObject(url);

        const project_id = queryObj.get("project_id") || queryObj.get("pid");
        if (!project_id) throw new Error(`url缺少参数 project_id 或者 pid`);

        const { teamId } = this.options;

        // 获取项目分组
        const projectSectors = await lanHuServices.getProjectSectors({ params: { project_id } });

        // 获取项目设计稿信息
        const projectImages = await lanHuServices.getProjectImages({ params: { project_id, team_id: teamId! } });

        // 未分组 的特殊组
        const sector = this.createDefaultSector({ sectors: projectSectors, projectImages });
        if (sector.images.length > 0) {
            projectSectors.push(sector);
        }

        for (let i = 0; i < projectSectors.length; i++) {
            const group = projectSectors[i];
            await this.downloadProjectGroupInner({
                projectImages,
                projectId: project_id,
                sector: group,
                targetFolder: path.join(targetFolder, group.name)
            })
        }

    }


    async downloadProject({ projectId: project_id, targetFolder }: DownloadProjectOptions) {

        const { teamId } = this.options;

        // 获取项目分组
        const projectSectors = await lanHuServices.getProjectSectors({ params: { project_id } });

        // 获取项目设计稿信息
        const projectImages = await lanHuServices.getProjectImages({ params: { project_id, team_id: teamId! } });

        // 未分组 的特殊组
        const sector = this.createDefaultSector({ sectors: projectSectors, projectImages });
        if (sector.images.length > 0) {
            projectSectors.push(sector);
        }

        for (let i = 0; i < projectSectors.length; i++) {
            const group = projectSectors[i];
            await this.downloadProjectGroupInner({
                projectImages,
                projectId: project_id,
                sector: group,
                targetFolder: path.join(targetFolder, group.name)
            })
        }

    }

}
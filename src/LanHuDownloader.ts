
import { existsSync } from "fs";
import fsp from "fs/promises";
import path from 'path';
import { DownloadProjectGroupByUrlParams, DownloadProjectGroupInnerParams, DownloadProjectGroupParams, DownloadProjectParams, DownloadSingleItemParams, LanHuDownloaderConstructorOptions } from './LanHuDownloader.type';
import { getLogger } from './logger';
import lanHuServices, { GetPSItemParams } from './services';
import { MasterJSONData, ProjectImageInfo, PSItemJSONData, PsJSONData, SectorItem, SketchJSONData } from './services/types';
import { CommonParamsOptions, DownloadOptionsWithTargetFolder, EnumCutImageStyle, Logger } from './types';
import { ensureDir, genEnglishNames, getQueryStringObject, sleep } from './utils';
import { getFilenameByType, resizeImageBySize } from './utils/image';
import { getPSItemAssets, sanitizeAssetNames } from './utils/lanhu';

export class LanHuDownloader {

    private logger: Logger = getLogger();

    private options: LanHuDownloaderConstructorOptions;

    constructor(options: LanHuDownloaderConstructorOptions) {
        this.options = Object.assign({}, options);
    }

    /**
     * 通过设计稿地址，下载切图
     * @param url 
     * @param targetFolder 
     * @returns 
     */
    private async downloadItemSliceImages(url: string, options: DownloadOptionsWithTargetFolder) {
        const { targetFolder, downloadScale, enableTranslation, cutImageStyle } = options;

        const psItemData = await lanHuServices.getPSItemData(url);

        let assets = getPSItemAssets(psItemData) || [];
        this.logger.log(`获取切图数量为: ${assets.length}`)

        const name = (psItemData as MasterJSONData.Data)?.artboard?.name || (psItemData as PsJSONData.Data)?.board?.name || (psItemData as SketchJSONData.Data)?.pageName;

        if (assets.length <= 0) {
            this.logger.log(`${name} 没有可下载的切图`);
            return assets;
        }

        ensureDir(targetFolder);

        // 是否启用翻译
        if (!!enableTranslation) {
            this.logger.log(`${name} 启动翻译，准备调用翻译`);
            assets = await genEnglishNames(assets, 'name', 'enName');
        }

        // 非法文件名字符, 以及重名处理
        assets = sanitizeAssetNames(assets);

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            let targetPathTemp: string = "";
            try {
                const imageStyle = cutImageStyle || EnumCutImageStyle.PNG;
                const fName = `${asset.enName || asset.name}`
                targetPathTemp = path.join(targetFolder, getFilenameByType(`${fName}__tmp`, imageStyle));
                const targetPath = path.join(targetFolder, getFilenameByType(`${fName}`, imageStyle));

                if (!assets[i]?.url) {
                    this.logger.log('asset download failed:', assets[i]);
                    continue;
                }

                this.logger.log(`切图${asset.name}: 下载开始`);
                await lanHuServices.downloadWithFallbacks(assets[i]?.url!, targetPathTemp);
                this.logger.log(`切图${asset.name}: 下载完毕`);

                const scale = downloadScale || 1;
                const width = Math.ceil(scale * asset.width);
                const height = Math.ceil(scale * asset.height);

                this.logger.log(`切图${asset.name}: 尺寸调整开始`);
                await resizeImageBySize({ source: targetPathTemp, target: targetPath, width, height, type: imageStyle })
                this.logger.log(`切图${asset.name}: 尺寸调整完毕`);

            } catch (err) {
                this.logger.log(`切图${asset.name}: 下载失败`, err);
            } finally {
                if (targetPathTemp && existsSync(targetPathTemp)) {
                    await fsp.unlink(targetPathTemp)
                }
            }

        }
        return assets;
    }

    /**
     * 通过 projectId 和 image_id 下载单张设计稿的切图
     */
    async downloadSingle(params: DownloadSingleItemParams, options: DownloadOptionsWithTargetFolder) {
        const { teamId, imageId, projectId } = params;

        const opts = Object.assign({}, this.options, options)

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
            const assets = await this.downloadItemSliceImages(itemUrl, opts);
        } catch (err) {
            this.logger.log('downloadSingleItem error:', err);
            throw err;
        }
    }

    /**
     * 通过 url 下载单张设计稿的切图
     */
    async downloadSingleByUrl(params: CommonParamsOptions & { url: string }, options: DownloadOptionsWithTargetFolder) {

        const { url } = params;

        const queryObj = getQueryStringObject(url);

        const projectId = queryObj.get("project_id") || queryObj.get("pid");
        const imageId = queryObj.get("image_id");
        const teamId = queryObj.get("tid");

        if (!teamId) throw new Error(`url缺少参数 tid`);
        if (!projectId) throw new Error(`url缺少参数 project_id 或者 pid`);
        if (!imageId) throw new Error(`url缺少参数 image_id`);

        this.options.teamId = teamId;

        return this.downloadSingle({
            teamId: params.teamId,
            projectId: params.projectId,
            imageId: params.imageId
        }, options);
    }


    /**
     * 通过 project_id 和 groupName下载
     * @param param0 
     * @returns 
     */
    async downloadProjectGroup(params: DownloadProjectGroupParams, options: DownloadOptionsWithTargetFolder) {
        const { sectorName, projectId: project_id, teamId } = params;

        this.logger.log(`开始下载分组：${sectorName}`);

        const team_id = teamId || this.options.teamId;
        // 获取分组
        const projectSectors = await lanHuServices.getProjectSectors({ params: { project_id } });
        const projectImages = await lanHuServices.getProjectImages({ params: { project_id, team_id: team_id! } });

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
            teamId,
            projectImages,
            projectId: project_id,
            sector
        }, options)
    }


    private async downloadProjectGroupInner(params: DownloadProjectGroupInnerParams, options: DownloadOptionsWithTargetFolder) {

        const { projectImages, sector, projectId: project_id, teamId } = params;
        const { targetFolder } = options;

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

            await this.downloadSingle({
                teamId,
                imageId: images[i].id,
                projectId: project_id,
            }, options);

            // 翻译软件 200ms 1次
            await sleep(200)
        }
    }

    /**
     * 通过 url 下载单张设计稿的切图
     */
    async downloadProjectGroupByUrl(params: DownloadProjectGroupByUrlParams, options: DownloadOptionsWithTargetFolder) {

        const { url, sectorName, } = params;

        const queryObj = getQueryStringObject(url);

        const project_id = queryObj.get("project_id") || queryObj.get("pid");

        const teamId = queryObj.get("tid");

        if (!teamId) throw new Error(`url缺少参数 tid`);
        if (!project_id) throw new Error(`url缺少参数 project_id 或者 pid`);

        this.options.teamId = teamId;

        return this.downloadProjectGroup({
            teamId,
            projectId: project_id,
            sectorName
        }, options)
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


    async downloadProjectByUrl(params: DownloadProjectGroupByUrlParams, options: DownloadOptionsWithTargetFolder) {

        const { url, } = params;

        const queryObj = getQueryStringObject(url);

        const project_id = queryObj.get("project_id") || queryObj.get("pid");
        if (!project_id) throw new Error(`url缺少参数 project_id 或者 pid`);


        const teamId = queryObj.get("tid");
        if (!teamId) throw new Error(`url缺少参数 tid`);

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
                teamId,
                projectImages,
                projectId: project_id,
                sector: group,
            }, options)
        }
    }

    async downloadProject(params: DownloadProjectParams, options: DownloadOptionsWithTargetFolder) {

        const { projectId: project_id, teamId } = params;

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
                teamId,
                projectImages,
                projectId: project_id,
                sector: group,
            }, options)
        }

    }

}

import lanHuServices, { PSItemParams } from './services';
import fsp from "fs/promises";
import { ensureDir, genEnglishNames, getQueryStringObject, groupBy, sanitizeFileName, sleep } from './utils';
import { getPSItemAssets } from './utils/lanhu';
import { resizeImages } from './utils/image';
import path from 'path';
import { ProjectImageInfo, SectorItem } from './services/types';
import { EnumDownloadScale } from './types';
import { execFileSync } from 'child_process';

interface LanHuDownloaderOptions {
    /**
     * 下载的图片的切图大小， 1 | 2倍尺寸
     */
    downloadScale?: EnumDownloadScale;
    /**
     * 下载后重新调整图片的大小，一般选择缩小
     */
    resizeScale?: number;
    team_id?: string;
    /**
     * 启用翻译
     */
    enableTranslation?: string;
}

interface DownloadSingleItemOptions {
    image_id: string;
    targetFolder: string;
    project_id: string;
}

export interface DownloadSingleByUrlOptions {
    url: string;
    targetFolder: string;
    type?: string;
}

export interface DownloadProjectGroupOptions {
    project_id: string;
    sectorName: string;
    targetFolder: string;
}

interface DownloadProjectGroupInnerOptions {
    sector: SectorItem;
    projectImages: ProjectImageInfo[];
    project_id: string;
    targetFolder: string;
}

export interface DownloadProjectGroupByUrlOptions {
    url: string;
    targetFolder: string;
    sectorName: string;
}

export interface DownloadProjectByUrlOptions {
    url: string;
    targetFolder: string;
}

export interface DownloadProjectOptions {
    targetFolder: string;
    project_id: string;
}

export default class LanHuDownloader {

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
            return assets;
        }

        ensureDir(targetFolder);

        // 是否启用翻译
        if (!!this.options.enableTranslation) {
            assets = await genEnglishNames(assets, 'name', 'enName');
        }

        // 非法文件名字符
        assets.forEach(asset => {
            asset.name = sanitizeFileName(asset.name);
            asset.enName = sanitizeFileName(asset.enName)
        })

        for (let i = 0; i < assets.length; i++) {
            const asset = assets[i];
            // eslint-disable-next-line no-await-in-loop
            const targetPath = path.join(targetFolder, `${asset.enName || asset.name}.png`);

            if (!assets[i]?.url) {
                console.log('asset download failed:', assets[i]);
                continue;
            }

            await lanHuServices.downloadAssert(assets[i]?.url!, targetPath);
            // console.log('成功下载资源：', targetPath);
        }
        return assets;
    }

    /**
     * 通过 project_id 和 image_id 下载单张设计稿的切图
     */
    async downloadImageItem({ targetFolder, image_id, project_id }: DownloadSingleItemOptions) {

        const options = this.options;
        const { resizeScale = 1, team_id } = options;

        const needScale = resizeScale !== 1;
        const sourceFolder = !needScale ? targetFolder : path.join(targetFolder, '__temp');

        // 获取json_url
        const itemUrl = await lanHuServices.getPSItemUrl({
            params: {
                image_id,
                team_id: team_id!,
                project_id,
            }
        });
        console.log('url:', itemUrl);

        if (itemUrl == null) {
            return console.warn(`设计稿 ${image_id} 没有切图`);
        }


        try {
            // 下载图片
            // console.log('psItem url:', itemUrl);
            const assets = await this.downloadImageSliceImages(itemUrl, sourceFolder);

            console.log('needScale:', needScale);
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
                console.log('del:', sourceFolder);
            }
        } catch (err) {
            console.log('downloadSingleItem error:', err);
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

        const project_id = queryObj.get("project_id") || queryObj.get("pid");
        const image_id = queryObj.get("image_id");
        const team_id = queryObj.get("tid");

        if (!team_id) throw new Error(`url缺少参数 tid`);
        if (!project_id) throw new Error(`url缺少参数 project_id 或者 pid`);
        if (!image_id) throw new Error(`url缺少参数 image_id`);

        this.options.team_id = team_id;

        const queryParam: PSItemParams = {
            project_id,
            image_id,
            team_id,
        };

        return this.downloadImageItem({
            targetFolder,
            image_id: queryParam.image_id,
            project_id: queryParam.project_id,
        });
    }


    /**
     * 通过 project_id 和 groupName下载
     * @param param0 
     * @returns 
     */
    async downloadProjectGroup({ project_id, sectorName, targetFolder }: DownloadProjectGroupOptions) {

        const { team_id } = this.options;

        // 获取分组
        const projectSectors = await lanHuServices.getProjectSectors({ params: { project_id } });
        const projectImages = await lanHuServices.getProjectImages({ params: { project_id, team_id: team_id! } });

        // 未分组 的特殊组
        const emptySector = this.createDefaultSector({ sectors: projectSectors, projectImages });
        projectSectors.push(emptySector);

        const sector = (projectSectors || []).find(s => s.name === sectorName);
        if (!sector) {
            return console.error(`未找到组:${sectorName}`);
        }

        if (sector.images.length === 0) {
            return console.log(`${sector.name}的设计稿数量为0, 无需下载`);
        }

        // 获取全部信息

        return this.downloadProjectGroupInner({
            projectImages,
            project_id,
            targetFolder,
            sector
        })
    }


    private async downloadProjectGroupInner({ projectImages, sector, targetFolder, project_id }: DownloadProjectGroupInnerOptions) {
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

        if (images.length === 0) return console.log(`${sector.name} 分组下的设计稿数量为0, 跳过`);
        ensureDir(targetFolder);

        fsp.writeFile(path.join(targetFolder, '__map.json'), JSON.stringify(namesMap, undefined, '\t'));

        // 下载
        for (let i = 0; i < images.length; i++) {
            console.log('download PS Item:', images[i].name);
            const tf = path.join(targetFolder, images[i].enName || images[i].name);

            await this.downloadImageItem({
                image_id: images[i].id,
                targetFolder: tf,
                project_id,
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

        const team_id = queryObj.get("tid");

        if (!team_id) throw new Error(`url缺少参数 tid`);
        if (!project_id) throw new Error(`url缺少参数 project_id 或者 pid`);

        this.options.team_id = team_id;

        return this.downloadProjectGroup({
            project_id, sectorName, targetFolder
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

        const { team_id } = this.options;

        // 获取项目分组
        const projectSectors = await lanHuServices.getProjectSectors({ params: { project_id } });

        // 获取项目设计稿信息
        const projectImages = await lanHuServices.getProjectImages({ params: { project_id, team_id: team_id! } });

        // 未分组 的特殊组
        const sector = this.createDefaultSector({ sectors: projectSectors, projectImages });
        if (sector.images.length > 0) {
            projectSectors.push(sector);
        }

        for (let i = 0; i < projectSectors.length; i++) {
            const group = projectSectors[i];
            await this.downloadProjectGroupInner({
                projectImages,
                project_id,
                sector: group,
                targetFolder: path.join(targetFolder, group.name)
            })
        }

    }


    async downloadProject({ project_id, targetFolder }: DownloadProjectOptions) {

        const { team_id } = this.options;

        // 获取项目分组
        const projectSectors = await lanHuServices.getProjectSectors({ params: { project_id } });

        // 获取项目设计稿信息
        const projectImages = await lanHuServices.getProjectImages({ params: { project_id, team_id: team_id! } });

        // 未分组 的特殊组
        const sector = this.createDefaultSector({ sectors: projectSectors, projectImages });
        if (sector.images.length > 0) {
            projectSectors.push(sector);
        }

        for (let i = 0; i < projectSectors.length; i++) {
            const group = projectSectors[i];
            await this.downloadProjectGroupInner({
                projectImages,
                project_id,
                sector: group,
                targetFolder: path.join(targetFolder, group.name)
            })
        }

    }

}
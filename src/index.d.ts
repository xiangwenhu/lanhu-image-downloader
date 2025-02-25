export enum EnumUrlType {
    project = 1,
    sector = 2,
    image = 3,
    unknown = 4
}

export enum EnumDownloadScale {
    default = 1,
    double = 2
}

export interface DownloadOptions {
    sectorName?: string;
    type: EnumUrlType;
    targetFolder: string;
    /**
     * 下载的图片的切图大小， 1 | 2倍尺寸
     */
    downloadScale?: EnumDownloadScale;
    /**
     * 下载后重新调整图片的大小，一般选择缩小
     */
    resizeScale?: number;
    /**
     * 启用中专英文
     */
    enableTranslation?: boolean;
}

export declare function downloadByUrl(url: string, configFilePath: string, downloadOptions: DownloadOptions): void;



interface SectorItem {
    id: string;
    images: string[];
    name: string;
    order: number;
    parent_id: number | null;
}

interface ProjectImageInfo {
    batch: string;
    create_time: string;
    dds_jump_status: number;
    extra_attrs: string;
    group: any[];
    has_comment: boolean;
    height: number;
    home: boolean;
    id: string;
    is_replaced: boolean;
    last_version_num: number;
    latest_version: string;
    layout_data: string;
    name: string;
    englishName?: string;
    enName?: string;
    order: null;
    pinyinname: string;
    position_x: number;
    position_y: number;
    positions: any[];
    share_id: string;
    sketch_id: string;
    source: boolean;
    trash_recovery: boolean;
    type: string;
    update_time: string;
    url: string;
    user_id: string;
    width: number;
}


export interface LanHuDownloaderOptions {
    /**
     * 下载的图片的切图大小， 1 | 2倍尺寸
     */
    downloadScale?: EnumDownloadScale;
    /**
     * 下载后重新调整图片的大小，一般选择缩小
     */
    resizeScale?: number;
    teamId?: string;
    /**
     * 启用翻译
     */
    enableTranslation?: boolean;
}

export interface DownloadSingleItemOptions {
    imageId: string;
    targetFolder: string;
    projectId: string;
}

export interface DownloadSingleByUrlOptions {
    url: string;
    targetFolder: string;
    type?: string;
}

export interface DownloadProjectGroupOptions {
    projectId: string;
    sectorName: string;
    targetFolder: string;
}

export interface DownloadProjectGroupInnerOptions {
    sector: SectorItem;
    projectImages: ProjectImageInfo[];
    projectId: string;
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
    projectId: string;
}


export declare class LanHuDownloader {
    private options;
    constructor(options?: LanHuDownloaderOptions);
    /**
     * 通过设计稿地址，下载切图
     * @param url
     * @param targetFolder
     * @returns
     */
    private downloadImageSliceImages;
    /**
     * 通过 projectId 和 image_id 下载单张设计稿的切图
     */
    downloadImageItem({ targetFolder, imageId, projectId }: DownloadSingleItemOptions): Promise<void>;
    /**
     * 通过 url 下载单张设计稿的切图
     */
    downloadSingleByUrl({ url, targetFolder }: DownloadSingleByUrlOptions): Promise<void>;
    /**
     * 通过 project_id 和 groupName下载
     * @param param0
     * @returns
     */
    downloadProjectGroup({ projectId: project_id, sectorName, targetFolder }: DownloadProjectGroupOptions): Promise<void>;
    private downloadProjectGroupInner;
    /**
  * 通过 url 下载单张设计稿的切图
  */
    downloadProjectGroupByUrl({ url, targetFolder, sectorName }: DownloadProjectGroupByUrlOptions): Promise<void>;
    /**
     * 创建未分组 这个特殊的分组
     */
    private createDefaultSector;
    downloadProjectByUrl({ url, targetFolder }: DownloadProjectByUrlOptions): Promise<void>;
    downloadProject({ projectId: project_id, targetFolder }: DownloadProjectOptions): Promise<void>;
}

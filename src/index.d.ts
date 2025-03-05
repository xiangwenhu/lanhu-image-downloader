interface CommonParamsOptions {
    teamId: string;
    projectId: string;
    imageId: string;
    sectorName: string;
}
type ProjectUrlParams = Pick<CommonParamsOptions, "teamId" | "projectId">;
type ImageUrlParams = ProjectUrlParams & Pick<CommonParamsOptions, "imageId">;
export declare enum EnumUrlType {
    project = 1,
    sector = 2,
    image = 3,
    unknown = 4
}
type ParamsMap = {
    [EnumUrlType.project]: ProjectUrlParams;
    [EnumUrlType.sector]: ProjectUrlParams & {
        sectorName: string;
    };
    [EnumUrlType.image]: ImageUrlParams;
    [EnumUrlType.unknown]: {
        message: string;
    };
};
declare type ParamsConfig<Type extends keyof ParamsMap> = Type extends keyof ParamsMap ? ParamsMap[Type] : {};
interface ConfigParamsInformation<T extends EnumUrlType> {
    type: T;
    params: ParamsConfig<T>;
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
export declare enum EnumDownloadScale {
    default = 1,
    double = 2
}
export interface Logger {
    /**
     * 记录一条通用日志信息
     * @param messages 要记录的日志信息，可以是多个参数
     */
    log(...messages: any[]): void;
    /**
     * 记录一条信息级别的日志信息
     * @param messages 要记录的日志信息，可以是多个参数
     */
    info(...messages: any[]): void;
    /**
     * 记录一条警告级别的日志信息
     * @param messages 要记录的日志信息，可以是多个参数
     */
    warn(...messages: any[]): void;
    /**
     * 记录一条错误级别的日志信息
     * @param messages 要记录的日志信息，可以是多个参数
     */
    error(...messages: any[]): void;
}
export type BinDownloadOptions = DownloadOptions & CommonParamsOptions & {
    configFilePath: string;
};

export declare function downloadByUrl(url: string, configFilePath: string, options: DownloadOptions): void;
export declare function downloadByOptions(options: BinDownloadOptions): void;


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
    private logger;
    private options;
    constructor(options?: LanHuDownloaderOptions);
    /**
     * 通过设计稿地址，下载切图
     * @param url
     * @param targetFolder
     * @returns
     */
    private downloadItemSliceImages;
    /**
     * 通过 projectId 和 image_id 下载单张设计稿的切图
     */
    downloadSingle({ targetFolder, imageId, projectId }: DownloadSingleItemOptions): Promise<void>;
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


export declare function setLogger(logger: Logger): void;
export declare function getLogger(): Logger;
export declare function downloadByEnv(): Promise<void>;


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

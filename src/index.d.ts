export declare enum EnumUrlType {
    project = 1,
    sector = 2,
    image = 3,
    unknown = 4
}
export type ParamsMap = {
    [EnumUrlType.project]: {
        tid: string;
        pid: string;
    };
    [EnumUrlType.sector]: {
        tid: string;
        pid: string;
        sectorName: string;
    };
    [EnumUrlType.image]: {
        tid: string;
        pid: string;
        image_id: string;
    };
    [EnumUrlType.unknown]: {
        message: string;
    };
};
export declare type ParamsConfig<Type extends keyof ParamsMap> = Type extends keyof ParamsMap ? ParamsMap[Type] : {};
export interface ConfigParamsInformation<T extends EnumUrlType> {
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


export declare function downloadByUrl(url: string, configFilePath: string, downloadOptions: DownloadOptions): void;


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
    enableTranslation?: boolean;
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
     * 通过 project_id 和 image_id 下载单张设计稿的切图
     */
    downloadImageItem({ targetFolder, image_id, project_id }: DownloadSingleItemOptions): Promise<void>;
    /**
     * 通过 url 下载单张设计稿的切图
     */
    downloadSingleByUrl({ url, targetFolder }: DownloadSingleByUrlOptions): Promise<void>;
    /**
     * 通过 project_id 和 groupName下载
     * @param param0
     * @returns
     */
    downloadProjectGroup({ project_id, sectorName, targetFolder }: DownloadProjectGroupOptions): Promise<void>;
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
    downloadProject({ project_id, targetFolder }: DownloadProjectOptions): Promise<void>;
}

export interface ConfigData {
    teamId?: string;
    cookies: { name: string, value: string }[] | string;
    /**
     * 下载的图片的切图大小， 1 | 2倍尺寸
     */
    downloadScale?: EnumDownloadScale;
    /**
     * 下载后重新调整图片的大小，一般选择缩小
     */
    resizeScale?: number;
    /**
     * 启用翻译
     */
    enableTranslation?: boolean;

    trans: {
        appId: string;
        appKey: string;
    }
}

export { };
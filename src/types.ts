

interface CommonParamsOptions {
    teamId: string;
    projectId: string;
    imageId: string;
    sectorName: string;
}

type ProjectUrlParams = Pick<CommonParamsOptions, "teamId" | "projectId">;
type ImageUrlParams = ProjectUrlParams & Pick<CommonParamsOptions, "imageId">;

export enum EnumUrlType {
    project = 1,
    sector = 2,
    image = 3,
    unknown = 4
}

export type ParamsMap = {
    [EnumUrlType.project]: ProjectUrlParams,
    [EnumUrlType.sector]: ProjectUrlParams & {
        sectorName: string;
    },
    [EnumUrlType.image]: ImageUrlParams,
    [EnumUrlType.unknown]: {
        message: string;
    }
}

export declare type ParamsConfig<Type extends keyof ParamsMap> =
    Type extends keyof ParamsMap
    ? ParamsMap[Type]
    : {};



export interface ConfigParamsInformation<T extends EnumUrlType> {
    type: T,
    params: ParamsConfig<T>
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


export enum EnumDownloadScale {
    default = 1,
    double = 2
}
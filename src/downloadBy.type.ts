import { CommonParamsOptions, EnumUrlType, CommonDownloadOptions, NullableTeamIdParams } from "./types"

type ProjectUrlParams = Pick<CommonParamsOptions, "teamId" | "projectId">;
type ImageUrlParams = ProjectUrlParams & Pick<CommonParamsOptions, "imageId">;


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

export type DownloadByOptions = CommonDownloadOptions & CommonParamsOptions & {
    type: EnumUrlType,
    targetFolder: string;
    sectorName: string;
};

export type DownloadByUrlOptions = CommonDownloadOptions & NullableTeamIdParams & {
    type: EnumUrlType,
    targetFolder: string;
    sectorName: string;
};


export type BinDownloadOptions = DownloadByOptions & {
    configFilePath: string;
}
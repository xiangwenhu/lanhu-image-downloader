export enum EnumUrlType {
    project = 1,
    sector = 2,
    image = 3,
    unknown = 4
}

export type ParamsMap = {
    [EnumUrlType.project]: {
        tid: string;
        pid: string;
    },
    [EnumUrlType.sector]: {
        tid: string;
        pid: string;
        sectorName: string;
    },
    [EnumUrlType.image]: {
        tid: string;
        pid: string;
        image_id: string;
    },
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


export interface ConfigOptions {
    sectorName?: string;
    type: EnumUrlType;
    targetFolder: string;
}
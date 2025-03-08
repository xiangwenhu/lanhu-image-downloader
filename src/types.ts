export enum EnumUrlType {
    project = 1,
    sector = 2,
    image = 3,
    unknown = 4
}

export enum EnumCutImageStyle {
    PNG = 'PNG',
    JPG = 'JPG',
    WebP = 'WebP',
    SVG = 'SVG',
    PDF = 'PDF'
}

export enum EnumPlatForm {
    IOS = 'IOS',
    Android = 'Android',
    Web = 'Web'
}

export interface CommonParamsOptions {
    /**
     * 团队ID
     */
    teamId: string;
    /**
     * 项目ID
     */
    projectId: string;
    /**
     * 设计稿ID
     */
    imageId: string;
}

export interface CommonDownloadOptions {
    /**
     * 下载切图样式
     */
    cutImageStyle?: EnumCutImageStyle;
    /**
     * 下载的图片的切图大小， 1 | 2倍尺寸
     */
    downloadScale?: number;
    /**
     * 启用中专英文
     */
    enableTranslation?: boolean;
}


export interface DownloadOptionsWithTargetFolder extends CommonDownloadOptions {
    targetFolder: string;
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

export type NullableTeamIdParams = Partial<Pick<CommonParamsOptions, "teamId">>;

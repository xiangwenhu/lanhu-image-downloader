import { EnumDownloadScale } from "./types";
import { readJsonFileSync } from "./utils";

export interface ConfigData {
    teamId?: string;
    cookies: { name: string, value: string }[];
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


let config: ConfigData = {} as any;

export function readConfig(filename: string): ConfigData {
    config = readJsonFileSync(filename) as ConfigData;
    return config
}

export function getConfig() {
    return config;
}
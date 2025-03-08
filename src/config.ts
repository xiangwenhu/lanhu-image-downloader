import { CommonDownloadOptions } from "./types";
import { readJsonFileSync } from "./utils";

export type ConfigData = CommonDownloadOptions & {
    teamId?: string;
    cookies: { name: string, value: string }[] | string;
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
import { readJsonFileSync } from "./utils";

interface ConfigData {
    teamId: string;
    cookies: { name: string, value: string }[];
    scale: number;
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
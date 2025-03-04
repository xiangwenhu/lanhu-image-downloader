import { BinDownloadOptions, EnumUrlType } from "../types"


function getValueFromEnv(property: string, defaultValue: any = "") {
    return process.env[property] || defaultValue
}

function getValuesFormEnv(kvs: Record<string, string | Function>) {

    const result: Record<string, any> = {};

    for (let [key, val] of Object.entries(kvs)) {
        const value = getValueFromEnv(key);
        if (typeof val === "function") {
            result[key] = val(value)
        } else {
            result[key] = value || val
        }
    }

    return result;

}

const propertiesConfig = {
    configFilePath: "",
    sectorName: "",
    type(val: string) {
        return +val || EnumUrlType.image
    },
    targetFolder: "",
    downloadScale(val: string) {
        return +val || 1
    },
    resizeScale(val: string) {
        return +val || 1
    },
    enableTranslation(val: string) {
        return !!+val || false
    },
    teamId: "",
    projectId: "",
    imageId: "",
}

export function getOptionsFromEnv(): BinDownloadOptions {
    return getValuesFormEnv(propertiesConfig) as BinDownloadOptions
}
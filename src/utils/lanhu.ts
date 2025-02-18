import { getQueryStringObject } from ".";
import { ConfigData } from "../config";
import { PSItemData } from "../services/types";
import { EnumUrlType, ConfigParamsInformation, DownloadOptions, EnumDownloadScale } from "../types";


const propertyMap: Record<EnumDownloadScale, "orgUrl" | "png_xxxhd"> = {
    [EnumDownloadScale.default]: "orgUrl",
    [EnumDownloadScale.double]: "png_xxxhd"
}

export function getPSItemAssets(data: PSItemData, scale: EnumDownloadScale = EnumDownloadScale.default) {
    // const { assets } = data;
    // const assetsMap: Record<string, PSAssertItem> = assets.reduce((obj, asset) => {
    //     obj[asset.id] = asset;
    //     return obj;
    // }, {});
    // const urls = data.info
    //     .map(item => {
    //         if (assetsMap[item.id]) {
    //             return {
    //                 url: item.ddsImages?.orgUrl!,
    //                 name: assetsMap[item.id].name,
    //                 enName: assetsMap[item.id].name,
    //             };
    //         }
    //     })
    //     .filter(Boolean);

    const urlProperty = propertyMap[scale];

    const assets = data.info
        .filter(item => item.isAsset)
        .map(item => ({
            // 先按照预期获取，如果没获得预期，就会先获取1倍图，然后是2被褥
            url: item.images[urlProperty] || item.images.orgUrl || item.images.png_xxxhd,
            name: item.name,
            enName: item.name,
        })).filter(item => item.url);

    return assets;
}


function createUnknownDownloadParams(message: string) {
    return {
        type: EnumUrlType.unknown,
        params: {
            message
        }
    }
}

export function getDownloadParamsByUrl(urlValue: string, options: DownloadOptions, config: ConfigData): ConfigParamsInformation<EnumUrlType> {

    const { sectorName, type } = options;

    const url = urlValue.toLowerCase();
    const qsMap = getQueryStringObject(url);

    const tid = qsMap.get("tid") || config.teamId;
    const pid = qsMap.get("pid") || qsMap.get("project_id");
    const image_id = qsMap.get("image_id");


    if (!tid || !pid || pid.length <= 30 || tid.length <= 30) {
        return createUnknownDownloadParams("url缺少必要参数 tid 或者 pid")
    }

    switch (type) {
        case EnumUrlType.project:
            return {
                type: EnumUrlType.project,
                params: {
                    tid,
                    pid
                }
            } as ConfigParamsInformation<EnumUrlType.project>;
        case EnumUrlType.sector:
            if (typeof sectorName !== "string" || sectorName.trim() == "")
                return createUnknownDownloadParams("缺少必要参数 sectorName")

            return {
                type: EnumUrlType.sector,
                params: {
                    tid,
                    pid,
                    sectorName
                }
            } as ConfigParamsInformation<EnumUrlType.sector>;
        case EnumUrlType.image:
            if (!image_id || image_id.length <= 30)
                return createUnknownDownloadParams("url缺少必要参数 image_id")

            return {
                type,
                params: {
                    tid,
                    pid,
                    image_id
                }
            }
        default:
            return createUnknownDownloadParams("错误的EnumUrlType值")
    }

}

import { getQueryStringObject } from ".";
import { PSItemData } from "../services/types";
import { EnumUrlType, ConfigParamsInformation, ConfigOptions } from "../types";

export function getPSItemAssets(data: PSItemData) {
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

    const urls = data.info
        .filter(item => item.isAsset)
        .map(item => ({
            url: item.images.png_xxxhd,
            name: item.name,
            enName: item.name,
        }));

    return urls;
}


function createUnknownUrlInformation(message: string) {
    return {
        type: EnumUrlType.unknown,
        params: {
            message
        }
    }
}

export function getConfigByUrl(urlValue: string, options: ConfigOptions): ConfigParamsInformation<EnumUrlType> {


    const { sectorName, type } = options;

    const url = urlValue.toLowerCase();
    const qsMap = getQueryStringObject(url);

    const tid = qsMap.get("tid");
    const pid = qsMap.get("pid") || qsMap.get("project_id");
    const image_id = qsMap.get("image_id");

    if (!tid || !pid || pid.length <= 30 || tid.length <= 30) {
        return createUnknownUrlInformation("url缺少必要参数 tid 或者 pid")
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
                return createUnknownUrlInformation("缺少必要参数 sectorName")

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
                return createUnknownUrlInformation("url缺少必要参数 image_id")

            return {
                type,
                params: {
                    tid,
                    pid,
                    image_id
                }
            }
        default:
            return createUnknownUrlInformation("错误的EnumUrlType值")
    }

}

import { getQueryStringObject } from ".";
import { ConfigData } from "../config";
import { AssetNameUrlInfo, PSAssertItem, PSItemData } from "../services/types";
import { EnumUrlType, ConfigParamsInformation, DownloadOptions, EnumDownloadScale } from "../types";


const propertyMap: Record<EnumDownloadScale, "orgUrl" | "png_xxxhd"> = {
    [EnumDownloadScale.default]: "orgUrl",
    [EnumDownloadScale.double]: "png_xxxhd"
}

const mergedPropertyMap: Record<EnumDownloadScale, "image" | "ddsImage"> = {
    [EnumDownloadScale.default]: "image",
    [EnumDownloadScale.double]: "ddsImage"
}

export function getPSItemAssets(data: PSItemData, scale: EnumDownloadScale = EnumDownloadScale.default): AssetNameUrlInfo[] {

    if (Array.isArray(data.assets) && data.assets.length > 0) {
        const urlProperty = propertyMap[scale];
        const { assets } = data;
        const assetsMap: Record<string, PSAssertItem> = assets.filter(ass => ass.isAsset).reduce((obj, asset) => {
            obj[`${asset.id}`] = asset;
            return obj;
        }, {} as Record<string, PSAssertItem>);
        const result = data.info
            .map(item => {
                if (item.isAsset && assetsMap[item.id]) {
                    return {
                        url: item.images[urlProperty] || item.images.orgUrl || item.images.png_xxxhd,
                        name: assetsMap[item.id].name,
                        enName: assetsMap[item.id].name,
                    };
                }
                return false
            })
            .filter(Boolean) as AssetNameUrlInfo[];
        return result;
    } else if (data.isMergeData) {
        const urlProperty = mergedPropertyMap[scale];

        const result = data.info.filter(item => !!item.exportable).map(item => {
            return {
                url: item[urlProperty]?.imageUrl || item.image?.imageUrl || item.ddsImage?.imageUrl,
                name: item.name,
                enName: item.name,
            }
        }).filter(it=> it.url)  as AssetNameUrlInfo[];

        return result;
    }


    return [];
}


function createUnknownDownloadParams(message: string) {
    return {
        type: EnumUrlType.unknown,
        params: {
            message
        }
    }
}

export function getDownloadParamsByUrl(urlValue: string, options: DownloadOptions, config: Pick<ConfigData, "teamId">): ConfigParamsInformation<EnumUrlType> {

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

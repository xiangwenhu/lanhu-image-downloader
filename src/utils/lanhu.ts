import { getQueryStringObject, sanitizeFileName } from ".";
import { ConfigData } from "../config";
import { AssetBaseInfo, PSAssertItem, PSItemData, PSItemDataInfo } from "../services/types";
import { EnumUrlType, ConfigParamsInformation, DownloadOptions, EnumDownloadScale } from "../types";


const UrlExtractor = {
    assets(item: PSItemDataInfo) {
        const images_png_xxxhd = item.images?.png_xxxhd;
        const images_orgUrl = item.images?.orgUrl;
        const ddsImages_images_png_xxxhd = item.ddsImage?.png_xxxhd;
        const ddsImages_images_imageUrl = item.ddsImage?.imageUrl;
        return images_png_xxxhd || ddsImages_images_png_xxxhd || images_orgUrl || ddsImages_images_imageUrl;

    },
    mergeData(item: PSItemDataInfo) {
        const image_imageUrl = item.image?.imageUrl;
        const ddsImage_imageUrl = item.ddsImage?.imageUrl;
        return image_imageUrl || ddsImage_imageUrl;
    }
}




export function getPSItemAssets(data: PSItemData): AssetBaseInfo[] {

    if (Array.isArray(data.assets) && data.assets.length > 0) {
        const { assets } = data;
        const assetsMap: Record<string, PSAssertItem> = assets.filter(ass => ass.isAsset && ass.isSlice).reduce((obj, asset) => {
            obj[`${asset.id}`] = asset;
            return obj;
        }, {} as Record<string, PSAssertItem>);
        const result = data.info
            .map(item => {
                if (item.isAsset && assetsMap[item.id]) {
                    const name = assetsMap[item.id].name;
                    let url = UrlExtractor.assets(item);

                    const value: AssetBaseInfo = {
                        url: url!,
                        name: name,
                        enName: name,
                        height: item.height,
                        width: item.width
                    };

                    return value
                }
                return undefined
            })
            .filter(it => it && it.url) as AssetBaseInfo[];
        return result;
    } else if (data.isMergeData) {
        const result = data.info.filter(item => {
            return !!item.exportable
        }).map(item => {
            const name = item.name;
            let url = UrlExtractor.mergeData(item)

            const value: AssetBaseInfo = {
                url: url!,
                name: name,
                enName: name,
                height: item.height,
                width: item.width
            };

            return value
        }).filter(Boolean).filter(it => it.url) as AssetBaseInfo[];

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

    const teamId = qsMap.get("tid") || config.teamId;
    const projectId = qsMap.get("pid") || qsMap.get("project_id");
    const imageId = qsMap.get("image_id");


    if (!teamId || !projectId || projectId.length <= 30 || teamId.length <= 30) {
        return createUnknownDownloadParams("url缺少必要参数 tid 或者 pid")
    }

    switch (type) {
        case EnumUrlType.project:
            return {
                type: EnumUrlType.project,
                params: {
                    teamId,
                    projectId
                }
            } as ConfigParamsInformation<EnumUrlType.project>;
        case EnumUrlType.sector:
            if (typeof sectorName !== "string" || sectorName.trim() == "")
                return createUnknownDownloadParams("缺少必要参数 sectorName")

            return {
                type: EnumUrlType.sector,
                params: {
                    teamId,
                    projectId,
                    sectorName
                }
            } as ConfigParamsInformation<EnumUrlType.sector>;
        case EnumUrlType.image:
            if (!imageId || imageId.length <= 30)
                return createUnknownDownloadParams("url缺少必要参数 image_id")

            return {
                type,
                params: {
                    teamId,
                    projectId,
                    imageId
                }
            }
        default:
            return createUnknownDownloadParams("错误的EnumUrlType值")
    }

}



function createNameFactory() {
    const map = new Map<string, number>();
    return function nameFactory(name: string) {

        const count = map.get(name) || 0;
        const rName = count === 0 ? name : `${name}_${count + 1}`
        map.set(name, count + 1);
        return rName;
    }
}


export function sanitizeAssetNames(assets: AssetBaseInfo[]): AssetBaseInfo[] {

    const nameFactory = createNameFactory();
    const enNameFactory = createNameFactory();

    return assets.map(asset => {
        return {
            ...asset,
            name: nameFactory(sanitizeFileName(asset.name)),
            enName: enNameFactory(sanitizeFileName(asset.enName || asset.name))
        }
    })
}
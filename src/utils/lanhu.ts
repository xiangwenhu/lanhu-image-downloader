import { arrayToRecord, getQueryStringObject, sanitizeFileName } from ".";
import { ConfigData } from "../config";
import { DevicesMap, IOSDevices, IOSDevicesMap } from "../const";
import { ConfigParamsInformation } from "../downloadBy.type";
import { AssetBaseInfo, AssetBaseInfoPlus, MasterJSONData, PsJSONData, SketchJSONData } from "../services/types";
import { EnumUrlType, CommonDownloadOptions, EnumPlatForm } from "../types";

// var h = c.value;
// h.image && (h.image.imageUrl = l(h.image.imageUrl, e),
// h.image.svgUrl = l(h.image.svgUrl, e)),
// h.images && (h.images.png_xxxhd = l(h.images.png_xxxhd, e),
// h.images.orgUrl = l(h.images.orgUrl, e),
// h.images.svg = l(h.images.svg, e))


const UrlExtractor = {
    ps(item: PsJSONData.Info) {
        const images_png_xxxhd = item.images?.png_xxxhd;
        const images_orgUrl = item.images?.orgUrl;
        const ddsImages_images_orgUrl = item.ddsImages?.orgUrl;
        return images_png_xxxhd || ddsImages_images_orgUrl || images_orgUrl;
    }
}

export function getTargetValue(originalValue: number, options: ScaleOptions & {
    slicescale: number;
    device: string;
}) {

    const { device, downloadScale, slicescale, platform } = options;

    if (platform === EnumPlatForm.Web) {
        if (device.toLowerCase().indexOf("web") > -1) {
            return Math.ceil(originalValue / 2 * downloadScale)
        } else {
            return Math.ceil(originalValue / slicescale * downloadScale)
        }
    } else {
        return Math.round(originalValue / 4 * downloadScale);
    }
}


const assetsExtractor = {
    master(data: MasterJSONData.Data): AssetBaseInfoPlus {
        const slicescale = data.meta.sliceScale;
        const device = data.meta.device;


        const assets = (data.artboard?.layers || []).filter(l => l.hasExportImage).map(l => {
            return {
                url: l.image?.imageUrl || "",
                name: l.name,
                enName: l.name,
                width: l.frame.width,
                height: l.frame.height
            }
        }).filter(a => !!a.url) as AssetBaseInfo[]

        return {
            assets,
            slicescale,
            device
        }
    },
    sketch(data: SketchJSONData.Data): AssetBaseInfoPlus {
        const infoRecord = arrayToRecord(data.info, "id");

        const slicescale = data.sliceScale;
        const device = data.device;

        const assets = data.info.filter(item => {
            return !!item.exportable && !!item.isVisible
        }).filter(t => {
            if (!t.image || !t.image.isNew || !t.image.imageUrl) return false;

            if (parentExportable(t, infoRecord)) return false;

            if (t.type === "layer-group") {
                return !t.symbolID && t.hasOwnProperty("opacity")
            }
            return true
        }).map(item => {
            const name = item.name;
            let url = item.image?.imageUrl || item.ddsImage?.imageUrl;
            const value: AssetBaseInfo = {
                url: url!,
                name: name,
                enName: name,
                width: item.width,
                height: item.height,
            };

            return value
        }).filter(Boolean).filter(it => it.url) as AssetBaseInfo[];

        return {
            assets,
            device,
            slicescale
        };
    },
    ps(data: PsJSONData.Data): AssetBaseInfoPlus {
        const { assets } = data;

        const slicescale = data.sliceScale;
        const device = data.device;

        //  l && l.isAsset && l.images && l.images.png_xxxhd || l.exportable
        const assetsMap: Record<string, PsJSONData.Assets> = assets.filter(ass => ass.isAsset && ass.isSlice).reduce((obj, asset) => {
            obj[`${asset.id}`] = asset;
            return obj;
        }, {} as Record<string, PsJSONData.Assets>);
        const result = data.info
            .map(item => {
                if (item.isAsset && assetsMap[item.id]) {
                    const name = assetsMap[item.id].name;
                    let url = UrlExtractor.ps(item);

                    const value: AssetBaseInfo = {
                        url: url!,
                        name: name,
                        enName: name,
                        width: item.width,
                        height: item.height,
                    };

                    return value
                }
                return undefined
            })
            .filter(it => it && it.url) as AssetBaseInfo[];

        return {
            assets: result,
            slicescale,
            device
        };
    }
}



/**
 * 父可以导出
 * @param item 
 * @param record 
 * @returns 
 */
function parentExportable(item: SketchJSONData.Info, record: Record<string, SketchJSONData.Info>) {
    if (!item.parentID) return false;

    let parentId = item.parentID;
    let pItem = record[parentId];
    do {
        if (pItem.exportable) return true;
        parentId = pItem.parentID;
        pItem = record[parentId]
    } while (pItem && pItem.id !== parentId)
}


interface ScaleOptions {
    downloadScale: number,
    platform: EnumPlatForm;
}

export function getPSItemAssets(jsonData: PsJSONData.Data | MasterJSONData.Data | SketchJSONData.Data): AssetBaseInfoPlus | undefined {

    const type = (jsonData as PsJSONData.Data | SketchJSONData.Data)?.type;
    const pluginName = (jsonData as MasterJSONData.Data)?.meta?.plugin?.name;

    if (pluginName === "master") return assetsExtractor.master(jsonData as MasterJSONData.Data);

    switch (type) {
        case "sketchPlugin":
            return assetsExtractor.sketch(jsonData as SketchJSONData.Data)
        case "ps":
            return assetsExtractor.ps(jsonData as PsJSONData.Data)
        default:
            return undefined
    }
}


function createUnknownDownloadParams(message: string) {
    return {
        type: EnumUrlType.unknown,
        params: {
            message
        }
    }
}

export function getDownloadParamsByUrl(urlValue: string, options: CommonDownloadOptions & {
    sectorName?: string;
    type: EnumUrlType
}, config: Pick<ConfigData, "teamId">): ConfigParamsInformation<EnumUrlType> {

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


import { PSItemData } from "../services/types";

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
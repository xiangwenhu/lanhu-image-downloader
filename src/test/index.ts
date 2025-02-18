import path from "path";
import downloadByUrl from "../index";
import { EnumUrlType } from "../types";


; (async function init() {
    const url = '';

    const configPath = path.join(__dirname, "../../data/config.json")

    downloadByUrl(url, configPath, {
        targetFolder: path.join(__dirname, "../../data"),
        type: EnumUrlType.image,
        sectorName: "未分组"
        // sectorName: "未标题-1"
        // downloadScale: 2,
        // resizeScale: 0.5
    })

})();
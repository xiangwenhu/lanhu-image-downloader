import path from "path";
import { EnumUrlType } from "../src/types";
import { downloadByUrl } from "../src/index";
import { URLS } from "./url";


; (async function init() {
    const url = URLS.imageIsMerged;


    const configPath = path.join(__dirname, "../data/config.json")

    downloadByUrl(url, configPath, {
        targetFolder: path.join(__dirname, "../data"),
        type: EnumUrlType.image,
        sectorName: "未分组",
        // sectorName: "未标题-1"
        downloadScale: 2,
        // resizeScale: 0.5,
        enableTranslation: true
    })

})();
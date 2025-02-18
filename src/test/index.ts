import path from "path";
import downloadByUrl from "../index";
import { EnumUrlType } from "../types";


; (async function init() {
    const url = 'https://lanhuapp.com/web/#/item/project/detailDetach?tid=e4052c64-0e4a-4282-8726-b477f0881a9b&pid=aed2319c-77f4-4451-a4f6-cb395726c351&project_id=aed2319c-77f4-4451-a4f6-cb395726c351&image_id=2528ffcd-f26f-4792-915f-a15d63bcac5a&fromEditor=true&type=image';


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
import path from "path";
import { EnumCutImageStyle, EnumUrlType } from "../src/types";
import { downloadByUrl } from "../src/index";
import { URLS } from "./url";
import { setLogger } from "../src/logger";


const myConsole = {
    /**
 * 记录一条通用日志信息
 * @param messages 要记录的日志信息，可以是多个参数
 */
    log(...messages: any[]) {
        console.log('log', ...messages);
    },

    /**
     * 记录一条信息级别的日志信息
     * @param messages 要记录的日志信息，可以是多个参数
     */
    info(...messages: any[]) {
        console.log('info', ...messages);
    },

    /**
     * 记录一条警告级别的日志信息
     * @param messages 要记录的日志信息，可以是多个参数
     */
    warn(...messages: any[]) {
        console.log('warn', ...messages);
    },

    /**
     * 记录一条错误级别的日志信息
     * @param messages 要记录的日志信息，可以是多个参数
     */
    error(...messages: any[]) {
        console.log('error', ...messages);
    },
};


; (async function init() {
    const url = URLS.sketch.imageDuplicateNames;


    setLogger(myConsole)
    const configPath = path.join(__dirname, "../lanhu.config.json")

    downloadByUrl(url, configPath, {
        targetFolder: path.join(__dirname, "../data/sketch/imageDuplicateNames"),
        type: EnumUrlType.image,
        sectorName: "未分组",
        // sectorName: "未标题-1"
        downloadScale: 3,
        // resizeScale: 0.5,
        enableTranslation: false,
        cutImageStyle: EnumCutImageStyle.JPG
    })

})();
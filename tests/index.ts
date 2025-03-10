import path from "path";
import { EnumCutImageStyle, EnumPlatForm, EnumUrlType } from "../src/types";
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
    const url = URLS.ps.SizeSame;


    setLogger(myConsole)
    const configPath = path.join(__dirname, "../lanhu.config.json")

    downloadByUrl(url, configPath, {
        targetFolder: path.join(__dirname, "../data/ps/SizeSame"),
        type: EnumUrlType.image,
        sectorName: "未分组",
        downloadScale: 4,
        enableTranslation: false,
        cutImageStyle: EnumCutImageStyle.JPG,
        platform: EnumPlatForm.Android
    })

})();
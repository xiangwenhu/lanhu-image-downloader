import "petal-service";
import { readConfig } from "./config";
import LanHuDownloader from "./LanHuDownloader";
import { DownloadOptions, ConfigParamsInformation, EnumUrlType } from "./types";
import { getDownloadParamsByUrl } from "./utils/lanhu";
import { execFileSync } from "child_process";

export default function downloadByUrl(url: string, configFilePath: string, downloadOptions: DownloadOptions) {

    if(execFileSync(configFilePath)){
        throw new Error(`配置文件不存在：${configFilePath}`)
    }

    // 读取配置
    const config = readConfig(configFilePath);
    // 设置服务的cookie
    petalSetConfig({
        headers: {
            cookie: config.cookies.map(c => `${c.name}=${c.value}`).join("; ")
        }
    })
    // 从url中解析下载参数
    const downloadParams = getDownloadParamsByUrl(url, downloadOptions, config);
    if (downloadParams.type === EnumUrlType.unknown)
        throw new Error((downloadParams as ConfigParamsInformation<EnumUrlType.unknown>).params.message);

    const team_id = (downloadParams as ConfigParamsInformation<EnumUrlType.project>).params.tid;

    const downloader = new LanHuDownloader({
        team_id,
        downloadScale: downloadOptions.downloadScale || config.downloadScale,
        resizeScale: downloadOptions.resizeScale || config.resizeScale
    });

    const { targetFolder } = downloadOptions;

    switch (downloadOptions.type) {
        case EnumUrlType.project:
            const paramsP = (downloadParams as ConfigParamsInformation<EnumUrlType.project>).params;
            downloader.downloadProject({ project_id: paramsP.pid, targetFolder })
            break;
        case EnumUrlType.sector:
            const paramsS = (downloadParams as ConfigParamsInformation<EnumUrlType.sector>).params;
            downloader.downloadProjectGroup({ project_id: paramsS.pid, targetFolder, sectorName: paramsS.sectorName })
            break;
        case EnumUrlType.image:
            const paramsImg = (downloadParams as ConfigParamsInformation<EnumUrlType.image>).params;
            downloader.downloadSingleItem({ project_id: paramsImg.pid, targetFolder, image_id: paramsImg.image_id })
            break;
        default:
            throw new Error(`无效的type ${downloadOptions.type}`);
    }

}
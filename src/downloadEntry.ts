import "petal-service";
import { readConfig } from "./config";
import { LanHuDownloader } from "./LanHuDownloader";
import { DownloadOptions, ConfigParamsInformation, EnumUrlType, BinDownloadOptions } from "./types";
import { getDownloadParamsByUrl } from "./utils/lanhu";
import { existsSync } from "fs";

export function downloadByUrl(url: string, configFilePath: string, options: DownloadOptions) {

    if (!existsSync(configFilePath)) {
        throw new Error(`配置文件不存在：${configFilePath}`)
    }

    // 读取配置
    const config = readConfig(configFilePath);

    const cookie = Array.isArray(config.cookies) ? config.cookies.map(c => `${c.name}=${c.value}`).join("; ") : `${config.cookies}`;

    // 设置服务的cookie
    petalSetConfig({
        headers: {
            cookie
        }
    });
    // 从url中解析下载参数
    const downloadParams = getDownloadParamsByUrl(url, options, config);
    if (downloadParams.type === EnumUrlType.unknown)
        throw new Error((downloadParams as ConfigParamsInformation<EnumUrlType.unknown>).params.message);

    const teamId = (downloadParams as ConfigParamsInformation<EnumUrlType.project>).params.teamId;

    const downloader = new LanHuDownloader({
        teamId,
        downloadScale: options.downloadScale || config.downloadScale,
        resizeScale: options.resizeScale || config.resizeScale,
        enableTranslation: options.enableTranslation || config.enableTranslation
    });

    const { targetFolder } = options;

    switch (options.type) {
        case EnumUrlType.project:
            const paramsP = (downloadParams as ConfigParamsInformation<EnumUrlType.project>).params;
            downloader.downloadProject({ projectId: paramsP.projectId, targetFolder })
            break;
        case EnumUrlType.sector:
            const paramsS = (downloadParams as ConfigParamsInformation<EnumUrlType.sector>).params;
            downloader.downloadProjectGroup({ projectId: paramsS.projectId, targetFolder, sectorName: paramsS.sectorName })
            break;
        case EnumUrlType.image:
            const paramsImg = (downloadParams as ConfigParamsInformation<EnumUrlType.image>).params;
            downloader. downloadSingle({ projectId: paramsImg.projectId, targetFolder, imageId: paramsImg.imageId })
            break;
        default:
            throw new Error(`无效的type ${options.type}`);
    }

}

export function downloadByOptions(options: BinDownloadOptions) {

    const { configFilePath, teamId, downloadScale, resizeScale, enableTranslation, projectId, sectorName, imageId } = options;

    if (!existsSync(configFilePath)) {
        throw new Error(`配置文件不存在：${configFilePath}`)
    }

    // 读取配置
    const config = readConfig(configFilePath);

    const cookie = Array.isArray(config.cookies) ? config.cookies.map(c => `${c.name}=${c.value}`).join("; ") : `${config.cookies}`;

    // 设置服务的cookie
    petalSetConfig({
        headers: {
            cookie
        }
    });

    const downloader = new LanHuDownloader({
        teamId: teamId || config.teamId,
        downloadScale: downloadScale || config.downloadScale,
        resizeScale: resizeScale || config.resizeScale,
        enableTranslation: enableTranslation || config.enableTranslation
    });

    const { targetFolder } = options;

    switch (options.type) {
        case EnumUrlType.project:
            downloader.downloadProject({ projectId, targetFolder })
            break;
        case EnumUrlType.sector:
            downloader.downloadProjectGroup({ projectId, targetFolder, sectorName })
            break;
        case EnumUrlType.image:
            downloader. downloadSingle({ projectId, targetFolder, imageId })
            break;
        default:
            throw new Error(`无效的type ${options.type}`);
    }

}
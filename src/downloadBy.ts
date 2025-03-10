import { existsSync } from "fs";
import "petal-service";
import { readConfig } from "./config";
import { BinDownloadOptions, ConfigParamsInformation, DownloadByUrlOptions } from "./downloadBy.type";
import { LanHuDownloader } from "./LanHuDownloader";
import { DownloadOptionsWithTargetFolder, EnumUrlType } from "./types";
import { getDownloadParamsByUrl } from "./utils/lanhu";

export function downloadByUrl(url: string, configFilePath: string, options: DownloadByUrlOptions) {

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
        enableTranslation: options.enableTranslation || config.enableTranslation,
        platform: options.platform
    });

    const { targetFolder } = options;

    const downloadOptions: DownloadOptionsWithTargetFolder = {
        targetFolder,
        cutImageStyle: options.cutImageStyle,
        downloadScale: options.downloadScale,
        enableTranslation: options.enableTranslation,
        platform: options.platform
    }

    switch (options.type) {
        case EnumUrlType.project:
            const paramsP = (downloadParams as ConfigParamsInformation<EnumUrlType.project>).params;
            downloader.downloadProject({ projectId: paramsP.projectId }, downloadOptions)
            break;
        case EnumUrlType.sector:
            const paramsS = (downloadParams as ConfigParamsInformation<EnumUrlType.sector>).params;
            downloader.downloadProjectGroup({ projectId: paramsS.projectId, sectorName: paramsS.sectorName }, downloadOptions)
            break;
        case EnumUrlType.image:
            const paramsImg = (downloadParams as ConfigParamsInformation<EnumUrlType.image>).params;
            downloader.downloadSingle({ projectId: paramsImg.projectId, imageId: paramsImg.imageId }, downloadOptions)
            break;
        default:
            throw new Error(`无效的type ${options.type}`);
    }

}

export function downloadByOptions(options: BinDownloadOptions) {

    const { configFilePath, teamId, downloadScale, enableTranslation, projectId, sectorName, imageId } = options;

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

    const { targetFolder } = options;

    const downloadOptions: DownloadOptionsWithTargetFolder = {
        targetFolder
    }

    const downloader = new LanHuDownloader({
        teamId: (teamId || config.teamId) as string,
        cutImageStyle: options.cutImageStyle,
        downloadScale: downloadScale || config.downloadScale,
        enableTranslation: enableTranslation || config.enableTranslation
    });


    switch (options.type) {
        case EnumUrlType.project:
            downloader.downloadProject({ projectId }, downloadOptions)
            break;
        case EnumUrlType.sector:
            if (!sectorName) throw new Error(`缺少必要参数sectorName`);
            downloader.downloadProjectGroup({ projectId, sectorName }, downloadOptions)
            break;
        case EnumUrlType.image:
            downloader.downloadSingle({ projectId, imageId }, downloadOptions)
            break;
        default:
            throw new Error(`无效的type ${options.type}`);
    }

}
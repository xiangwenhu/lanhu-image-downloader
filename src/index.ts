import LanHuDownloader from "./LanHuDownloader";
import { ConfigOptions, ConfigParamsInformation, EnumUrlType } from "./types";
import { getConfigByUrl } from "./utils/lanhu";

export default function downloadByUrl(url: string, config: ConfigOptions) {
    const configParams = getConfigByUrl(url, config);
    if (config.type === EnumUrlType.unknown)
        return console.error((configParams as ConfigParamsInformation<EnumUrlType.unknown>).params.message);


    const team_id = (configParams as ConfigParamsInformation<EnumUrlType.project>).params.tid;

    const downloader = new LanHuDownloader({
        team_id: team_id
    });

    const { targetFolder } = config;


    switch (config.type) {
        case EnumUrlType.project:
            const paramsP = (configParams as ConfigParamsInformation<EnumUrlType.project>).params;
            downloader.downloadProject({ project_id: paramsP.pid, targetFolder })
            break;
        case EnumUrlType.sector:
            const paramsS = (configParams as ConfigParamsInformation<EnumUrlType.sector>).params;
            downloader.downloadProjectGroup({ project_id: paramsS.pid, targetFolder, sectorName: paramsS.sectorName })
            break;
        case EnumUrlType.image:
            const paramsImg = (configParams as ConfigParamsInformation<EnumUrlType.image>).params;
            downloader.downloadSingleItem({ project_id: paramsImg.pid, targetFolder, image_id: paramsImg.image_id })
            break;
        default:
            break;
    }

}
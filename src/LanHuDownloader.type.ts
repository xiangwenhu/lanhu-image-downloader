import { ProjectImageInfo, SectorItem } from "./services/types";
import { CommonDownloadOptions, CommonParamsOptions, NullableTeamIdParams } from "./types";

export type LanHuDownloaderConstructorOptions = Partial<CommonDownloadOptions & Pick<CommonParamsOptions, "teamId">>;

export type DownloadSingleItemParams = NullableTeamIdParams & Pick<CommonParamsOptions, "projectId" | "imageId">;

export type DownloadProjectGroupParams = NullableTeamIdParams & Pick<CommonParamsOptions, "projectId"> & {
    sectorName: string;
}

export type DownloadProjectGroupInnerParams = NullableTeamIdParams & {
    sector: SectorItem;
    projectImages: ProjectImageInfo[];
    projectId: string;
}

export interface DownloadProjectGroupByUrlParams {
    url: string;
    sectorName: string;
}

export interface DownloadProjectByUrlParams {
    url: string;
}

export type DownloadProjectParams = NullableTeamIdParams & {
    projectId: string;
}
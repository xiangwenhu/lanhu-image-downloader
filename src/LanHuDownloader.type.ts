import { ProjectImageInfo, SectorItem } from "./services/types";
import { EnumDownloadScale } from "./types";

export interface LanHuDownloaderOptions {
    /**
     * 下载的图片的切图大小， 1 | 2倍尺寸
     */
    downloadScale?: EnumDownloadScale;
    /**
     * 下载后重新调整图片的大小，一般选择缩小
     */
    resizeScale?: number;
    teamId?: string;
    /**
     * 启用翻译
     */
    enableTranslation?: boolean;
}

export interface DownloadSingleItemOptions {
    imageId: string;
    targetFolder: string;
    projectId: string;
}

export interface DownloadSingleByUrlOptions {
    url: string;
    targetFolder: string;
    type?: string;
}

export interface DownloadProjectGroupOptions {
    projectId: string;
    sectorName: string;
    targetFolder: string;
}

export interface DownloadProjectGroupInnerOptions {
    sector: SectorItem;
    projectImages: ProjectImageInfo[];
    projectId: string;
    targetFolder: string;
}

export interface DownloadProjectGroupByUrlOptions {
    url: string;
    targetFolder: string;
    sectorName: string;
}

export interface DownloadProjectByUrlOptions {
    url: string;
    targetFolder: string;
}

export interface DownloadProjectOptions {
    targetFolder: string;
    projectId: string;
}
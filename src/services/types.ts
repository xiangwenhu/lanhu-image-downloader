export interface PSItemData {
    exVersion: string;
    psVersion: number;
    parerVersion: string;
    type: string;
    device: string;
    sliceScale: 2;
    psdName: string;
    newSid: string;
    rawId: string;
    imgMD5: string;
    assets: PSAssertItem[];
    info: PSItemDataInfo[];
}

export interface PSAssertItem {
    id: number;
    isAsset?: boolean;
    isSlice: boolean;
    name: string;
    enName?: string;
    scaleType: string;
    type: "bitmap" | "shape" | "text" | "symbol" | "layer-group" | "layerSection" | "layer" | "shapeLayer" | "textLayer",
    exportable?: boolean;
    hasExportDDSImage: boolean;
    image?: {
        url: string;
    },
    ddsImage?: {
        url: string;
    }
}

interface PSItemDataInfo {
    id: number;
    index: number;
    type: string;
    name: string;
    visible: boolean;
    clipped: boolean;
    generatorSettings: boolean;
    ddsImages?: { orgUrl: string; base: string };
    isAsset: true;
    images: {
        orgUrl: string;
        base: string;
        png_xxxhd: string;
        svg: string;
    };
}

export interface VersionInfo {
    height: number;
    id: string;
    json_md5: string | null;
    json_url: string;
    md5: string | null;
    type: 'image';
    updated: true;
    url: string;
    url_md5: string | null;
    version_info: string;
    version_layout_data: null;
    width: number;
}

export interface SectorItem {
    id: string;
    images: string[];
    name: string;
    order: number;
    parent_id: number | null;
}

export interface ProjectImageInfo {
    batch: string;
    create_time: string;
    dds_jump_status: number;
    extra_attrs: string;
    group: any[];
    has_comment: boolean;
    height: number;
    home: boolean;
    id: string;
    is_replaced: boolean;
    last_version_num: number;
    latest_version: string;
    layout_data: string;
    name: string;
    englishName?: string;
    enName?: string;
    order: null;
    pinyinname: string;
    position_x: number;
    position_y: number;
    positions: any[];
    share_id: string;
    sketch_id: string;
    source: boolean;
    trash_recovery: boolean;
    type: string;
    update_time: string;
    url: string;
    user_id: string;
    width: number;
}

/**
 * 项目分组信息
 */
export type RSProjectSectors = {
    code: string;
    msg: string;
    data: {
        sectors: SectorItem[];
    };
};

/**
 * 某个图片（设计稿的）版本信息
 */
export type RSImageVersions = {
    result: {
        versions: VersionInfo[];
    };
};

/**
 * 某个项目的所有图片（设计稿）
 */
export type RSProjectImages = {
    code: string;
    data: {
        has_next: boolean;
        id: string;
        images: ProjectImageInfo[];
    };
    msg: string;
};

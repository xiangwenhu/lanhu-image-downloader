export interface ResData<T = any> {
    /**
     * 0为0
     */
    code: number;
    data: T;
    message: string;
}

export interface ResResult<T = any> {
    /**
     * 0为0
     */
    code: string;
    result: T;
    message: string;
}


export interface PSItemData {
    board: {
        name: string;
    },
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
    assets?: PSAssertItem[];
    info: PSItemDataInfo[];
    isMergeData?: boolean;
}

export interface PSAssertItem {
    id: number;
    isAsset: boolean;
    isSlice: boolean;
    name: string;
    enName?: string;
    scaleType?: string;
}

interface ImageSize {
    height: number;
    width: number;
}

export interface PSItemDataInfo {
    id: string;
    index: number;
    name: string;
    visible: boolean;
    isVisible?: boolean;
    clipped: boolean;
    generatorSettings: boolean;
    ddsImages?: { orgUrl: string; base: string };
    isAsset: true;
    images: {
        orgUrl: string;
        base: string;
        png_xxxhd: string;
        svg: string;
        svgUrl?: string;
    };
    type: "bitmap" | "shape" | "text" | "symbol" | "layer-group" | "layerSection" | "layer" | "shapeLayer" | "textLayer",
    exportable?: boolean;
    hasExportDDSImage: boolean;
    image?: {
        isNew: boolean;
        svgUrl?: string;
        svg?: string;
        bitmap?: string;
        imageUrl: string;
        size: ImageSize
    };
    ddsImage?: {
        imageUrl?: string;
        png_xxxhd?: string;
    };

    width: number
    height: number;
    symbolID: string;
    originIndex: number;
    isCopy?: boolean;
    parentID: string
    opacity?: string;
}

export interface AssetBaseInfo {
    name: string;
    enName?: string;
    url: string;
    svgUrl?: string;
    height: number;
    width: number;
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
export type RSProjectSectors = ResData<{
    sectors: SectorItem[];
}>


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
export type RSProjectImages = ResData<{
    has_next: boolean;
    id: string;
    images: ProjectImageInfo[];
}>;



export interface UserTeam {
    id: string;
    name: string;
    member_num: number;
    left_days: number;
    company: string;
    phone: string;
    tenant_status: number;
    orders: number;
    is_team_owner: boolean;
    nickname: string;
}


export type ResUserTeam = ResResult<UserTeam[]>;


export enum EnumSourceType {
    /**
     * 设计项目
     */
    Project = 'dc_prj',
    /**
     * 思维云图
     */
    Board = 'board',

    /**
     * 超级文档
     */
    Doc = 'ts_single_doc',
    /**
     * 文件夹
     */
    Folder = 'folder'
}


export interface TeamSourceItem {
    id: number;
    sourceName: string;
    sourceType: EnumSourceType;
    sourceId: string;
    sourceShortId: string;
    sourceThumbnail: string;
    sourceBg: string;
    parentId: number;
    openTime: number;
    updateTime: number;
    createTime: number;
    orderIndex: number;
    creator: string;
    permissionType: number;
}

export type ResTeamSource = ResData<TeamSourceItem[]>
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




/**
 * plugin:master
 * 和 PSItemDataInfo 同类
 * 
 */
export namespace MasterJSONData {

    export interface Data {
        assets: (string)[];
        artboard: ArtBoard;
        meta: Meta;
    }

    interface Frame {
        left: number;
        top: number;
        height: number;
        width: number;
    }

    interface Image {
        imageUrl: string;
        svgUrl: string;
    }
    interface Layers {
        clipped: boolean;
        frame: Frame;
        hasExportDDSImage: boolean;
        hasExportImage: boolean;
        id: string;
        isMask: boolean;
        layers: any[];
        name: string;
        opacity: number;
        radius: any[];
        realFrame: Frame;
        type: string;
        visible: boolean;
        origin: string;
        combinedFrame?: Frame;
        image?: Image;
    }
    interface ArtBoard {
        id: string;
        name: string;
        type: string;
        visible: boolean;
        opacity: number;
        frame: Frame;
        realFrame: Frame;
        clipped: boolean;
        isMask: boolean;
        hasExportImage: boolean;
        hasExportDDSImage: boolean;
        origin: string;
        rotation: number;
        transform: ((number)[])[];
        layers: Layers[];
    }
    interface Host {
        name: string;
        version: string;
    }
    interface Plugin {
        name: string;
        version: string;
    }
    interface Meta {
        device: string;
        sliceScale: number;
        id: string;
        host: Host;
        plugin: Plugin;
    }

}

export namespace SketchJSONData {

    export interface Data {
        flow: boolean;
        imageUrlList: (string)[];
        isMergeData: boolean;
        ArtboardID: string;
        sketchVersion: SketchVersion;
        ArtboardScale: number;
        sliceScale: number;
        skBuild: number;
        pluginVersion: string;
        skVersion: number;
        flowData: any[];
        pageName: string;
        info: Info[];
        plVersion: string;
        device: string;
        url_md5: string;
        md5: string;
        json_md5: string;
        type: "sketchPlugin";
        exportScale: number;
    }


    interface SketchVersion {
    }

    interface DdsOriginFrame {
        height: number;
        x: number;
        y: number;
        width: number;
    }
    interface Size {
        height: number;
        width: number;
    }
    interface Point {
        x: number;
        y: number;
    }
    interface DdsImage {
        isNew: number;
        size: Size;
        imageUrl: string;
        point: Point;
    }
    interface LayerOriginFrame {
        height: number;
        x: number;
        y: number;
        width: number;
    }

    interface Image {
        svgUrl: string;
        isNew: number;
        size: Size;
        imageUrl: string;
        point: Point;
    }

    export interface Info {
        id: string;
        top: number;
        left: number;
        name: string;
        height: number;
        ddsType?: string;
        position_x?: number;
        index: string | number;
        position_y?: number;
        width: number;
        layers: any[];
        hasExportDDSImage?: boolean;
        isFlippedHorizontal?: boolean;
        hasFixedLeft?: boolean;
        edited?: boolean;
        isFlippedVertical?: boolean;
        isVisible?: boolean;
        influenceHeight?: number;
        booleanOperation?: number;
        hasFixedWidth?: boolean;
        type?: string;
        ddsOriginFrame?: DdsOriginFrame;
        hasFixedBottom?: boolean;
        blendMode?: number;
        hasClippingMask?: number;
        rotation?: number;
        isLocked?: boolean;
        opacity?: number;
        startMarkerType?: number;
        hasFixedRight?: boolean;
        exportable?: boolean;
        windingRule?: number;
        hasFixedTop?: boolean;
        ddsImage?: DdsImage;
        isAutolayout?: boolean;
        miterLimit?: number;
        influenceWidth?: number;
        layerOriginFrame?: LayerOriginFrame;
        isClosed?: boolean;
        pointRadiusBehaviour?: number;
        parentID: string;
        endMarkerType?: number;
        shouldBreakMaskChain?: boolean;
        hasFixedHeight?: boolean;
        influenceLeft?: number;
        influenceTop?: number;
        clippingMaskMode?: number;
        symbolInstanceID?: string;
        symbolID?: string;
        symbolMasterID?: string;
        dontSynchroniseWithSymbol?: boolean;
        kerning?: number;
        lineSpacingBehaviour?: number;
        automaticallyDrawOnUnderlyingPath?: boolean;
        characterSpacing?: number;
        textBehaviour?: number;
        ddsOriginSymbolID?: string;
        ddsOriginSymbolInstanceID?: string;
        isCopy?: boolean;
        ddsOriginSymbolMasterID?: string;
        image?: Image;
    }

}

export namespace PsJSONData {

    export interface Data {
        board: Board;
        exVersion: string;
        psVersion: number;
        parerVersion: string;
        type: "ps";
        device: string;
        sliceScale: number;
        info: Info[];
        assets: Assets[];
        psdName: string;
        newSid: string;
        rawId: string;
        imgMD5: string;
    }


    interface Images {
        base: string;
        png_xxxhd: string;
    }

    interface RealFrame {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    interface DdsImages {
        orgUrl: string;
        base: string;
    }


    interface Layers {
        id: number;
        type: string;
        name: string;
        visible: boolean;
        clipped: boolean;
        generatorSettings: boolean;
        layers?: any[];
        isAsset: boolean;
        isSlice: boolean;
        width?: number;
        height?: number;
        top?: number;
        left?: number;
        images?: Images;
        realFrame?: RealFrame;
        ddsImages?: DdsImages;
        hasExportDDSImage?: boolean;
        index?: number;
    }

    interface Board {
        id: number;
        index: number;
        type: string;
        name: string;
        visible: boolean;
        clipped: boolean;
        layers: Layers[];
        resolution: number;
        left: number;
        top: number;
        isAsset: boolean;
        isSlice: boolean;
        width: number;
        height: number;
    }
    interface Images {
        base: string;
        orgUrl?: string;
        png_xxxhd: string;
        svg?: string;
    }
    interface RealFrame2 {
        left: number;
        top: number;
        width: number;
        height: number;
    }
    interface DdsImages {
        orgUrl: string;
        base: string;
    }
    export interface Info {
        id: number;
        index?: number;
        type: string;
        name: string;
        visible: boolean;
        clipped: boolean;
        generatorSettings: boolean;
        layers: Layers[];
        resolution?: number;
        left: number;
        top: number;
        isAsset: boolean;
        isSlice: boolean;
        width: number;
        height: number;
        images?: Images;
        realFrame?: RealFrame2;
        hasExportDDSImage?: boolean;
        ddsImages?: DdsImages
    }

    export interface Assets {
        name: string;
        id: number;
        isAsset: boolean;
        isSlice: boolean;
        scaleType: string;
    }
}

export type PSItemJSONData = MasterJSONData.Data | SketchJSONData.Data | PsJSONData.Data;

export interface AssetBaseInfoPlus {
    assets: AssetBaseInfo[];
    slicescale: number;
    device: string;
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
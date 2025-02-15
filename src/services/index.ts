import fsPlus from 'fs/promises';
import "petal-service"
import { PSItemData, RSProjectImages, RSProjectSectors } from "./types";

interface GetProjectImagesParams {
    project_id: string;
    team_id: string;
}

export interface PSItemParams {
    image_id: string;
    team_id: string;
    project_id: string;
}

interface GetProjectSectorsParam {
    project_id: string;
}


@petalClassDecorator({
    baseURL: "https://lanhuapp.com/api",
    timeout: 30 * 1000
})
class LanHuService extends PetalBaseService {

    /**
     * 获取项目的全部图片（设计稿）
     * @param _params 
     * @returns 
     */
    @petalMethodDecorator({
        url: "/project/images",
        params: {
            dds_status: 1, position: 1, comment: 1
        }
    })
    getProjectImages(_params: PetalParamsPick.Params<GetProjectImagesParams>) {
        const res = this.res.data as RSProjectImages;
        return res.data.images;
    }


    @petalMethodDecorator({
        url: "/project/project_sectors"
    })
    getProjectSectors(_params: PetalParamsPick.Params<GetProjectSectorsParam>) {
        const res = this.res.data as RSProjectSectors;
        return res.data.sectors;
    }

    /**
     * 获取设计稿地址
     * @param _params 
     * @returns 
     */
    @petalMethodDecorator({
        url: "/project/image",
        params: {
            all_versions: 0
        }
    })
    async getPSItemUrl(_params: PetalParamsPick.Params<PSItemParams>) {
        const version = this.res.data.result.versions[0];
        return version.json_url || null;
    }

    @petalMethodDecorator({})
    request<T = any>(_params: PetalParamsPick.Native): Promise<T> {
        return this.res.data as any
    }

    getPSItemData(url: string) {
        return this.request<PSItemData>({
            config: {
                url
            }
        })
    }

    downloadAssert(url: string, targetPath: string) {
        return this.request<NodeJS.ArrayBufferView>({
            config: {
                url,
                responseType: "arraybuffer"
            }
        }).then(data => fsPlus.writeFile(targetPath, data, 'binary'))
    }

}


export default new LanHuService();
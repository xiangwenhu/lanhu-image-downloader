import fsPlus from 'fs/promises';
import "petal-service"
import { PSItemJSONData, ResTeamSource, ResUserTeam, RSProjectImages, RSProjectSectors } from "./types";
import { getLogger } from '../logger';

interface GetProjectImagesParams {
    project_id: string;
    team_id: string;
}

export interface GetPSItemParams {
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


    private get logger() {
        return getLogger();
    }

    /**
     * 获得用户所在的全部团队信息
     * @returns 
     */
    @petalMethodDecorator({
        url: "/account/user_teams",
        params: {
            need_open_related: true,
        }
    })
    async getUserTeams() {
        const res = this.res.data as ResUserTeam;
        return res.result;
    }



    /**
     * 获得某个team的全部资源（项目，云图，文档等）
     * @returns 
     */
    @petalMethodDecorator({
        url: "https://lanhuapp.com/workbench/api/workbench/abstractfile/list",
        method: "post"
    })
    async getTeamSourceList(_params: PetalParamsPick.Data<{
        parentId: number;
        tenantId: string;
    }>) {
        const res = this.res.data as ResTeamSource;
        return res.data;
    }


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
    async getProjectImages(_params: PetalParamsPick.Params<GetProjectImagesParams>) {
        const res = this.res.data as RSProjectImages;
        return res.data.images;
    }


    /**
     * 获得项目的全部分组 sector
     */
    @petalMethodDecorator({
        url: "/project/project_sectors"
    })
    async getProjectSectors(_params: PetalParamsPick.Params<GetProjectSectorsParam>) {
        const res = this.res.data as RSProjectSectors;
        return res.data.sectors;
    }

    /**
     * 获取设最新版本计稿地址
     * @param _params 
     * @returns 
     */
    @petalMethodDecorator({
        url: "/project/image",
        params: {
            all_versions: 0
        }
    })
    async getPSItemUrl(_params: PetalParamsPick.Params<GetPSItemParams>) {
        const version = this.res.data.result.versions[0];
        return version.json_url || null;
    }

    @petalMethodDecorator({})
    request<T = any>(_params: PetalParamsPick.Native): Promise<T> {
        return this.res.data as any
    }

    getPSItemData(url: string) {
        return this.request<PSItemJSONData>({
            config: {
                url
            }
        })
    }

    /**
     * 下载图片
     * @param url 
     * @param targetPath 
     * @returns 
     */
    downloadAssert(url: string, targetPath: string) {
        return this.request<NodeJS.ArrayBufferView>({
            config: {
                url: url,
                responseType: "arraybuffer",
                params: {
                    noCache: true
                }
            }
        }).then(data => fsPlus.writeFile(targetPath, data, 'binary'))
    }

    async downloadWithFallbacks(originalUrl: string, targetPath: string, domainAlternatives: string[] = ["alipic.lanhuapp.com"]) {
        let urlsToTry = [originalUrl];
        if (domainAlternatives && domainAlternatives.length > 0) {
            domainAlternatives.forEach(domain => {
                const newUrl = new URL(originalUrl);
                newUrl.hostname = domain;
                urlsToTry.push(newUrl.toString());
            });
        }

        for (let i = 0; i < urlsToTry.length; i++) {
            try {
                this.logger.log(`尝试下载URL: ${urlsToTry[i]}`);
                // 尝试下载资源
                return await this.downloadAssert(urlsToTry[i], targetPath);
            } catch (error: any) {
                this.logger.error("下载失败：", error.message);
            }
        }
        throw new Error(`切图下载失败：${originalUrl}`);
    }

}


export default new LanHuService();
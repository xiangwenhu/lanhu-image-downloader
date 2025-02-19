import { EnumUrlType } from "../src/types";
import { getDownloadParamsByUrl } from "../src/utils/lanhu";


const url1 = `https://lanhuapp.com/web/#/item/project/detailDetach?tid=tid11111-1111-1111-1111-111111111111&pid=pid11111-1111-1111-1111-111111111111&project_id=projectid-1111-1111-1111-111111111111&image_id=image_id-1111-1111-1111-111111111111&fromEditor=true&type=image`;

console.log(getDownloadParamsByUrl(url1, { type: EnumUrlType.project, targetFolder: '' }, { teamId: '' }));

console.log(getDownloadParamsByUrl(url1, { type: EnumUrlType.sector, sectorName: "未分组", targetFolder: '' }, { teamId: '' }));

console.log(getDownloadParamsByUrl(url1, { type: EnumUrlType.image, targetFolder: '' }, { teamId: '' }));

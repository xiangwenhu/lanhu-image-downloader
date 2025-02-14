import { EnumUrlType } from "../types";
import { getConfigByUrl } from "../utils/lanhu";


const url1 = `https://lanhuapp.com/web/#/item/project/detailDetach?tid=tid11111-1111-1111-1111-111111111111&pid=pid11111-1111-1111-1111-111111111111&project_id=projectid-1111-1111-1111-111111111111&image_id=image_id-1111-1111-1111-111111111111&fromEditor=true&type=image`;

console.log(getConfigByUrl(url1, {type: EnumUrlType.project}));

console.log(getConfigByUrl(url1, {type: EnumUrlType.sector, sector: "未分组"}));

console.log(getConfigByUrl(url1, {type: EnumUrlType.image}));

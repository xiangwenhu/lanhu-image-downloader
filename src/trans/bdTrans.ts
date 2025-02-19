/* eslint-disable import/prefer-default-export */
import "petal-service";
import MD5 from './md5';
import { getConfig } from '../config';

const petalInstance = petalCreateInstance();
const instance = petalInstance.getRequester();

function transData(data: any) {
    let body = '';
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        body += `${keys[i]}=${encodeURIComponent(data[keys[i]])}`;
        if (i < keys.length - 1) {
            body += '&';
        }
    }
    return body;
}

interface TransResultItem {
    src: string;
    dst: string;
}

interface TransResult {
    from: string;
    to: string;
    trans_result: TransResultItem[];
    error_msg: string;
    error_code: string;
    data: any
}

export default async function bdTrans(query: string | string[]) {

    const q = Array.isArray(query) ? query.join("\n") : query;

    const config = getConfig();

    if (!config.trans || !config.trans.appId || !config.trans.appKey) throw new Error(`未配置 appId或者appKey`);

    const appid = config.trans.appId;
    const key = config.trans.appKey;
    const salt = new Date().getTime();
    // var query = 'apple';
    // 多个query可以用\n连接  如 query='apple\norange\nbanana\npear'
    const from = 'zh';
    const to = 'en';
    const str1 = appid + q + salt + key;
    const sign = MD5(str1);

    const options = {
        q,
        appid: appid,
        salt: salt,
        from: from,
        to: to,
        sign: sign,
    };

    const api = 'https://fanyi-api.baidu.com/api/trans/vip/translate';
    const endpoint = `${api}?${transData(options)}`;

    const result = (await instance.get<TransResult>(endpoint)).data;

    // console.log('result', result);
    console.log(`bdTrans: ${new Date().toTimeString()}`, query, result);

    if (result.trans_result == null) {
        console.error("bdTrans failed:", result);
        return null;
    }
    const resultData = result.trans_result || [];

    // console.log('bdTrans:', resultData);
    return resultData;
}


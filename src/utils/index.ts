import fs from 'fs';
import translate from '../trans/bdTrans';
import { TransResultItem } from '../trans/types';

/* eslint-disable import/prefer-default-export */
// export function getSearchParams(url: string) {
//     const urlIns = new URL(url);
//     return urlIns.searchParams;
// }

export function getQueryStringObject(url: string) {
    const qs = url.split('?')[1]; // 获取url中"?"符后的字串
    const qsMap = new Map<string, string>();
    const strs = qs.split('&');
    for (let i = 0; i < strs.length; i++) {
        const arr = strs[i].split('=');
        qsMap.set(decodeURIComponent(arr[0]), decodeURIComponent(arr[1]))
    }

    return qsMap;
}

/**
 * 对象转query
 * @param obj
 * @returns
 */
export function objectToQuery(obj: Record<string, any>): string {
    return Object.keys(obj)
        .map(key => `${key}=${obj[key]}`)
        .join('&');
}

const REG_NO_EN = /[^A-Z|^a-z|^0-9 |^.s]+/gi;
export function transName(name: string = '', maxWords: number = 5): string {
    const tempName = name
        .replace(REG_NO_EN, '')
        .split(' ')
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, maxWords)
        .map(s => s[0].toUpperCase() + s.substring(1))
        .join('');

    return tempName[0].toLowerCase() + tempName.substring(1);
}

export function transEnglishName(name: string = '', maxWords: number = 100) {
    return (
        `${name}`
            .replace(REG_NO_EN, '') // 特殊符号删除
            .split(/\s/gim) // 空格拆分
            .filter(w => !!w.trim())
            .map(w => w.toLowerCase()) // 删除空格
            .slice(0, maxWords) // 最大单词数量
            // .map((word, index) => {
            //     // 转驼峰
            //     const w = word.toLowerCase();
            //     // 第一个
            //     if (index === 0) {
            //         return w;
            //     }
            //     // 后面
            //     return w[0].toUpperCase() + w.substring(1);
            // })
            .join('_')
    );
}

export async function genEnglishNames<T = Record<string, any>>(array: T[], nameProperty: string, enNameProperty: string = `enName`, maxWords: number = 5): Promise<T[]> {
    // 抽取名字属性
    // @ts-ignore
    const cNames: string[] = array.map(img => img[nameProperty]).filter(Boolean);

    // 数组转map
    // const objMap: Record<string, T> = array.reduce((obj: any, cur: T) => {
    //     obj[cur[nameProperty]] = cur;
    //     return obj;
    // }, {});

    // const res = (await translate(cNames)) || [];
    // res?.forEach(tr => {
    //     const item = objMap[tr.src];
    //     if (!item) {
    //         return console.error(`${tr.src} 未找到相关的图片`);
    //     }
    //     item['englishName' as any] = tr.dst;
    //     item[enNameProperty] = transEnglishName(tr.dst, maxWords);
    // });
    // return array;

    const res = (await translate(cNames.join("\n"))) || [];
    // 中英文map
    const nameMap: Record<string, string> = res.reduce((obj: any, cur: TransResultItem) => {
        obj[cur.src] = cur.dst;
        return obj;
    }, {});

    array.forEach(item => {
        // @ts-ignore
        const nm = nameMap[item[nameProperty]];
        if (nm) {
            // @ts-ignore
            item['englishName'] = nm;
            // @ts-ignore
            item[enNameProperty] = transEnglishName(nm, maxWords);
        }
    });
    return array;
}

/**
 * 删除空白字符串
 * @param str
 * @returns
 */
export function removeWhitespace(str = '') {
    return `${str}`.replace(/\s/gim, '');
}


export function readJsonFileSync<T = any>(filePath: string): T {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData as T;
    } catch (error) {
        console.error('读取 JSON 文件时出错:', error);
        throw error; // 抛出错误，以便调用者处理
    }
}

export function sleep(duration: number = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    })
}


export function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

export function groupBy<T = Record<string, any>>(array: T[], key: keyof T): Map<T[keyof T], T[]> {
    return array.reduce((accumulator, currentValue) => {
        const groupKey = currentValue[key];
        if (!accumulator.has(groupKey)) {
            accumulator.set(groupKey, []);
        }
        accumulator.get(groupKey)?.push(currentValue);
        return accumulator;
    }, new Map<T[keyof T], T[]>());
}

// 定义一个正则表达式匹配不允许出现在文件名中的字符
const illegalRe = /[\/\?<>\\:\*\|"]/g;
export function sanitizeFileName(fileName: string): string {
    // 替换所有不合法的字符为空字符串
    return fileName.replace(illegalRe, '');
}
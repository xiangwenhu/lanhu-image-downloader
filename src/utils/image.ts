import fsp from "fs/promises";
import path from "path";
import imageSize from 'image-size';
import sharp from 'sharp';
import { EnumCutImageStyle } from "../types";


export function getFilenameByType(name: string, type: EnumCutImageStyle) {
    if (!type) return name
    return `${name}.${type}`
}


interface ResizeFolderOptions {
    sourceFolder: string;
    targetFolder: string;
    scale: number;
}

/**
 * 调整图片尺寸
 * @param param0
 */
export async function resizeFolderImages({ sourceFolder, targetFolder, scale }: ResizeFolderOptions) {
    const files = await fsp.readdir(sourceFolder);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fullPath = path.join(sourceFolder, file);

        try {
            const targetPath = path.join(targetFolder, file);
            // 获取尺寸
            await resizeImage({
                source: fullPath,
                target: targetPath,
                scale
            });
        } catch (err) {
            console.error(`图片尺寸调整失败：${fullPath}`);
        }
    }
}

interface ResizeImageOptions {
    source: string;
    target: string;
    scale: number;
}

export async function resizeImage({ source, target, scale }: ResizeImageOptions) {
    const size = imageSize(source);
    if (!size || !size.height || !size.width) {
        throw new Error(`resizeImages: ${source} 尺寸读取失败, 跳过`);
    }
    const targeWidth = Math.ceil(size.width * scale);
    const targeHeight = Math.ceil(size.height * scale);

    // 如果源等于目标
    if (source !== target) {
        await sharp(source).resize({ height: targeHeight, width: targeWidth }).toFile(target);
        return;
    }
}

interface ResizeImageBySizeOptions {
    height: number;
    width: number;
    source: string;
    target: string;
    quality?: number;
    type?: EnumCutImageStyle
}

export async function resizeImageBySize({ source, target, width, type, quality }: ResizeImageBySizeOptions) {

    const pip = sharp(source);

    if (type) {

        switch (type) {
            case EnumCutImageStyle.PNG:
                pip.png({
                    quality: quality || 100
                })
                break;
            case EnumCutImageStyle.JPG:
                pip.jpeg({
                    quality: quality || 100
                })
                break;
            case EnumCutImageStyle.WebP:
                pip.webp({
                    quality: quality || 100
                });
                break
            default:
                break;

        }
    }

    await pip.resize({ width }).toFile(target);
}
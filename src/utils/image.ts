import fsp from "fs/promises";
import path from "path";
import sharp from 'sharp';
import { EnumCutImageStyle } from "../types";
import { imageSize } from 'image-size'


export function getFilenameByType(name: string, type: EnumCutImageStyle) {
    if (!type) return name
    return `${name}.${type}`
}



interface ResizeImageOptions {
    source: string;
    target: string;
    scale: number;
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

export async function getImageSize(filePath: string) {
    const dimensions = imageSize(filePath);
    return {
        height: dimensions.height,
        width: dimensions.width
    }
}
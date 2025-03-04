import fsp from "fs/promises";
import path from "path";
import imageSize from 'image-size';
import sharp from 'sharp';

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


interface ResizeImageOptions2 {
    height: number;
    width: number;
    source: string;
    target: string;
    quality?: number
}

export async function resizeImageBySize({ source, target, width }: ResizeImageOptions2) {    
    await sharp(source).resize({ width }).toFile(target);
}
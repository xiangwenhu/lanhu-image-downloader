import fsp from "fs/promises";
import path from "path";
import imageSize from 'image-size';
import sharp from 'sharp';

interface ResizeOptions {
    sourceFolder: string;
    targetFolder: string;
    scale: number;
}

/**
 * 调整图片尺寸
 * @param param0
 */
export async function resizeImages({ sourceFolder, targetFolder, scale }: ResizeOptions) {
    const files = await fsp.readdir(sourceFolder);
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fullPath = path.join(sourceFolder, file);

        try {
            const targetPath = path.join(targetFolder, file);
            // 获取尺寸
            const size = imageSize(fullPath);

            if (!size || !size.height || !size.width) {
                console.error(`resizeImages: ${targetPath} 尺寸读取失败, 调过`);
                continue;
            }

            const targeWidth = Math.ceil(size.width * scale);
            const targeHeight = Math.ceil(size.height * scale);

            // 重新设置尺寸
            await sharp(fullPath).resize({ height: targeHeight, width: targeWidth }).toFile(targetPath);
        } catch (err) {
            console.error(`图片尺寸调整失败：${fullPath}`);
        }
    }
}
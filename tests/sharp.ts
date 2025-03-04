import fsp from "fs/promises";
import path from "path";
import imageSize from 'image-size';
import sharp from 'sharp';
import { resizeImageBySize } from "../src/utils/image"

interface ResizeOptions {
    sourceFolder: string;
    targetFolder: string;
    scale: number;
}

; (async function () {

    const fullPath = path.join(__dirname, "../data-data/原图.png");
    const targetPath = path.join(__dirname, "../data-data/压缩_sharp.png");

    // await sharp(fullPath).toColorspace('rgb16').png({
    //     // palette:true,
    //     // quality: 100
    // }).resize({ height: 1312, width: 750 }).toFile(targetPath);

    await resizeImageBySize({ source: fullPath, target: targetPath, width: 750, height: 1312 })

})();
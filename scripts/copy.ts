import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import * as path from 'path';

/**
 * 复制文件的函数
 * @param sourcePath 源文件路径
 * @param destPath 目标文件路径
 */
async function copyFile(sourcePath: string, destPath: string): Promise<void> {
    try {

        if (!existsSync(sourcePath)) return console.error(`sourcePath 文件不存在`)

        // 确保目标目录存在
        const destDir = path.dirname(destPath);
        await fs.mkdir(destDir, { recursive: true });

        // 使用 fs.copyFile 复制文件
        await fs.copyFile(sourcePath, destPath);
        console.log(`File copied from ${sourcePath} to ${destPath}`);
    } catch (error) {
        console.error('Error occurred while copying the file:', error);
        throw error;
    }
}

// 示例用法
(async () => {
    // const sourceFilePath = path.resolve(__dirname, '../src/index.d.ts');
    // const destinationFilePath = path.resolve(__dirname, "../dist/index.d.ts");

    // await copyFile(sourceFilePath, destinationFilePath);
})();
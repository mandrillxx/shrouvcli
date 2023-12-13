import fs from "fs";
import fse from "fs-extra";
import chalk from "chalk";

export const error = chalk.bold.red;
export const warning = chalk.bold.hex("#FFA500");
export const primary = chalk.bold.white;
export const success = chalk.bold.green;

export async function cloneDirectory(
  sourcePath: string,
  destinationPath: string
): Promise<void> {
  try {
    if (!fse.existsSync(sourcePath)) {
      throw new Error(`Source directory does not exist: ${sourcePath}`);
    }

    await fse.ensureDir(destinationPath);

    const files = await fse.readdir(sourcePath);

    for (const file of files) {
      const sourceFilePath = `${sourcePath}/${file}`;
      const destinationFilePath = `${destinationPath}/${file}`;

      if (fse.statSync(sourceFilePath).isDirectory()) {
        await cloneDirectory(sourceFilePath, destinationFilePath);
      } else {
        await fse.copyFile(sourceFilePath, destinationFilePath);
      }
    }
  } catch (error: any) {
    console.error(`Error cloning directory: ${error.message}`);
  }
}

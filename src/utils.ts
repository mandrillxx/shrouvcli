import { spawn } from "node:child_process";
import fs from "fs";
import fse from "fs-extra";
import yaml from "js-yaml";
import inquirer from "inquirer";
import { ShrouvGameConfig } from "./services/core/shrouv.js";
import { RojoProjectConfig } from "./rojo.js";
import { MantleConfig } from "./services/core/mantle.js";

export async function cloneDirectory(
  sourcePath: string,
  destinationPath: string
) {
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

export async function getDirectories(sourcePath: string): Promise<string[]> {
  try {
    const files = await fse.readdir(sourcePath);
    const directories = files.filter((file) =>
      fse.statSync(`${sourcePath}/${file}`).isDirectory()
    );

    return directories;
  } catch (error: any) {
    console.error(`Error getting directories: ${error.message}`);
    return [];
  }
}

interface SpawnProcessParams {
  cmd: string;
  cwd: string;
  successMessage: string;
}

export function spawnProcess({ cmd, cwd, successMessage }: SpawnProcessParams) {
  const child = spawn(cmd, {
    stdio: "inherit",
    shell: true,
    cwd,
  });

  child.on("exit", (code) => {
    if (code === 0) {
      console.log(successMessage);
    }
  });
}

interface ConfirmTargetPathOverwriteParams {
  path: string;
  target: string;
}

export async function confirmTargetPathOverwrite({
  path,
  target,
}: ConfirmTargetPathOverwriteParams) {
  const confirm = await inquirer.prompt({
    type: "confirm",
    name: "overwrite",
    message: `Target directory "${target}" exits. Do you want to overwrite it?`,
    default: false,
  });

  if (!confirm.overwrite) {
    process.exit(0);
  }

  fs.rmSync(path, { recursive: true, force: true });
}

export function getModulesFromProject(path: string) {
  const shrouvConfigPath = `${path}/shrouv.json`;
  const shrouvConfig = JSON.parse(
    fs.readFileSync(shrouvConfigPath, "utf-8")
  ) as ShrouvGameConfig;
  return shrouvConfig.modules;
}

export function experienceToConfigs(
  path: string
): [
  mantleConfig: MantleConfig,
  rojoConfig: RojoProjectConfig,
  shrouvConfig: ShrouvGameConfig
] {
  const mantleConfig = yaml.load(
    fs.readFileSync(`${path}/mantle.yml`, "utf-8")
  ) as MantleConfig;
  const rojoConfig = JSON.parse(
    fs.readFileSync(`${path}/default.project.json`, "utf-8")
  ) as RojoProjectConfig;
  const shrouvConfig = JSON.parse(
    fs.readFileSync(`${path}/shrouv.json`, "utf-8")
  ) as ShrouvGameConfig;

  return [mantleConfig, rojoConfig, shrouvConfig];
}

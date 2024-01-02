import inquirer from "inquirer";
import { EasySetupAnswers } from "../create-project.js";
import yaml from "js-yaml";
import fs from "fs";
import {
  cloneDirectory,
  confirmTargetPathOverwrite,
  spawnProcess,
} from "../../utils.js";
import { createRojoProjectConfig } from "../../rojo.js";
import { answersToMantleConfig } from "./mantle.js";
import { colors } from "../../constants/index.js";
import { ShrouvGameConfig } from "./shrouv.js";
import { manageProject } from "../select-project.js";

interface CreateShrouvExperienceOptions {
  runNpmInstall: boolean;
}

async function createProject(answers: EasySetupAnswers) {
  const config = answersToMantleConfig(answers);
  const yamlConfig = yaml.dump(config);
  const projectConfig = JSON.stringify(
    createRojoProjectConfig(answers.name),
    null,
    2
  );
  const path = `../experiences/${answers.name}`;
  if (fs.existsSync(path)) {
    await confirmTargetPathOverwrite({ path, target: answers.name });
  }
  cloneDirectory(`./projects/${answers.projectTemplate}`, path);
  fs.writeFileSync(`${path}/mantle.yml`, yamlConfig);
  fs.writeFileSync(`${path}/default.project.json`, projectConfig);
  fs.writeFileSync(
    `${path}/shrouv.json`,
    JSON.stringify(
      {
        name: answers.name,
        archived: false,
        modules: [],
      } as ShrouvGameConfig,
      null,
      2
    )
  );
  return path;
}

interface ManageNewProjectAnswers {
  actions: "openCode" | "openFolder" | "openFolderAndCode" | "manage" | "exit";
}

async function manageNewProject(path: string) {
  const answers = await inquirer.prompt<ManageNewProjectAnswers>([
    {
      type: "list",
      name: "actions",
      message: "What would you like to do?",
      choices: [
        {
          name: "Open in VSCode",
          value: "openCode",
        },
        {
          name: "Open folder",
          value: "openFolder",
        },
        {
          name: "Open folder & in VSCode",
          value: "openFolderAndCode",
        },
        {
          name: "Manage experience",
          value: "manage",
        },
        new inquirer.Separator(),
        {
          name: "Exit",
          value: "exit",
        },
      ],
    },
  ]);

  switch (answers.actions) {
    case "openCode": {
      spawnProcess({
        cmd: "code .",
        cwd: path,
        successMessage: `${colors.green}SUCCESS ${colors.white}Opening project code in VS Code${colors.reset}`,
      });
      await manageProject(path);
      break;
    }
    case "openFolder": {
      spawnProcess({
        cmd: "start .",
        cwd: path,
        successMessage: `${colors.green}SUCCESS ${colors.white}Opening project folder${colors.reset}`,
      });
      await manageProject(path);
      break;
    }
    case "openFolderAndCode": {
      spawnProcess({
        cmd: "start . && code .",
        cwd: path,
        successMessage: `${colors.green}SUCCESS ${colors.white}Opening project folder and in VS Code${colors.reset}`,
      });
      await manageProject(path);
      break;
    }
    case "manage": {
      await manageProject(path);
      break;
    }
    case "exit": {
      return;
    }
  }
}

export async function createShrouvExperience(initialAnswers: EasySetupAnswers) {
  const path = await createProject(initialAnswers);

  if (initialAnswers.runNpmInstall) {
    spawnProcess({
      cmd: `npm install ${initialAnswers.selectedNpmPackages.join(" ")}`,
      cwd: path,
      successMessage: `${colors.green}SUCCESS ${colors.white}Project created and installed successfully at ${colors.cyan}${path}${colors.reset}`,
    });
  }

  await manageNewProject(path);
}

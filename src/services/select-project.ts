import inquirer from "inquirer";
import {
  getDirectories,
  getModulesFromProject,
  spawnProcess,
} from "../utils.js";
import fs from "fs";
import yaml from "js-yaml";
import { MantleConfig } from "./core/mantle.js";
import { colors } from "../constants/index.js";
import { RojoProjectConfig } from "../rojo.js";
import { ShrouvConfig } from "./core/shrouv.js";
import { installModule, installModules, removeModules } from "./core/module.js";

interface SelectProjectAnswers {
  project: string;
}

interface ManageProjectAnswers {
  action: "deploy" | "build" | "delete" | "manageModules" | "back";
}

async function manageModules(path: string) {
  const shrouvConfigPath = `${path}/shrouv.json`;
  const shrouvConfig = JSON.parse(
    fs.readFileSync(shrouvConfigPath, "utf-8")
  ) as ShrouvConfig;
  const allModules = await getDirectories("./modules");
  const selectedModules = getModulesFromProject(path);
  const choices = [
    ...allModules.map((module) => ({
      name: module,
      value: module,
      disabled: selectedModules.includes(module),
    })),
    new inquirer.Separator(),
    {
      name: "Back",
      value: "back",
    },
  ];
  const answers = await inquirer.prompt<{ module: string }>([
    {
      type: "list",
      name: "module",
      message: "Which modules would you like to install?",
      choices,
    },
  ]);
  if (answers.module === "back") return;
  shrouvConfig.modules = [...shrouvConfig.modules, answers.module];
  fs.writeFileSync(shrouvConfigPath, JSON.stringify(shrouvConfig, null, 2));
  installModule(answers.module, path);
}

async function manageProject(path: string) {
  if (
    !fs.existsSync(`${path}/shrouv.json`) ||
    !fs.existsSync(`${path}/mantle.yml`) ||
    !fs.existsSync(`${path}/default.project.json`)
  ) {
    console.log(
      `\n${colors.red}[!] ${colors.white}This project is not a valid Shrouv project.${colors.reset}\n`
    );
    selectProject();
    return;
  }

  const answers = await inquirer.prompt<ManageProjectAnswers>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        {
          name: "1. Deploy project",
          value: "deploy",
        },
        {
          name: "2. Build project",
          value: "build",
        },
        {
          name: `3. Delete project`,
          value: "delete",
        },
        {
          name: `4. Manage modules`,
          value: "manageModules",
        },
        new inquirer.Separator(),
        {
          name: `5. Back`,
          value: "back",
        },
      ],
    },
  ]);

  const mantleConfig = yaml.load(
    fs.readFileSync(`${path}/mantle.yml`, "utf-8")
  ) as MantleConfig;
  const rojoConfig = JSON.parse(
    fs.readFileSync(`${path}/default.project.json`, "utf-8")
  ) as RojoProjectConfig;
  const environments = mantleConfig.environments.map((env) => env.label);

  switch (answers.action) {
    case "deploy": {
      const { confirm, environment } = await inquirer.prompt<{
        confirm: boolean;
        environment: string;
      }>([
        {
          type: "confirm",
          name: "confirm",
          message: "Are you sure you want to deploy this project?",
        },
        {
          type: "list",
          name: "environment",
          message: "Which environment do you want to deploy?",
          choices: environments,
          when: ({ confirm }) => confirm,
        },
      ]);
      if (confirm) {
        spawnProcess({
          cmd: `mantle deploy -e ${environment}`,
          cwd: path,
          successMessage: `Project ${rojoConfig.name} has been deployed.`,
        });
      } else {
        manageProject(path);
      }
      break;
    }
    case "build": {
      const { confirm } = await inquirer.prompt<{
        confirm: boolean;
      }>([
        {
          type: "confirm",
          name: "confirm",
          message: "Are you sure you want to build this project?",
        },
      ]);
      if (confirm) {
        spawnProcess({
          cmd: `npm run build:dev`,
          cwd: path,
          successMessage: `Project ${rojoConfig.name} has been built.`,
        });
      } else {
        manageProject(path);
      }
      break;
    }
    case "delete": {
      const { confirm, environment } = await inquirer.prompt<{
        confirm: boolean;
        environment: string;
      }>([
        {
          type: "confirm",
          name: "confirm",
          message: "Are you sure you want to delete this project?",
        },
        {
          type: "list",
          name: "environment",
          message: "Which environment do you want to destroy?",
          choices: environments,
          when: ({ confirm }) => confirm,
        },
      ]);
      if (confirm) {
        spawnProcess({
          cmd: `mantle destroy -e ${environment}`,
          cwd: path,
          successMessage: `Project ${rojoConfig.name} has been deleted.`,
        });
      } else {
        manageProject(path);
      }
      break;
    }
    case "manageModules": {
      await manageModules(path);
      manageProject(path);
      break;
    }
    case "back":
      await selectProject();
      break;
  }
}

export async function selectProject() {
  const experiences = await getDirectories("../experiences");
  const choices = experiences.map((experience) => {
    const disabled =
      !fs.existsSync(`../experiences/${experience}/mantle.yml`) ||
      !fs.existsSync(`../experiences/${experience}/default.project.json`) ||
      !fs.existsSync(`../experiences/${experience}/shrouv.json`);
    return {
      name: `${experience} ${
        disabled ? `${colors.gray}(invalid project)` : ""
      } ${colors.reset}`,
      value: experience,
      disabled,
    };
  });
  const answers = await inquirer.prompt<SelectProjectAnswers>([
    {
      type: "list",
      name: "project",
      message: "Which project would you like to use?",
      choices,
    },
  ]);

  const projectDirectory = `../experiences/${answers.project}`;
  manageProject(projectDirectory);
}

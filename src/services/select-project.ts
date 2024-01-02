import inquirer from "inquirer";
import {
  getDirectories,
  getModulesFromProject,
  spawnProcess,
} from "../utils.js";
import fs from "fs";
import fse from "fs-extra";
import yaml from "js-yaml";
import { MantleConfig } from "./core/mantle.js";
import { colors } from "../constants/index.js";
import { RojoProjectConfig } from "../rojo.js";
import { ShrouvGameConfig } from "./core/shrouv.js";
import { installModule } from "./core/module.js";
import { beginPrompt } from "./prompt.js";
import { getServices, getDefaultServices } from "./core/service.js";

interface SelectProjectAnswers {
  project: string;
}

interface ManageProjectAnswers {
  action:
    | "deploy"
    | "build"
    | "delete"
    | "archive"
    | "manageModules"
    | "openCode"
    | "openFolder"
    | "back"
    | "exit";
}

async function manageLibraries(path: string) {
  const answers = await inquirer.prompt<{ libraries: string[] }>([
    {
      type: "checkbox",
      name: "libraries",
      message: "What libraries do you want to use?",
      choices: getServices(),
      default: getDefaultServices(),
    },
  ]);

  spawnProcess({
    cmd: `npm install ${answers.libraries.join(" ")}`,
    cwd: path,
    successMessage: `${colors.green}SUCCESS ${colors.white}Installed ${answers.libraries.length} libraries successfully${colors.cyan}${path}${colors.reset}`,
  });
  await manageProject(path);
}

async function manageModules(path: string) {
  const shrouvConfigPath = `${path}/shrouv.json`;
  const shrouvConfig = JSON.parse(
    fs.readFileSync(shrouvConfigPath, "utf-8")
  ) as ShrouvGameConfig;
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
      name: "Install Libraries",
      value: "libraries",
    },
    new inquirer.Separator(),
    {
      name: "Back",
      value: "back",
    },
    new inquirer.Separator(),
  ];
  const answers = await inquirer.prompt<{
    module: string & "back" & "libraries";
  }>([
    {
      type: "list",
      name: "module",
      message: "Which modules would you like to install?",
      choices,
    },
  ]);
  if (answers.module === "back") return;
  if (answers.module === "libraries") {
    await manageLibraries(path);
    return;
  }
  shrouvConfig.modules = [...shrouvConfig.modules, answers.module];
  fs.writeFileSync(shrouvConfigPath, JSON.stringify(shrouvConfig, null, 2));
  installModule(answers.module, path);
}

async function toggleArchiveProject(path: string) {
  const shrouvConfig = JSON.parse(
    fs.readFileSync(`${path}/shrouv.json`, "utf-8")
  ) as ShrouvGameConfig;
  const archiving = !shrouvConfig.archived;
  const answers = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message: `Are you sure you want to ${
        archiving ? "archive" : "unarchive"
      } this project?`,
    },
  ]);

  if (answers.confirm) {
    shrouvConfig.archived = archiving;
    fs.writeFileSync(
      `${path}/shrouv.json`,
      JSON.stringify(shrouvConfig, null, 2)
    );

    if (archiving) {
      fse.moveSync(path, `../experiences/archived/${shrouvConfig.name}`);
    } else {
      fse.moveSync(path, `../experiences/${shrouvConfig.name}`);
    }
  }
}

async function deleteProject(path: string) {
  const answers = await inquirer.prompt<{ confirm: boolean }>([
    {
      type: "confirm",
      name: "confirm",
      message: `Are you sure you want to delete this project?`,
    },
  ]);
  if (answers.confirm) {
    fse.removeSync(path);
  }
}

export async function manageProject(path: string) {
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
          name: `1. Open in VSCode`,
          value: "openCode",
        },
        {
          name: `2. Open folder`,
          value: "openFolder",
        },
        new inquirer.Separator(),
        {
          name: "3. Build project",
          value: "build",
        },
        {
          name: "4. Deploy project",
          value: "deploy",
        },
        {
          name: `5. Archive project`,
          value: "archive",
        },
        {
          name: `6. Delete project`,
          value: "delete",
        },
        {
          name: `7. Manage modules and libraries`,
          value: "manageModules",
        },
        new inquirer.Separator(),
        {
          name: `8. Back`,
          value: "back",
        },
        {
          name: `9. Exit`,
          value: "exit",
        },
        new inquirer.Separator(),
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
        environment: string & "all";
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
          choices: [
            ...environments,
            { name: "Entire experience", value: "all" },
          ],
          when: ({ confirm }) => confirm,
        },
      ]);
      if (confirm) {
        if (environment === "all") {
          deleteProject(path);
        } else {
          spawnProcess({
            cmd: `mantle destroy -e ${environment}`,
            cwd: path,
            successMessage: `Project ${rojoConfig.name} has been deleted.`,
          });
        }
        selectProject();
      } else {
        manageProject(path);
      }
      break;
    }
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
    case "archive": {
      await toggleArchiveProject(path);
      manageProject(path);
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
    case "exit":
      return;
  }
}

export async function selectProject() {
  const experiences = (await getDirectories("../experiences")).filter(
    (dir) => dir !== "archived"
  );
  const archivedExperiences = await getDirectories("../experiences/archived");
  const choices = [
    ...experiences.map((experience) => {
      const disabled =
        !fs.existsSync(`../experiences/${experience}/mantle.yml`) ||
        !fs.existsSync(`../experiences/${experience}/default.project.json`) ||
        !fs.existsSync(`../experiences/${experience}/shrouv.json`);
      return {
        name: experience,
        value: experience,
        disabled: disabled
          ? `${colors.red}invalid project${colors.reset}`
          : false,
      };
    }),
    new inquirer.Separator(),
    ...archivedExperiences.map((experience) => ({
      name: `${experience} ${colors.gray}(archived) ${colors.reset}`,
      value: `ARC${experience}`,
    })),
    new inquirer.Separator(),
    {
      name: "Back",
      value: "back",
    },
    {
      name: "Exit",
      value: "exit",
    },
    new inquirer.Separator(),
  ];
  const answers = await inquirer.prompt<SelectProjectAnswers>([
    {
      type: "list",
      name: "project",
      message: "Which project would you like to use?",
      choices,
    },
  ]);

  if (answers.project === "back") {
    await beginPrompt();
    return;
  } else if (answers.project === "exit") {
    return;
  }

  if (answers.project.startsWith("ARC")) {
    const archivedProject = answers.project.replace("ARC", "");
    const archivedProjectDirectory = `../experiences/archived/${archivedProject}`;
    manageProject(archivedProjectDirectory);
    return;
  }
  const projectDirectory = `../experiences/${answers.project}`;
  manageProject(projectDirectory);
}

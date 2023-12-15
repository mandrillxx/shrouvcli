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
import { colors, primary, success } from "../../constants/index.js";
import chalk from "chalk";

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
  return path;
}

export async function createShrouvExperience(initialAnswers: EasySetupAnswers) {
  const answers = await inquirer.prompt<CreateShrouvExperienceOptions>([
    {
      type: "confirm",
      name: "runNpmInstall",
      message: "Do you want to run npm install?",
      default: true,
    },
  ]);

  const path = await createProject(initialAnswers);

  if (answers.runNpmInstall) {
    spawnProcess({
      cmd: "npm install",
      cwd: path,
      successMessage: `${colors.green}SUCCESS ${colors.white}Project created and installed successfully at ${colors.cyan}${path}${colors.reset}`,
    });
  }

  console.log(
    `\n\n${success("SUCCESS")} Created project ${primary(
      initialAnswers.name
    )}\n\n${success("NEXT STEPS")} \n\n${chalk.white("1. ")}Run ${primary(
      `cd ${path}`
    )}\n${chalk.white("2. ")}${
      answers.runNpmInstall
        ? `Run ${primary("npm run deploy:dev")}`
        : `Run ${primary("npm install")}\n${chalk.white("3. ")}Run ${primary(
            "npm run deploy:dev"
          )}`
    }\n`
  );
}

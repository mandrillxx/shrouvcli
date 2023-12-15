import inquirer from "inquirer";
import { getDirectories } from "../utils.js";
import fs from "fs";
import yaml from "js-yaml";
import { MantleConfig } from "./core/mantle.js";
import { colors } from "../constants/index.js";
import { RojoProjectConfig } from "../rojo.js";

interface SelectProjectAnswers {
  project: string;
}

export async function selectProject() {
  const answers = await inquirer.prompt<SelectProjectAnswers>([
    {
      type: "list",
      name: "project",
      message: "Which project would you like to use?",
      choices: await getDirectories("../experiences"),
    },
  ]);

  const projectDirectory = `../experiences/${answers.project}`;

  const mantleConfig = yaml.load(
    fs.readFileSync(`${projectDirectory}/mantle.yml`, "utf-8")
  ) as MantleConfig;
  const rojoConfig = JSON.parse(
    fs.readFileSync(`${projectDirectory}/default.project.json`, "utf-8")
  ) as RojoProjectConfig;

  console.log(
    `\n${colors.green}PROJECT NAME - ${colors.gray}${rojoConfig.name} | ${mantleConfig.owner}\n${colors.reset}`
  );
}

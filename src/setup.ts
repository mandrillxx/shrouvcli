import { MantleConfig } from "./mantle.js";
import fs from "fs";
import yaml from "js-yaml";
import chalk from "chalk";
import { cloneDirectory, primary, success } from "./utils.js";

export function createProject(projectName: string, config: MantleConfig) {
  const yamlConfig = yaml.dump(config);
  const projectDir = `../experiences/${projectName}`;
  cloneDirectory("./default-project", projectDir);
  fs.writeFileSync(`${projectDir}/mantle.yml`, yamlConfig);

  console.log(
    `\n\n${success("SUCCESS")} Created project ${primary(
      projectName
    )}\n\n${success("NEXT STEPS")} \n\n${chalk.white("1. ")}Run ${primary(
      `cd experiences/${projectName}`
    )}\n${chalk.white("2. ")}Run ${primary("npm install")}\n${chalk.white(
      "3. "
    )}Run ${primary("npm run dev")}\n`
  );
}

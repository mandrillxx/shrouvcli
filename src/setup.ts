import { MantleConfig } from "./mantle.js";
import fs from "fs";
import yaml from "js-yaml";
import chalk from "chalk";
import { cloneDirectory, primary, success } from "./utils.js";
import { createRojoProjectConfig } from "./rojo.js";

export function createProject(
  projectName: string,
  projectTemplate: "experimental" | "shrouv-classic" | "slither-style",
  config: MantleConfig
) {
  const yamlConfig = yaml.dump(config);
  const projectConfig = JSON.stringify(
    createRojoProjectConfig(projectName),
    null,
    2
  );
  const projectDir = `../experiences/${projectName}`;
  cloneDirectory(`./projects/${projectTemplate}`, projectDir);
  fs.writeFileSync(`${projectDir}/mantle.yml`, yamlConfig);
  fs.writeFileSync(`${projectDir}/default.project.json`, projectConfig);

  console.log(
    `\n\n${success("SUCCESS")} Created project ${primary(
      projectName
    )}\n\n${success("NEXT STEPS")} \n\n${chalk.white("1. ")}Run ${primary(
      `cd experiences/${projectName}`
    )}\n${chalk.white("2. ")}Run ${primary("yarn install")}\n${chalk.white(
      "3. "
    )}Run ${primary("yarn deploy:dev")}\n`
  );
}

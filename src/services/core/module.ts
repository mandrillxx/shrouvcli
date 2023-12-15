import { colors } from "../../constants/index.js";
import { cloneDirectory } from "../../utils.js";

export async function installModule(module: string, projectPath: string) {
  cloneDirectory(`./modules/${module}`, `${projectPath}/src`);
  console.log(
    `\n${colors.green}SUCCESS ${colors.white}Installed module ${
      colors.gray
    }"${`./modules/${module}`}"${colors.white} to ${colors.gray}${projectPath}${
      colors.reset
    }\n`
  );
}
export async function installModules(modules: string[], projectPath: string) {
  const added = [];
  for (const module of modules) {
    await installModule(module, projectPath);
    added.push(module);
  }
  console.log(
    `\n${added.map((add) => {
      return `${colors.green}[+] ${colors.white}Installed module ${colors.yellow}${add}${colors.reset}\n`;
    })}\n`
  );
}

export async function removeModule(module: string, projectPath: string) {
  console.log("Not implemented yet");
}
export async function removeModules(modules: string[], projectPath: string) {
  const removed = [];
  for (const module of modules) {
    await removeModule(module, projectPath);
    removed.push(module);
  }
  console.log(
    `\n${removed.map((remove) => {
      return `${colors.red}[+] ${colors.white}Uninstalled module ${colors.yellow}${remove}${colors.reset}\n`;
    })}\n`
  );
}

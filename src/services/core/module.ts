import { colors } from "../../constants/index.js";

export async function installModule(module: string) {}
export async function installModules(modules: string[]) {
  const added = [];
  for (const module of modules) {
    await installModule(module);
    added.push(module);
  }
  console.log(
    `\n${added.map((add) => {
      return `${colors.green}[+] ${colors.white}Installed module ${colors.yellow}${add}${colors.reset}\n`;
    })}\n`
  );
}

export async function removeModule(module: string) {}
export async function removeModules(modules: string[]) {
  const removed = [];
  for (const module of modules) {
    await removeModule(module);
    removed.push(module);
  }
  console.log(
    `\n${removed.map((remove) => {
      return `${colors.red}[+] ${colors.white}Uninstalled module ${colors.yellow}${remove}${colors.reset}\n`;
    })}\n`
  );
}

import figlet from "figlet";
import inquirer from "inquirer";
import { warning } from "../constants/index.js";
import { createProject } from "./create-project.js";
import { selectProject } from "./select-project.js";

interface MenuSelectionAnswers {
  type: "newProject" | "existingProject" | "installModule" | "exit";
}

export async function beginPrompt() {
  console.log(warning(figlet.textSync("ShrouvEngine")) + "\n");
  const answers = await inquirer.prompt<MenuSelectionAnswers>({
    type: "list",
    name: "type",
    message: "What do you want to do?",
    choices: [
      { name: "Create a new project", value: "newProject" },
      { name: "Manage existing project", value: "existingProject" },
      { name: "Install a module", value: "installModule" },
      { name: "Exit", value: "exit" },
    ],
  });

  switch (answers.type) {
    case "newProject":
      await createProject();
      break;
    case "existingProject":
      await selectProject();
      break;
    case "installModule":
      console.log("installModule");
      break;
    case "exit":
      return;
  }
}

import inquirer from "inquirer";
import fs, { link } from "fs";
import { ShrouvConfig } from "./core/shrouv.js";
import { colors, success, warning } from "../constants/index.js";
import figlet from "figlet";
import { beginPrompt } from "./prompt.js";

interface CentraIdentityResponse {
  id: string;
  owner: string;
  created_at: string;
  updated_at: string | null;
  metadata: any;
}

async function checkCentraCode(code: string) {
  const url = `http://localhost:3000/api/centra/link?code=${code}`;

  const response = await fetch(url, {
    method: "GET",
  });
  const json = (await response.json()) as CentraIdentityResponse;

  return json;
}

interface CentraMainOptions {
  action: "status" | "unlink" | "push" | "pull" | "update" | "back" | "exit";
}

export async function centra() {
  const answers = await inquirer.prompt<CentraMainOptions>([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        { name: "1. Check Centra Status", value: "status" },
        { name: "2. Unlink account", value: "unlink" },
        { name: "3. Push staged changes", value: "push" },
        { name: "4. Pull newest changes", value: "pull" },
        { name: "5. Update Centra", value: "update" },
        new inquirer.Separator(),
        { name: "6. Back", value: "back" },
        { name: "7. Exit", value: "exit" },
        new inquirer.Separator(),
      ],
    },
  ]);

  switch (answers.action) {
    case "back": {
      await beginPrompt();
      break;
    }
    case "exit": {
      return;
    }
  }
}

export async function linkCentra() {
  const shrouvConfig = JSON.parse(
    fs.readFileSync("../shrouv.json", "utf-8")
  ) as ShrouvConfig;
  const answers = await inquirer.prompt<{ centraCode: string }>([
    {
      type: "input",
      name: "centraCode",
      message: "What is your Centra code found on https://admin.messor.gg/?",
      when: () =>
        !shrouvConfig.centra_link_code ||
        shrouvConfig.centra_link_code.length < 36,
    },
  ]);
  const code = answers.centraCode ?? shrouvConfig.centra_link_code;
  try {
    const centraIdentity = await checkCentraCode(code);

    console.log(success(figlet.textSync(centraIdentity.owner)) + "\n");

    if (shrouvConfig.centra_link_code !== code) {
      fs.writeFileSync(
        "../shrouv.json",
        JSON.stringify(
          { ...shrouvConfig, centra_link_code: answers.centraCode },
          null,
          2
        )
      );
    }
    console.log("Centra linked!");
  } catch (error) {
    console.log(
      `${colors.red}ERROR ${colors.white}Centra code is not valid! ${colors.magenta}${error}${colors.reset}`
    );
    await linkCentra();
  }
}

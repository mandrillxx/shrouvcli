import inquirer from "inquirer";
import fs, { link } from "fs";
import { ShrouvConfig } from "./core/shrouv.js";
import { colors, success, warning } from "../constants/index.js";
import figlet from "figlet";
import { beginPrompt } from "./prompt.js";
import { Experience } from "./core/centra.js";

interface CentraIdentityResponse {
  userId: string;
}

async function checkCentraCode(code: string) {
  const url = `http://localhost:3000/api/centra/link?code=${code}`;

  const response = await fetch(url, {
    method: "GET",
  });
  const json = (await response.json()) as CentraIdentityResponse;
  console.dir(json);

  return json;
}

async function manageCentraExperience(experience: string) {
  const answers = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: `What do you want to do with ${experience}?`,
      choices: [
        { name: "1. Push changes", value: "push" },
        { name: "2. Pull changes", value: "pull" },
        { name: "3. Delete", value: "remove" },
        new inquirer.Separator(),
        { name: "4. Back", value: "back" },
        { name: "5. Exit", value: "exit" },
        new inquirer.Separator(),
      ],
    },
  ]);

  switch (answers.action) {
    case "push": {
      break;
    }
    case "pull": {
      break;
    }
    case "remove": {
      break;
    }
    case "back": {
      await selectCentraExperience();
      break;
    }
    case "exit": {
      return;
    }
  }
}

async function selectCentraExperience() {
  const code = await getCentraCode();
  const url = `http://localhost:3000/api/centra/experience?code=${code}`;

  const response = await fetch(url, {
    method: "GET",
  });
  const json = (await response.json()) as Experience[];
  const answers = await inquirer.prompt<{
    experience: string & "back" & "exit";
  }>([
    {
      type: "list",
      name: "experience",
      message: "Select an experience",
      choices: [
        ...json.map((experience, index) => ({
          name: `${index + 1}. ${experience.title}`,
          value: experience.id,
        })),
        new inquirer.Separator(),
        { name: "Back", value: "back" },
        { name: "Exit", value: "exit" },
        new inquirer.Separator(),
      ],
    },
  ]);

  switch (answers.experience) {
    case "back": {
      await centra();
      break;
    }
    case "exit": {
      return;
    }
    default: {
      await manageCentraExperience(answers.experience);
      break;
    }
  }
}

interface CentraMainOptions {
  action: "select" | "unlink" | "push" | "pull" | "update" | "back" | "exit";
}

export async function centra() {
  const answers = await inquirer.prompt<CentraMainOptions>([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        { name: "1. Select Centra Experience", value: "select" },
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
    case "select": {
      await selectCentraExperience();
      break;
    }
    case "unlink": {
      const shrouvConfig = JSON.parse(
        fs.readFileSync("../shrouv.json", "utf-8")
      ) as ShrouvConfig;
      fs.writeFileSync(
        "../shrouv.json",
        JSON.stringify(
          { ...shrouvConfig, centra_link_code: undefined },
          null,
          2
        )
      );
      console.log(
        `${colors.green}SUCCESS ${colors.white}Successfully unlinked Centra code${colors.reset}`
      );
      break;
    }
    case "push": {
      break;
    }
    case "pull": {
      break;
    }
    case "back": {
      await beginPrompt();
      break;
    }
    case "exit": {
      return;
    }
  }
}

export async function getCentraCode() {
  const shrouvConfig = JSON.parse(
    fs.readFileSync("../shrouv.json", "utf-8")
  ) as ShrouvConfig;
  if (shrouvConfig.centra_link_code) return shrouvConfig.centra_link_code;
  console.log("inquiring for new code");

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
  const code = answers.centraCode;
  try {
    const centraIdentity = await checkCentraCode(code);
    fs.writeFileSync(
      "../shrouv.json",
      JSON.stringify(
        { ...shrouvConfig, messor_user_id: centraIdentity.userId },
        null,
        2
      )
    );
    return code;
  } catch (error) {
    return await getCentraCode();
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

    console.log(
      success(figlet.textSync(centraIdentity.userId.substring(0, 4))) + "\n"
    );

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

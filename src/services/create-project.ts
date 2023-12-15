import inquirer from "inquirer";
import { Genre, colors, warning } from "../constants/index.js";
import { createShrouvExperience } from "./core/create.js";
import { getDirectories } from "../utils.js";

interface CreateProjectAnswers {
  type: "full" | "easy";
}

export interface EasySetupAnswers {
  name: string;
  groupOwned: boolean;
  groupId?: number;
  payments: "owner" | "personal" | "group";
  projectTemplate: string;
  includeDev: boolean;
  genre: Genre;
  maxPlayerCount: number;
  enableStudioAccessToApis: boolean;
  targetAccess: "public" | "private" | "friends";
  playableDevices: Array<"computer" | "phone" | "tablet" | "console" | "vr">;
}

async function easySetup() {
  const answers = await inquirer.prompt<EasySetupAnswers>([
    {
      type: "input",
      name: "name",
      message: "What is the name of your project?",
      validate: (input) => {
        if (input.length > 2) {
          return true;
        } else {
          return "Project name must be at least 3 characters long.";
        }
      },
    },
    {
      type: "confirm",
      name: "groupOwned",
      message: "Should this experience be owned by a group?",
      default: false,
    },
    {
      type: "number",
      name: "groupId",
      message: "What is your group ID?",
      when: ({ groupOwned }) => groupOwned,
    },
    {
      type: "list",
      name: "payments",
      message:
        "Which account should be making payments when creating resources that cost Robux?",
      choices: [
        { name: "Owner", value: "owner" },
        { name: "Personal", value: "personal" },
        { name: "Group", value: "group" },
      ],
    },
    {
      type: "list",
      name: "projectTemplate",
      message: "What project template do you want to use?",
      choices: await getDirectories("./projects"),
      default: "classic"
    },
    {
      type: "confirm",
      name: "includeDev",
      message: "Do you want to include a development environment?",
      default: true,
    },
    {
      type: "list",
      name: "genre",
      message: "What genre is your game?",
      choices: Genre.map((genre) => ({ name: genre, value: genre })),
      default: "all",
    },
    {
      type: "number",
      name: "maxPlayerCount",
      message: "What is the maximum player count?",
      default: 10,
    },
    {
      type: "confirm",
      name: "enableStudioAccessToApis",
      message: "Do you want to enable Studio access to APIs?",
      default: true,
    },
    {
      type: "list",
      name: "targetAccess",
      message: "Who should be able to access this experience?",
      choices: [
        { name: "Public", value: "public" },
        { name: "Private", value: "private" },
        { name: "Friends", value: "friends" },
      ],
      default: "public",
    },
    {
      type: "checkbox",
      name: "playableDevices",
      message: "What devices should be able to play this experience?",
      choices: [
        { name: "Computer", value: "computer" },
        { name: "Phone", value: "phone" },
        { name: "Tablet", value: "tablet" },
        { name: "Console", value: "console" },
        { name: "VR", value: "vr" },
      ],
      default: ["computer", "phone", "tablet"],
    },
  ]);

  await createShrouvExperience(answers);
}

async function fullSetup() {
  console.log(warning("This feature is not yet implemented."));
}

export async function createProject() {
  const choices = [
    {
      name: `Easy ${colors.gray}(recommended)${colors.reset}`,
      value: "easy",
    },
    { name: `Full`, value: "full" },
  ] as const;

  const answers = await inquirer.prompt<CreateProjectAnswers>([
    {
      type: "list",
      name: "type",
      message: "What type of project setup do you want to use?",
      choices,
    },
  ]);

  if (answers.type === "easy") {
    await easySetup();
  } else {
    await fullSetup();
  }
}

import inquirer, { QuestionCollection } from "inquirer";
import PressToContinuePrompt from "inquirer-press-to-continue";
import figlet from "figlet";
import {
  Genre,
  answersToMantleConfig,
  generateMantleConfig,
} from "./mantle.js";
import { createProject } from "./setup.js";

console.log(figlet.textSync("ShrouvEngine"));

const setupType = ["easy", "full"] as const;
const payments = ["owner", "personal", "group"] as const;
const genre = [
  "all",
  "adventure",
  "building",
  "comedy",
  "fighting",
  "fps",
  "horror",
  "medieval",
  "military",
  "naval",
  "rpg",
  "sciFi",
  "sports",
  "townAndCity",
  "western",
] as const;
const targetAccess = ["public", "private", "friends"] as const;
const playableDevices = [
  "computer",
  "phone",
  "tablet",
  "console",
  "vr",
] as const;

export type Answers = {
  setupType: "easy" | "full";
} & InitialAnswers &
  GroupAnswers &
  FinalAnswers;

type InitialAnswers = {
  projectName: string;
  groupExperience: boolean;
};

type GroupAnswers = {
  groupId?: number;
};

type FinalAnswers = {
  payments: "owner" | "personal" | "group";
  includeDev: boolean;
  genre: Genre;
  enableStudioAccessToApis: boolean;
  maxPlayerCount: number;
  targetAccess: "public" | "private" | "friends";
  playableDevices: Array<"computer" | "phone" | "tablet" | "console" | "vr">;
};

const initialQuestions: QuestionCollection = [
  {
    type: "input",
    name: "projectName",
    message: "What is the name of your experience?",
    validate: (input) => {
      if (input.length > 0) {
        return true;
      } else {
        return "Please enter a name for your experience.";
      }
    },
  },
  {
    type: "confirm",
    name: "groupExperience",
    message: "Is this a group experience?",
    default: false,
  },
];

const groupQuestions: QuestionCollection = [
  {
    type: "number",
    name: "groupId",
    message: "Enter experience owner's group ID:",
    validate: (input) => {
      if (input > 0) {
        return true;
      } else {
        return "Please enter a valid ID.";
      }
    },
  },
];

const finalQuestions: QuestionCollection = [
  {
    type: "list",
    name: "payments",
    message: "Which account should make payments?",
    choices: payments,
    default: "owner",
  },
  {
    type: "confirm",
    name: "includeDev",
    message: "Include dev environment?",
  },
  {
    type: "list",
    name: "genre",
    message: "What genre?",
    choices: genre,
    default: "all",
  },
  {
    type: "confirm",
    name: "enableStudioAccessToApis",
    message: "Enable Studio access to APIs?",
    default: true,
  },
  {
    type: "number",
    name: "maxPlayerCount",
    message: "Max player count per server:",
    default: 10,
    validate: (input) => {
      if (input > 0 && input < 100) {
        return true;
      } else {
        return "Please enter a valid player count (1-100).";
      }
    },
  },
  {
    type: "list",
    name: "targetAccess",
    message: "Who can access this experience?",
    choices: targetAccess,
    default: "private",
  },
  {
    type: "checkbox",
    name: "playableDevices",
    message: "What devices are supported?",
    choices: playableDevices,
    default: ["computer"],
  },
  {
    type: "press-to-continue",
    name: "pressToContinue",
    anyKey: true,
    message: "Press any key to continue...",
  },
];

inquirer.registerPrompt("press-to-continue", PressToContinuePrompt);

const requestedSetupType = (await inquirer.prompt({
  type: "list",
  name: "setupType",
  message: "What type of setup do you want?",
  choices: setupType,
})) as { setupType: "easy" | "full" };

switch (requestedSetupType.setupType) {
  case "easy":
    let answersConfig: Answers = {
      setupType: "easy",
      projectName: "",
      groupExperience: false,
      payments: "owner",
      includeDev: false,
      playableDevices: ["computer"],
      targetAccess: "private",
      enableStudioAccessToApis: false,
      genre: "all",
      maxPlayerCount: 10,
    };
    const initialAnswers = (await inquirer.prompt(
      initialQuestions
    )) as InitialAnswers;

    if (initialAnswers.groupExperience) {
      const groupAnswers = (await inquirer.prompt(
        groupQuestions
      )) as GroupAnswers;
      answersConfig.groupId = groupAnswers.groupId;
    }

    const finalAnswers = (await inquirer.prompt(
      finalQuestions
    )) as FinalAnswers;

    answersConfig = { ...answersConfig, ...initialAnswers, ...finalAnswers };

    const config = answersToMantleConfig(answersConfig);
    createProject(answersConfig.projectName, config);
    break;
  case "full":
    break;
}

import inquirer from "inquirer";
import yaml from "js-yaml";
import fs from "fs";
import { manageProject } from "../select-project.js";
import { getCentraCode } from "../centra.js";
import { MantleConfig } from "./mantle.js";
import { RojoProjectConfig } from "../../rojo.js";
import { ShrouvGameConfig } from "./shrouv.js";
import { experienceToConfigs } from "../../utils.js";

export type Experience = {
  id?: number;
  title: string;
  description: string | null;
  public: boolean;
  roblox_link: string;
  thumbnails: string[];
  likes?: number;
  impressions?: number;
  referred_players?: number;
  category: "popular" | "recommended" | "new" | "trending" | "top_rated";
  owner: string;
  metadata: unknown;
};

interface CentraMainOptions {
  action: "status" | "push" | "pull" | "publish" | "back" | "exit";
}

interface CentraLinkPostBody {
  changeType: "create" | "update" | "delete";
  centraLinkCode: string;
  experience: Experience;
}

async function pushCentraChanges(path: string) {
  //   const centraUpdateBody: CentraLinkPostBody = {
  //     changeType: "update",
  //     experience,
  //     centraLinkCode,
  //   };
  //   const response = await fetch("http://localhost:3000/api/centra/update", {
  //     method: "POST",
  //     body: JSON.stringify(centraUpdateBody),
  //   });
}

function shrouvToCentraExperience(path: string): Experience {
  const [mantle, , shrouv] = experienceToConfigs(path);
  return {
    title: shrouv.name,
    description:
      mantle.target.experience.places?.start.configuration.description || "N/A",
    public: mantle.target.experience.configuration?.playability === "public",
    thumbnails: mantle.target.experience.thumbnails || [],
    category: "new",
    roblox_link: "https://roblox.com/games/0",
    owner: "",
    metadata: {},
  };
}

async function publishCentra(path: string) {
  const centraLinkCode = await getCentraCode();
  console.log(`code: ${centraLinkCode}`);
  const experience = shrouvToCentraExperience(path);
  const centraUpdateBody: CentraLinkPostBody = {
    changeType: "create",
    centraLinkCode,
    experience,
  };
  const response = await fetch("http://localhost:3000/api/centra/update", {
    method: "POST",
    body: JSON.stringify(centraUpdateBody),
  });

  const json = await response.json();
  console.dir(json);
}

export async function manageExperienceCentra(path: string) {
  const answers = await inquirer.prompt<CentraMainOptions>([
    {
      type: "list",
      name: "action",
      message: "What do you want to do?",
      choices: [
        { name: "1. Check Centra Status", value: "status" },
        { name: "2. Push staged changes", value: "push" },
        { name: "3. Pull newest changes", value: "pull" },
        { name: "4. Publish to Messor Centra", value: "publish" },
        new inquirer.Separator(),
        { name: "5. Back", value: "back" },
        { name: "6. Exit", value: "exit" },
        new inquirer.Separator(),
      ],
    },
  ]);

  switch (answers.action) {
    case "status": {
      break;
    }
    case "push": {
      break;
    }
    case "pull": {
      break;
    }
    case "publish": {
      await publishCentra(path);
      break;
    }
    case "back": {
      await manageProject(path);
      break;
    }
    case "exit": {
      return;
    }
  }
}

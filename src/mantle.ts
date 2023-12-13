import yaml from "js-yaml";
import fs from "fs";
import { Answers } from "./index.js";

interface MantleEnvironment {
  label: string;
  branches?: string[];
  tagCommit?: boolean;
  targetNamePrefix?: "environmentLabel" | object;
  targetAccess?: "public" | "private" | "friends";
  targetOverrides?: MantleExperience;
}

export type Genre =
  | "all"
  | "adventure"
  | "building"
  | "comedy"
  | "fighting"
  | "fps"
  | "horror"
  | "medieval"
  | "military"
  | "naval"
  | "rpg"
  | "sciFi"
  | "sports"
  | "townAndCity"
  | "western";

interface MantleExperienceConfiguration {
  genre?: Genre;
  playableDevices?: Array<"computer" | "phone" | "tablet" | "console" | "vr">;
  playability?: "public" | "private" | "friends";
  paidAccess?: "disabled" | { price: number };
  privateServers?: "disabled" | "free" | { price: number };
  enableStudioAccessToApis?: boolean;
  allowThirdPartySales?: boolean;
  allowThirdPartyTeleports?: boolean;
  avatarType?: "r6" | "r15" | "playerChoice";
  avatarAnimationType?: "standard" | "playerChoice";
  avatarCollisionType?: "outerBox" | "innerBox";
}

interface DeveloperProduct {
  name: string;
  description?: string;
  icon?: string;
  price: number;
}

interface GamePass {
  name: string;
  description?: string;
  icon: string;
  price?: number;
}

interface Badge {
  name: string;
  description?: string;
  icon: string;
  enabled?: boolean;
}

interface MantlePlaceConfiguration {
  name?: string;
  description?: string;
  maxPlayerCount?: number;
  allowCopying?: boolean;
  serverFill?: "robloxOptimized" | "maximum" | { reservedSlots: number };
}

interface MantlePlace {
  file: string;
  configuration: MantlePlaceConfiguration;
}

interface MantleExperience {
  configuration?: MantleExperienceConfiguration;
  places?: { [key: string]: MantlePlace };
  icon?: string;
  thumbnails?: string[];
  socialLinks?: { title: string; url: string }[];
  products?: { [key: string]: DeveloperProduct };
  passes?: { [key: string]: GamePass };
  badges?: { [key: string]: Badge };
  assets?: Array<string | { file: string; name: string }>;
  spatialVoice?: { enabled: boolean };
  notifications?: { [key: string]: { name?: string; content: string } };
  state?:
    | "local"
    | { localKey: string }
    | { remote: { region: string; bucket: string; key: string } };
}

interface MantleTarget {
  experience: MantleExperience;
}

export interface MantleConfig {
  owner?: "personal" | { group: number };
  payments?: "owner" | "personal" | "group";
  environments: MantleEnvironment[];
  target: MantleTarget;
}

export function generateMantleConfig(
  config: Partial<MantleConfig>
): MantleConfig {
  const defaultConfig: MantleConfig = {
    environments: [...(config.environments || [])],
    target: {
      experience: {},
    },
  };
  const yamlConfig = yaml.dump(defaultConfig);
  fs.writeFileSync("mantle.yml", yamlConfig);
  return defaultConfig;
}

export function answersToMantleConfig(answers: Answers): MantleConfig {
  const owner = answers.groupExperience
    ? { group: answers.groupId! }
    : "personal";
  const {
    payments,
    includeDev,
    playableDevices,
    genre,
    enableStudioAccessToApis,
  } = answers;
  const environments: MantleEnvironment[] = [
    ...(includeDev
      ? [
          {
            label: "dev",
            branches: ["dev", "dev/*"],
            targetOverrides: {
              icon: "assets\\marketing\\beta-game-icon.png",
            },
          },
        ]
      : []),
    {
      label: "production",
      branches: ["main"],
      targetAccess: "public",
    },
  ];

  const defaultConfig: MantleConfig = {
    owner,
    payments,
    environments,
    target: {
      experience: {
        configuration: {
          genre,
          playableDevices,
          playability: answers.targetAccess,
          enableStudioAccessToApis,
        },
        places: {
          start: {
            file: "game.rbxlx",
            configuration: {
              name: answers.projectName,
              description:
                "This is an example place description \
                uses ShrouvEngine \
                ",
              maxPlayerCount: 10,
              serverFill: "robloxOptimized",
            },
          },
        },
        socialLinks: [
          {
            title: "Follow on Twitter",
            url: "https://twitter.com/Roblox",
          },
        ],
        products: {
          fiftyGold: {
            name: "50 Gold!",
            description: "50 Gold",
            icon: "assets\\products\\50-gold.png",
            price: 50,
          },
          hundredGold: {
            name: "100 Gold!",
            description: "100 Gold",
            icon: "assets\\products\\100-gold.png",
            price: 100,
          },
        },
        passes: {
          shipOfTheLine: {
            name: "Ship of the Line",
            description: "Get the best ship in the game",
            icon: "assets\\passes\\ship-of-the-line.png",
            price: 499,
          },
        },
        badges: {
          captureFirstShip: {
            name: "Capture First Ship",
            description: "Capture your first ship",
            icon: "assets\\badges\\capture-first-ship.png",
          },
        },
        assets: [
          "assets/sounds/*",
          { file: "assets\\marketing\\icon.png", name: "game-icon" },
        ],
        notifications: {
          customInvitePrompt: {
            name: "Custom Invite Prompt",
            content:
              "{displayName} is inviting you to join their crew on {experienceName}!",
          },
        },
      },
    },
  };
  return defaultConfig;
}

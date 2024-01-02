import { DEFAULT_DESCRIPTION, Genre } from "../../constants/index.js";
import { EasySetupAnswers } from "../create-project.js";

interface MantleEnvironment {
  label: string;
  branches?: string[];
  tagCommit?: boolean;
  targetNamePrefix?: "environmentLabel" | object;
  targetAccess?: "public" | "private" | "friends";
  targetOverrides?: MantleExperience;
}

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
  file?: string;
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

export function answersToMantleConfig({
  name,
  payments,
  groupOwned,
  groupId,
  genre,
  playableDevices,
  includeDev,
  enableStudioAccessToApis,
  maxPlayerCount,
  targetAccess,
}: EasySetupAnswers): MantleConfig {
  const owner = groupOwned ? { group: groupId! } : "personal";
  const environments: MantleEnvironment[] = [
    ...(includeDev
      ? [
          {
            label: "dev",
            targetOverrides: {
              icon: "assets\\marketing\\beta-game-icon.png",
              places: {
                start: {
                  configuration: {
                    name: `${name} DEV 🚧`,
                    description: `${DEFAULT_DESCRIPTION} 🚧🚧 DEV 🚧🚧`,
                  },
                },
              },
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
  const config: MantleConfig = {
    owner,
    payments,
    environments,
    target: {
      experience: {
        configuration: {
          genre,
          playableDevices,
          playability: targetAccess,
          enableStudioAccessToApis,
        },
        places: {
          start: {
            file: "game.rbxlx",
            configuration: {
              name,
              description: DEFAULT_DESCRIPTION,
              maxPlayerCount,
              serverFill: "robloxOptimized",
            },
          },
        },
        assets: ["assets/sounds/*"],
      },
    },
  };
  return config;
}

import chalk from "chalk";

export const error = chalk.bold.red;
export const warning = chalk.bold.hex("#FFA500");
export const primary = chalk.bold.white;
export const success = chalk.bold.green;

export const colors = {
  gray: "\x1b[1;30m",
  red: "\x1b[1;31m",
  green: "\x1b[1;32m",
  yellow: "\x1b[1;33m",
  blue: "\x1b[1;34m",
  magenta: "\x1b[1;35m",
  cyan: "\x1b[1;36m",
  white: "\x1b[1;37m",
  reset: "\x1b[0m",
} as const;

export const Genre = [
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
export type Genre = (typeof Genre)[number];

export const DEFAULT_DESCRIPTION = "A ShrouvEngine experience";

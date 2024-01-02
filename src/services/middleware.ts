import fs from "fs";
import { ShrouvConfig } from "./core/shrouv.js";

export async function middleware() {
  if (!fs.existsSync("../shrouv.json")) {
    const shrouvConfig: ShrouvConfig = {
      centra_link_code: "",
    };
    fs.writeFileSync("../shrouv.json", JSON.stringify(shrouvConfig, null, 2));
  }
}

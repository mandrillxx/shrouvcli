import fs from "fs";
import { ShrouvConfig } from "./core/shrouv.js";

export async function middleware() {
  if (!fs.existsSync("../shrouv.json")) {
    const shrouvConfig: ShrouvConfig = {
      centra_link_code: "",
      messor_user_id: "",
    };
    fs.writeFileSync("../shrouv.json", JSON.stringify(shrouvConfig, null, 2));
  }
}

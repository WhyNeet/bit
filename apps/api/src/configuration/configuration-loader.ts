import * as fs from "node:fs";
import * as path from "node:path";
import * as yaml from "js-yaml";
import { LOCATION } from "./constants";

export type Configuration = Record<string, unknown>;

// biome-ignore lint/complexity/noStaticOnlyClass: method grouping
export class ConfigurationLoader {
  public static dev(fileName: string): () => Configuration {
    const conf = ConfigurationLoader.load(fileName, true);

    conf.env = { dev: true };

    return () => conf;
  }

  public static osenv(): () => Configuration {
    const replaceList = ["db_", "tokens_", "storage_", "env_dev"];
    const env: Configuration = { ...process.env };

    for (const key of Object.keys(env)) {
      if (!replaceList.some((prefix) => key.startsWith(prefix))) continue;

      const value = Number.isNaN(+env[key]) ? env[key] : +env[key];

      env[key.replaceAll("_", ".")] = value;
      delete env[key];
    }

    return () => env;
  }

  private static load(fileName: string, devOnly?: boolean): Configuration {
    if (process.env.NODE_ENV === "production" && devOnly) return {};

    return ConfigurationLoader.loadYaml(fileName);
  }

  private static loadYaml(fileName: string): Configuration {
    const filePath = path.join(LOCATION, fileName);
    const content = fs.readFileSync(filePath, { encoding: "utf-8" });

    return yaml.load(content) as Configuration;
  }
}

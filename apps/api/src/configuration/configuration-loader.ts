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

	private static load(fileName: string, devOnly?: boolean): Configuration {
		if (process.env.NODE_ENV === "production" && devOnly) return {};

		return ConfigurationLoader.loadYaml(fileName);
	}

	private static loadYaml(fileName: string): Configuration {
		const filePath = path.join(LOCATION, fileName);
		const content = fs.readFileSync(filePath, { encoding: "utf-8" });

		return yaml.load(content) as Record<string, unknown>;
	}
}

import { Module } from "@nestjs/common";

import { ConfigModule } from "@nestjs/config";
import { ConfigurationLoader } from "./configuration-loader";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [ConfigurationLoader.dev("dev.config.yaml")],
			isGlobal: true,
		}),
	],
})
export class ConfigurationModule {}

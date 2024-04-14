import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./configuration/configuration.module";
import { DataServicesModule } from "./frameworks/data-services/data-services.module";

@Module({
	imports: [ConfigurationModule, DataServicesModule],
})
export class AppModule {}

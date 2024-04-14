import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./configuration/configuration.module";
import { AuthController } from "./controllers/auth.controller";
import { FeaturesModule } from "./features/features.module";
import { DataServicesModule } from "./frameworks/data-services/data-services.module";

@Module({
	imports: [ConfigurationModule, DataServicesModule, FeaturesModule],
	controllers: [AuthController],
})
export class AppModule {}

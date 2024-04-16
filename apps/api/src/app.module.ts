import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./configuration/configuration.module";
import { AuthController } from "./controllers/auth.controller";
import { FeaturesModule } from "./features/features.module";
import { FrameworksModule } from "./frameworks/frameworks.module";

@Module({
	imports: [ConfigurationModule, FrameworksModule, FeaturesModule],
	controllers: [AuthController],
})
export class AppModule {}

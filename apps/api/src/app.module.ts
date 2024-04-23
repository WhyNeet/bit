import { Module } from "@nestjs/common";
import { ConfigurationModule } from "./configuration/configuration.module";
import { AuthController } from "./controllers/auth.controller";
import { CommunityController } from "./controllers/community.controller";
import { PostController } from "./controllers/post.controller";
import { UserController } from "./controllers/user.controller";
import { FeaturesModule } from "./features/features.module";
import { FrameworksModule } from "./frameworks/frameworks.module";

@Module({
	imports: [ConfigurationModule, FrameworksModule, FeaturesModule],
	controllers: [
		AuthController,
		UserController,
		CommunityController,
		PostController,
	],
})
export class AppModule {}

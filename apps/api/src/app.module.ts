import { Module } from "@nestjs/common";
import { NestjsFormDataModule as FormDataModule } from "nestjs-form-data";
import { ConfigurationModule } from "./configuration/configuration.module";
import { AuthController } from "./controllers/auth.controller";
import { CommunityController } from "./controllers/community.controller";
import { CurrentUserController } from "./controllers/current-user.controller";
import { MediaController } from "./controllers/media.controller";
import { PostController } from "./controllers/post.controller";
import { UserController } from "./controllers/user.controller";
import { FeaturesModule } from "./features/features.module";
import { FrameworksModule } from "./frameworks/frameworks.module";

@Module({
	imports: [
		ConfigurationModule,
		FrameworksModule,
		FeaturesModule,
		FormDataModule,
	],
	controllers: [
		AuthController,
		UserController,
		CurrentUserController,
		CommunityController,
		PostController,
		MediaController,
	],
})
export class AppModule {}

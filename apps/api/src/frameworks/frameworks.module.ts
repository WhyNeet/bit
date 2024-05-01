import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DataServicesModule } from "./data-services/data-services.module";
import { ExceptionHandlingModule } from "./exception-handling/exception-handling.module";
import { StorageServicesModule } from "./storage-services/storage-services.module";
import { VectorServicesModule } from "./vector-services/vector-services.module";

@Module({
	imports: [
		AuthModule,
		DataServicesModule,
		ExceptionHandlingModule,
		StorageServicesModule,
		VectorServicesModule,
	],
	exports: [
		AuthModule,
		DataServicesModule,
		ExceptionHandlingModule,
		StorageServicesModule,
		VectorServicesModule,
	],
})
export class FrameworksModule {}

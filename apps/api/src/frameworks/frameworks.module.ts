import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DataServicesModule } from "./data-services/data-services.module";
import { ExceptionHandlingModule } from "./exception-handling/exception-handling.module";
import { StorageServicesModule } from "./storage-services/storage-services.module";

@Module({
	imports: [
		AuthModule,
		DataServicesModule,
		ExceptionHandlingModule,
		StorageServicesModule,
	],
	exports: [
		AuthModule,
		DataServicesModule,
		ExceptionHandlingModule,
		StorageServicesModule,
	],
})
export class FrameworksModule {}

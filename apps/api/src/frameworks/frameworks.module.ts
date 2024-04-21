import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DataServicesModule } from "./data-services/data-services.module";
import { ExceptionHandlingModule } from "./exception-handling/exception-handling.module";

@Module({
	imports: [AuthModule, DataServicesModule, ExceptionHandlingModule],
	exports: [AuthModule, DataServicesModule, ExceptionHandlingModule],
})
export class FrameworksModule {}

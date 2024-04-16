import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DataServicesModule } from "./data-services/data-services.module";

@Module({
	imports: [AuthModule, DataServicesModule],
	exports: [AuthModule, DataServicesModule],
})
export class FrameworksModule {}

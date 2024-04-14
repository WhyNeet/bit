import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/frameworks/data-services/data-services.module";
import { UserFactoryService } from "./user-factory.service";
import { UserRepositoryService } from "./user-repository.service";

@Module({
	imports: [DataServicesModule],
	providers: [UserFactoryService, UserRepositoryService],
	exports: [UserFactoryService, UserRepositoryService],
})
export class UserFeatureModule {}

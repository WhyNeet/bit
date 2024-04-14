import { Module } from "@nestjs/common";
import { UserFactoryService } from "./user-factory.service";
import { UserRepositoryService } from "./user-repository.service";

@Module({
	providers: [UserFactoryService, UserRepositoryService],
	exports: [UserFactoryService, UserRepositoryService],
})
export class UserFeatureModule {}

import { Module } from "@nestjs/common";
import { RelationFactoryService } from "./relation-factory.service";

@Module({
	imports: [],
	providers: [RelationFactoryService],
	exports: [RelationFactoryService],
})
export class RelationFeatureModule {}

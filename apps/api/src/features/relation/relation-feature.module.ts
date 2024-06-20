import { Module } from "@nestjs/common";
import { RelationFactoryService } from "./relation-factory.service";
import { RelationHelperService } from "./relation-helper.service";

@Module({
  imports: [],
  providers: [RelationFactoryService, RelationHelperService],
  exports: [RelationFactoryService, RelationHelperService],
})
export class RelationFeatureModule {}

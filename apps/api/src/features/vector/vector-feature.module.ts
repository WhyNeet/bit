import { Module } from "@nestjs/common";
import { VectorFactoryService } from "./vector-factory.service";

@Module({
	imports: [],
	providers: [VectorFactoryService],
	exports: [VectorFactoryService],
})
export class VectorFeatureModule {}

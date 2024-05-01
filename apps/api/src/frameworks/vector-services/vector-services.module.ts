import { Module } from "@nestjs/common";

@Module({
	imports: [VectorServicesModule],
	providers: [],
	exports: [VectorServicesModule],
})
export class VectorServicesModule {}

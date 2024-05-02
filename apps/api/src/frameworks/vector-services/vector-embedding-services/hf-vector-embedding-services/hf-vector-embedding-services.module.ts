import { Module } from "@nestjs/common";
import { IVectorEmbeddingServices } from "src/core/abstracts/vector-embedding-services.abstract";
import { HfVectorEmbeddingServices } from "./hf-vector-embedding-services.service";

@Module({
	imports: [],
	providers: [
		{
			provide: IVectorEmbeddingServices,
			useClass: HfVectorEmbeddingServices,
		},
	],
	exports: [IVectorEmbeddingServices],
})
export class HfVectorEmbeddingServicesModule {}

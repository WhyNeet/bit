import { Module } from "@nestjs/common";
import { IVectorEmbeddingServices } from "src/core/abstracts/vector-embedding-services.abstract";
import { WhereIsAIVectorEmbeddingServices } from "./whereisai-vector-embedding-services.service";

@Module({
	imports: [],
	providers: [
		{
			provide: IVectorEmbeddingServices,
			useClass: WhereIsAIVectorEmbeddingServices,
		},
	],
	exports: [IVectorEmbeddingServices],
})
export class WhereIsAIVectorEmbeddingServicesModule {}

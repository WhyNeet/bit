import { Module } from "@nestjs/common";
import { WhereIsAIVectorEmbeddingServicesModule } from "./whereisai-vector-embedding-services/whereisai-vector-embedding-services.module";

@Module({
	imports: [WhereIsAIVectorEmbeddingServicesModule],
	providers: [],
	exports: [WhereIsAIVectorEmbeddingServicesModule],
})
export class VectorEmbeddingServicesModule {}

import { Module } from "@nestjs/common";
import { HfVectorEmbeddingServicesModule } from "./hf-vector-embedding-services/hf-vector-embedding-services.module";

@Module({
	imports: [HfVectorEmbeddingServicesModule],
	providers: [],
	exports: [HfVectorEmbeddingServicesModule],
})
export class VectorEmbeddingServicesModule {}

import { Module } from "@nestjs/common";
import { VectorEmbeddingServicesModule } from "./vector-embedding-services/vector-embedding-services.module";

@Module({
	imports: [VectorServicesModule, VectorEmbeddingServicesModule],
	providers: [],
	exports: [VectorServicesModule, VectorEmbeddingServicesModule],
})
export class VectorServicesModule {}

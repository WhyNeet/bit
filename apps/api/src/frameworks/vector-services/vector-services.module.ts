import { Module } from "@nestjs/common";
import { VectorEmbeddingServicesModule } from "./vector-embedding-services/vector-embedding-services.module";
import { VectorStorageServicesModule } from "./vector-storage-services/vector-storage-services.module";

@Module({
  imports: [VectorStorageServicesModule, VectorEmbeddingServicesModule],
  providers: [],
  exports: [VectorStorageServicesModule, VectorEmbeddingServicesModule],
})
export class VectorServicesModule {}

import { Module } from "@nestjs/common";
import { MilvusVectorServicesModule } from "./milvus/milvus-vector-services.module";

@Module({
  imports: [MilvusVectorServicesModule],
  providers: [],
  exports: [MilvusVectorServicesModule],
})
export class VectorStorageServicesModule {}

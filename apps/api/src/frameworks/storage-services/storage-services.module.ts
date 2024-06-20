import { Module } from "@nestjs/common";
import { S3StorageServicesModule } from "./s3/s3-storage-services.module";

@Module({
  imports: [S3StorageServicesModule],
  providers: [],
  exports: [S3StorageServicesModule],
})
export class StorageServicesModule {}

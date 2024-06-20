import { Module } from "@nestjs/common";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { S3StorageServices } from "./s3-storage-services.service";

@Module({
  imports: [],
  providers: [
    {
      provide: IStorageServices,
      useClass: S3StorageServices,
    },
  ],
  exports: [IStorageServices],
})
export class S3StorageServicesModule {}

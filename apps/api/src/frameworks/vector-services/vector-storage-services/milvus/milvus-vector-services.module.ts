import { Module } from "@nestjs/common";
import { IVectorStorageServices } from "src/core/abstracts/vector-storage-services.abstract";
import { MilvusVectorServices } from "./milvus-vector-services.service";

@Module({
	imports: [],
	providers: [
		{
			provide: IVectorStorageServices,
			useClass: MilvusVectorServices,
		},
	],
	exports: [IVectorStorageServices],
})
export class MilvusVectorServicesModule {}

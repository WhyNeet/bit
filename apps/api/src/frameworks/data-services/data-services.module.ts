import { Module } from "@nestjs/common";
import { MongoDataServicesModule } from "./mongo/mongo-data-services.module";

@Module({
	imports: [MongoDataServicesModule],
})
export class DataServicesModule {}

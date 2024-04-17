import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Token, TokenSchema } from "./model/token.model";
import { User, UserSchema } from "./model/user.model";
import { MongoDataServices } from "./mongo-data-services.service";

@Module({
	imports: [
		MongooseModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					uri: `mongodb://${configService.get<string>(
						"mongo.host",
					)}:${configService.get<string>("mongo.port")}`,
					dbName: "primary",
					auth: {
						username: configService.get<string>("mongo.auth.username"),
						password: configService.get<string>("mongo.auth.password"),
					},
				};
			},
		}),
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Token.name, schema: TokenSchema },
		]),
	],
	providers: [
		{
			provide: IDataServices,
			useClass: MongoDataServices,
		},
	],
	exports: [IDataServices],
})
export class MongoDataServicesModule {}

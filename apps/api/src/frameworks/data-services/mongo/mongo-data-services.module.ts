import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Community, CommunitySchema } from "./model/community.model";
import { Post, PostSchema } from "./model/post.model";
import {
	UserCommunityRelation,
	UserCommunityRelationSchema,
} from "./model/relation/user-community.model";
import {
	UserPostRelation,
	UserPostRelationSchema,
} from "./model/relation/user-post.model";
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
						"db.mongo.host",
					)}:${configService.get<string>("db.mongo.port")}`,
					dbName: "primary",
					auth: {
						username: configService.get<string>("db.mongo.auth.username"),
						password: configService.get<string>("db.mongo.auth.password"),
					},
				};
			},
		}),
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Token.name, schema: TokenSchema },
			{ name: Community.name, schema: CommunitySchema },
			{ name: Post.name, schema: PostSchema },
			{ name: UserCommunityRelation.name, schema: UserCommunityRelationSchema },
			{ name: UserPostRelation.name, schema: UserPostRelationSchema },
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

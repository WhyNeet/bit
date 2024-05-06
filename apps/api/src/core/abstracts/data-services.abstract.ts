import { Community } from "common/entities/community.entity";
import { Post } from "common/entities/post.entity";
import { UserCommunityRelation } from "common/entities/relation/user-community.entity";
import { UserPostRelation } from "common/entities/relation/user-post.entity";
import { Token } from "common/entities/token.entity";
import type { User } from "common/entities/user.entity";
import type { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
	abstract users: IGenericRepository<User>;
	abstract tokens: IGenericRepository<Token>;
	abstract communities: IGenericRepository<Community>;
	abstract posts: IGenericRepository<Post>;

	abstract userCommunityRelations: IGenericRepository<UserCommunityRelation>;
	abstract userPostRelations: IGenericRepository<UserPostRelation>;
}

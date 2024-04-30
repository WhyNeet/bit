import { Community } from "../entities/community.entity";
import { Post } from "../entities/post.entity";
import { UserCommunityRelation } from "../entities/relation/user-community.entity";
import { Token } from "../entities/token.entity";
import type { User } from "../entities/user.entity";
import type { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
	abstract users: IGenericRepository<User>;
	abstract tokens: IGenericRepository<Token>;
	abstract communities: IGenericRepository<Community>;
	abstract posts: IGenericRepository<Post>;

	abstract userCommunityRelations: IGenericRepository<UserCommunityRelation>;
}

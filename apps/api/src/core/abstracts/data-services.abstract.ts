import {
  Community,
  Post,
  Token,
  User,
  UserCommunityRelation,
  UserPostRelation,
} from "common";
import type { IGenericRepository } from "./generic-repository.abstract";

export abstract class IDataServices {
  abstract users: IGenericRepository<User>;
  abstract tokens: IGenericRepository<Token>;
  abstract communities: IGenericRepository<Community>;
  abstract posts: IGenericRepository<Post>;

  abstract userCommunityRelations: IGenericRepository<UserCommunityRelation>;
  abstract userPostRelations: IGenericRepository<UserPostRelation>;
}

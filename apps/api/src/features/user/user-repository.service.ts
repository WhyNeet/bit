import { Injectable } from "@nestjs/common";
import { User } from "common";
import { UserUserRelation } from "common";
import { UserUserRelationType } from "common";
import { UserPostRelationType } from "common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { CreateUserDto } from "src/core/dtos/user.dto";
import { AuthException } from "../exception-handling/exceptions/auth.exception";
import { RelationFactoryService } from "../relation/relation-factory.service";
import { UserFactoryService } from "./user-factory.service";

@Injectable()
export class UserRepositoryService {
  constructor(
    private dataServices: IDataServices,
    private userFactoryService: UserFactoryService,
    private relationFactoryService: RelationFactoryService,
    private cachingServices: ICachingServices,
  ) {}

  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userFactoryService.createFromDto(createUserDto);

    try {
      return await this.dataServices.users.create(user);
    } catch (e) {
      if (e.code && e.code === 11000)
        throw new AuthException.UserAlreadyExists(
          e.keyValue
            ? `User with this ${Object.keys(e.keyValue)[0]} already exists.`
            : undefined,
        );
      throw e;
    }
  }

  public async getUsersById(ids: string[], limit?: number): Promise<User[]> {
    return this.dataServices.users.getAll({ _id: { $in: ids } }, {}, limit, 0);
  }

  public async getUserById(id: string): Promise<User | null> {
    const cachedUser = await this.cachingServices.get<User>(`user:${id}`, true);

    if (cachedUser) {
      cachedUser.id = (cachedUser as unknown as { _id: string })._id;
      return cachedUser;
    }

    const user = await this.dataServices.users.getById(id);

    if (user) await this.cachingServices.set(`user:${id}`, user);

    return user;
  }

  public getUserByEmail(email: string): Promise<User | null> {
    return this.dataServices.users.get({ email });
  }

  public getUserByUsername(username: string): Promise<User | null> {
    return this.dataServices.users.get({ username });
  }

  public async updateUser(id: string, user: User): Promise<User | null> {
    const res = await this.dataServices.users.update({ _id: id }, user);

    await this.cachingServices.set(`user:${id}`, user);

    return res;
  }

  public async deleteUser(id: string): Promise<User | null> {
    await this.cachingServices.delete(`user:${id}`);

    return this.dataServices.users.delete({ _id: id });
  }

  public async followUser(
    followerId: string,
    followingId: string,
  ): Promise<UserUserRelation | null> {
    const existing = await this.dataServices.userUserRelations.get({
      fromUser: followerId,
      toUser: followingId,
      type: UserUserRelationType.Follow,
    });
    if (existing) return null;

    const relation = this.relationFactoryService.createUserUserRelation(
      followerId,
      followingId,
      UserUserRelationType.Follow,
    );

    const user = await this.dataServices.users.update(
      { _id: followingId },
      { $inc: { followers: 1 } },
    );
    user.followers += 1;
    await this.cachingServices.set(`user:${followingId}`, user);

    return await this.dataServices.userUserRelations.create(relation);
  }

  public async unfollowUser(
    followerId: string,
    followingId: string,
  ): Promise<UserUserRelation> {
    const res = await this.dataServices.userUserRelations.delete({
      fromUser: followerId,
      toUser: followingId,
      type: UserUserRelationType.Follow,
    });

    if (!res) return res;

    const user = await this.dataServices.users.update(
      { _id: followingId },
      { $inc: { followers: -1 } },
    );
    user.followers -= 1;
    await this.cachingServices.set(`user:${followingId}`, user);

    return res;
  }

  public async getRelation(
    fromUser: string,
    toUser: string,
    type?: UserUserRelationType,
  ): Promise<UserUserRelation> {
    const filter = type ? { fromUser, toUser, type } : { fromUser, toUser };
    return await this.dataServices.userUserRelations.get(filter);
  }
}

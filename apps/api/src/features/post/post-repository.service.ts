import { Injectable } from "@nestjs/common";
import { Post, PostDto, UserPostRelation, UserPostRelationType } from "common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { UpdatePostDto } from "src/core/dtos/post.dto";
import { CommunityRepositoryService } from "../community/community-repository.service";
import { RelationFactoryService } from "../relation/relation-factory.service";
import { UserRepositoryService } from "../user/user-repository.service";
import { PostFactoryService } from "./post-factory.service";

@Injectable()
export class PostRepositoryService {
  constructor(
    private dataServices: IDataServices,
    private postFactoryService: PostFactoryService,
    private relationFactoryService: RelationFactoryService,
    private cachingServices: ICachingServices,
    private communityRepositoryService: CommunityRepositoryService,
    private userRepositoryService: UserRepositoryService,
  ) {}

  public async createPost(post: Post): Promise<Post> {
    return await this.dataServices.posts.create(post);
  }

  public async getHomePosts(
    page: number,
    perPage: number,
    userId: string,
    populate?: string[],
  ): Promise<Post[]> {
    const cachedAllowedCommunities = await this.cachingServices.sget<string>(
      `userCommunities:${userId}`,
    );

    const communities =
      cachedAllowedCommunities.length > 0
        ? cachedAllowedCommunities
        : (
            await this.communityRepositoryService.getUserCommunities(userId)
          ).map((c) => c.community.toString());

    if (!cachedAllowedCommunities.length && communities.length)
      await this.cachingServices.sadd(`userCommunities:${userId}`, communities);

    const cachedFollowedUsers = await this.cachingServices.sget<string>(
      `userFollowing:${userId}`,
    );

    const users =
      cachedFollowedUsers.length > 0
        ? cachedFollowedUsers
        : await this.userRepositoryService.getFollowingIds(userId);

    const communityQuery = communities
      ? [{ community: { $in: communities } }]
      : [];
    const authorQuery = users ? [{ author: { $in: users } }] : [];
    const orQuery = [...communityQuery, ...authorQuery];
    return await this.dataServices.posts.getAll(
      orQuery.length ? { $or: orQuery } : undefined,
      { createdAt: "desc" },
      perPage,
      perPage * page,
      populate,
    );
  }

  public async getLatestPosts(
    page: number,
    perPage: number,
    communities?: string[],
    users?: string[],
    populate?: string[],
  ): Promise<Post[]> {
    const communityQuery = communities
      ? [{ community: { $in: communities } }]
      : [];
    const authorQuery = users ? [{ author: { $in: users } }] : [];
    const orQuery = [...communityQuery, ...authorQuery];
    return await this.dataServices.posts.getAll(
      orQuery.length ? { $or: orQuery } : undefined,
      { createdAt: "desc" },
      perPage,
      perPage * page,
      populate,
    );
  }

  public async getPostById(
    postId: string,
    include?: string[],
    select?: string,
  ): Promise<Post | null> {
    return await this.dataServices.posts.getById(postId, include, select);
  }

  public async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
    images: string[],
    files: string[],
  ): Promise<Post | null> {
    const post = this.postFactoryService.createFromUpdateDto(
      updatePostDto,
      images,
      files,
    );

    return await this.dataServices.posts.update({ _id: postId }, post);
  }

  public async upvotePost(
    postId: string,
    userId: string,
  ): Promise<UserPostRelation | null> {
    const relation = await this.dataServices.userPostRelations.get({
      post: postId,
      user: userId,
      type: {
        // only find a relation with upvote/downvote
        // there can be many types of relations, but there is only one instance of upvote/downvote relation
        $in: [UserPostRelationType.Upvote, UserPostRelationType.Downvote],
      },
    });

    // if post is already upvoted, return
    if (relation?.type === UserPostRelationType.Upvote) return null;
    const post = await this.dataServices.posts.update(
      { _id: postId },
      { $inc: { upvotes: 1 } },
    );

    // if post does not exist, return
    if (!post) return null;

    // if post is downvoted, but upvote was pressed, remove the downvote (post upvotes is already increased)
    if (relation?.type === UserPostRelationType.Downvote) {
      await this.dataServices.posts.update(
        { _id: postId },
        { $inc: { downvotes: -1 } },
      );
      return await this.dataServices.userPostRelations.update(
        { user: userId, post: postId, type: UserPostRelationType.Downvote },
        { type: UserPostRelationType.Upvote },
      );
    }

    // if post was not downvoted before, create an upvote relation
    return await this.dataServices.userPostRelations.create(
      this.relationFactoryService.createUserPostRelation(
        userId,
        postId,
        UserPostRelationType.Upvote,
      ),
    );
  }

  public async removePostUpvote(
    postId: string,
    userId: string,
  ): Promise<UserPostRelation | null> {
    const relation = await this.dataServices.userPostRelations.delete({
      user: userId,
      post: postId,
      type: UserPostRelationType.Upvote,
    });

    // if post upvote does not exist, return (=> upvotes are not decremented)
    if (!relation) return null;

    // decrement upvotes
    await this.dataServices.posts.update(
      { _id: postId },
      { $inc: { upvotes: -1 } },
    );

    return relation;
  }

  public async downvotePost(
    postId: string,
    userId: string,
  ): Promise<UserPostRelation | null> {
    const relation = await this.dataServices.userPostRelations.get({
      user: userId,
      post: postId,
      type: {
        $in: [UserPostRelationType.Upvote, UserPostRelationType.Downvote],
      },
    });

    // if post is already downvoted, return
    if (relation?.type === UserPostRelationType.Downvote) return null;

    // increment downvotes
    const post = await this.dataServices.posts.update(
      { _id: postId },
      { $inc: { downvotes: 1 } },
    );

    // if post does not exist, return
    if (!post) return null;

    // if post is already upvoted, replace that upvote with a downvote
    if (relation?.type === UserPostRelationType.Upvote) {
      await this.dataServices.posts.update(
        { _id: postId },
        { $inc: { upvotes: -1 } },
      );
      return await this.dataServices.userPostRelations.update(
        { user: userId, post: postId, type: UserPostRelationType.Upvote },
        { type: UserPostRelationType.Downvote },
      );
    }

    return await this.dataServices.userPostRelations.create(
      this.relationFactoryService.createUserPostRelation(
        userId,
        postId,
        UserPostRelationType.Downvote,
      ),
    );
  }

  public async removePostDownvote(
    postId: string,
    userId: string,
  ): Promise<UserPostRelation | null> {
    const relation = await this.dataServices.userPostRelations.delete({
      user: userId,
      post: postId,
      type: UserPostRelationType.Downvote,
    });

    // if post is not downvoted, return
    if (!relation) return null;

    // remove a downvote if such relation existed
    await this.dataServices.posts.update(
      { _id: postId },
      { $inc: { downvotes: -1 } },
    );

    return relation;
  }

  public async deletePost(postId: string): Promise<Post | null> {
    return await this.dataServices.posts.delete({ _id: postId });
  }

  public async getPostVotingState(postId: string, userId: string) {
    return (
      await this.dataServices.userPostRelations.get({
        post: postId,
        user: userId,
        type: {
          $in: [UserPostRelationType.Downvote, UserPostRelationType.Upvote],
        },
      })
    )?.type;
  }

  public async getPostsVotingState(
    postsIds: string[],
    userId: string,
    limit?: number,
  ) {
    return await this.dataServices.userPostRelations.getAll(
      {
        post: { $in: postsIds },
        user: userId,
        type: {
          $in: [UserPostRelationType.Downvote, UserPostRelationType.Upvote],
        },
      },
      undefined,
      limit,
      0,
    );
  }

  public async setPostsVotingState(dto: PostDto[], userId: string) {
    const postsIds = dto.map((post) => post.id);
    const relations = await this.getPostsVotingState(
      postsIds,
      userId,
      dto.length,
    );

    const relationsMap = relations.reduce((acc, val) => {
      acc.set(val.post.toString(), val.type);
      return acc;
    }, new Map());

    for (const post of dto) {
      const type = relationsMap.get(post.id) ?? null;
      post.votingState = type;
    }
  }
}

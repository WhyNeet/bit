import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { UpdatePostDto } from "src/core/dtos/post.dto";
import { Post } from "src/core/entities/post.entity";
import {
	UserPostRelation,
	UserPostRelationType,
} from "src/core/entities/relation/user-post.entity";
import { RelationFactoryService } from "../relation/relation-factory.service";
import { PostFactoryService } from "./post-factory.service";

@Injectable()
export class PostRepositoryService {
	constructor(
		private dataServices: IDataServices,
		private postFactoryService: PostFactoryService,
		private relationFactoryService: RelationFactoryService,
	) {}

	public async createPost(post: Post): Promise<Post> {
		return await this.dataServices.posts.create(post);
	}

	public async getLatestPosts(
		communities?: string[],
		populate?: string[],
	): Promise<Post[]> {
		return await this.dataServices.posts.getAll(
			communities ? { community: { $in: communities } } : {},
			{ createdAt: "desc" },
			20,
			0,
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

	public async likePost(
		postId: string,
		userId: string,
	): Promise<UserPostRelation | null> {
		if (
			await this.dataServices.userPostRelations.get({
				post: postId,
				user: userId,
				type: UserPostRelationType.Like,
			})
		)
			return null;

		const post = await this.dataServices.posts.update(
			{ _id: postId },
			{ $inc: { likes: 1 } },
		);
		if (!post) return null;

		return await this.dataServices.userPostRelations.create(
			this.relationFactoryService.createUserPostRelation(
				userId,
				postId,
				UserPostRelationType.Like,
			),
		);
	}

	public async removePostLike(
		postId: string,
		userId: string,
	): Promise<UserPostRelation | null> {
		const relation = await this.dataServices.userPostRelations.delete({
			user: userId,
			post: postId,
			type: UserPostRelationType.Like,
		});

		if (!relation) return null;

		await this.dataServices.posts.update(
			{ _id: postId },
			{ $inc: { likes: -1 } },
		);

		return relation;
	}

	public async dislikePost(
		postId: string,
		userId: string,
	): Promise<UserPostRelation | null> {
		if (
			await this.dataServices.userPostRelations.get({
				user: userId,
				post: postId,
				type: UserPostRelationType.Dislike,
			})
		)
			return null;

		await this.dataServices.posts.update(
			{ _id: postId },
			{ $inc: { dislikes: 1 } },
		);

		return await this.dataServices.userPostRelations.create(
			this.relationFactoryService.createUserPostRelation(
				userId,
				postId,
				UserPostRelationType.Dislike,
			),
		);
	}

	public async removePostDislike(
		postId: string,
		userId: string,
	): Promise<UserPostRelation | null> {
		const relation = await this.dataServices.userPostRelations.delete({
			user: userId,
			post: postId,
			type: UserPostRelationType.Dislike,
		});

		if (!relation) return null;

		await this.dataServices.posts.update(
			{ _id: postId },
			{ $inc: { dislikes: -1 } },
		);

		return relation;
	}

	public async deletePost(postId: string): Promise<Post | null> {
		return await this.dataServices.posts.delete({ _id: postId });
	}
}

import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { UpdatePostDto } from "src/core/dtos/post.dto";
import { Post } from "src/core/entities/post.entity";
import { PostFactoryService } from "./post-factory.service";

@Injectable()
export class PostRepositoryService {
	constructor(
		private dataServices: IDataServices,
		private postFactoryService: PostFactoryService,
	) {}

	public async createPost(post: Post): Promise<Post> {
		return await this.dataServices.posts.create(post);
	}

	public async getLatestPosts(populate?: string[]): Promise<Post[]> {
		return await this.dataServices.posts.getAll(
			{},
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

		return await this.dataServices.posts.update(postId, post);
	}

	public async deletePost(postId: string): Promise<Post | null> {
		return await this.dataServices.posts.delete(postId);
	}
}

import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Post } from "src/core/entities/post.entity";

@Injectable()
export class PostRepositoryService {
	constructor(private dataServices: IDataServices) {}

	public async createPost(post: Post): Promise<Post> {
		return await this.dataServices.posts.create(post);
	}

	public async getPostById(
		postId: string,
		include?: string[],
		select?: string,
	): Promise<Post | null> {
		return await this.dataServices.posts.getById(postId, include, select);
	}

	public async updatePost(postId: string, post: Post): Promise<Post | null> {
		return await this.dataServices.posts.update(postId, post);
	}

	public async deletePost(postId: string): Promise<Post | null> {
		return await this.dataServices.posts.delete(postId);
	}
}

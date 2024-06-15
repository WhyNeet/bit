import { Injectable } from "@nestjs/common";
import { PostVectorDataDto } from "common";
import { PostVectorData } from "common";
import { CommunityFactoryService } from "../community/community-factory.service";
import { UserFactoryService } from "../user/user-factory.service";

@Injectable()
export class VectorFactoryService {
	constructor(
		private userFactoryService: UserFactoryService,
		private communityFactoryService: CommunityFactoryService,
	) {}

	public createPostEmbeddingVector(
		id: string,
		title: string,
		vector: number[],
		author: string,
		community: string | undefined,
	): PostVectorData {
		const data = new PostVectorData();

		data.id = id;
		data.title = title;
		data.vector = vector;
		data.author = author;
		data.community = community;

		return data;
	}

	public createPostVectorDataDto(data: PostVectorData): PostVectorDataDto {
		const dto = new PostVectorDataDto();

		dto.id = data.id;
		dto.title = data.title;
		dto.author =
			typeof data.author === "string"
				? data.author
				: this.userFactoryService.createDto(data.author);
		dto.community =
			typeof data.community === "string" ||
			typeof data.community === "undefined"
				? data.community
				: this.communityFactoryService.createDto(data.community);

		return dto;
	}
}

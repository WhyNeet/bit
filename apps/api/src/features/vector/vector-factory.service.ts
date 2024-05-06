import { Injectable } from "@nestjs/common";
import { PostVectorData } from "common";

@Injectable()
export class VectorFactoryService {
	public createPostEmbeddingVector(
		id: string,
		title: string,
		vector: number[],
		author: string,
		community: string,
	): PostVectorData {
		const data = new PostVectorData();

		data.id = id;
		data.title = title;
		data.vector = vector;
		data.author = author;
		data.community = community;

		return data;
	}
}

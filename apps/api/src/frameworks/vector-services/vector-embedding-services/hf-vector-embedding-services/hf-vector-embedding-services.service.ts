import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/hf_transformers";
import { Injectable } from "@nestjs/common";
import { IVectorEmbeddingServices } from "src/core/abstracts/vector-embedding-services.abstract";

@Injectable()
export class HfVectorEmbeddingServices implements IVectorEmbeddingServices {
	private model: HuggingFaceTransformersEmbeddings;

	constructor() {
		this.model = new HuggingFaceTransformersEmbeddings({
			model: "Xenova/all-MiniLM-L6-v2",
		});
	}

	public async createEmbedding(text: string): Promise<number[]> {
		return await this.model.embedQuery(text);
	}
}

import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  IndexType,
  MetricType,
  MilvusClient,
  RowData,
} from "@zilliz/milvus2-sdk-node";
import { IVectorStorageServices } from "src/core/abstracts/vector-storage-services.abstract";
import { PostsSchema } from "./schema/posts.schema";

@Injectable()
export class MilvusVectorServices
  implements IVectorStorageServices, OnApplicationBootstrap
{
  private milvus: MilvusClient;

  constructor(private configService: ConfigService) {
    const address = `${configService.get<string>(
      "db.milvus.host",
    )}:${configService.get<number>("db.milvus.port")}`;
    const username = configService.get<string>("db.milvus.auth.username");
    const password = configService.get<string>("db.milvus.auth.password");

    this.milvus = new MilvusClient({ address, username, password });
  }

  async onApplicationBootstrap() {
    await this.createPostsCollection();

    await this.milvus.loadCollection({
      collection_name: "POSTS_EMBEDDINGS",
    });
  }

  private async createPostsCollection() {
    if (this.configService.get<boolean>("env.dev")) {
      const isCreated = await this.milvus.hasCollection({
        collection_name: "POSTS_EMBEDDINGS",
      });

      if (isCreated.value) return;
    }

    await this.milvus.createCollection({
      collection_name: "POSTS_EMBEDDINGS",
      fields: PostsSchema,
    });
    await this.milvus.createIndex({
      collection_name: "POSTS_EMBEDDINGS",
      field_name: "vector",
      index_type: IndexType.HNSW,
      metric_type: MetricType.COSINE,
      index_name: "post_title_vector_index",
      params: {
        efConstruction: 200,
        M: 100,
      },
    });
  }

  public async insertVectorData<Schema>(
    collection: string,
    data: Schema[],
  ): Promise<void> {
    await this.milvus.insert({
      collection_name: collection,
      fields_data: data as RowData[],
    });
  }

  public async searchVectorData<Schema>(
    collection: string,
    vector: number[],
    limit?: number,
  ): Promise<({ score: number } & Schema)[]> {
    const result = await this.milvus.search({
      collection_name: collection,
      vector,
      limit,
    });

    return result.results as unknown as ({ score: number } & Schema)[];
  }

  public async updateVectorData<Schema>(
    collection: string,
    data: Schema[],
  ): Promise<void> {
    await this.milvus.upsert({
      collection_name: collection,
      fields_data: data as RowData[],
    });
  }

  public async deleteVectorData(
    collection: string,
    ids: string[],
  ): Promise<void> {
    await this.milvus.delete({
      collection_name: collection,
      ids,
    });
  }
}

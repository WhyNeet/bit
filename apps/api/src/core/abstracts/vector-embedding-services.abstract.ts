export abstract class IVectorEmbeddingServices {
  abstract createEmbedding(text: string): Promise<number[]>;
}

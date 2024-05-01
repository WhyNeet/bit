export abstract class IVectorStorageServices {
	abstract insertVectorData<Schema>(
		collection: string,
		data: Schema[],
	): Promise<void>;
	abstract searchVectorData<Schema>(
		collection: string,
		vector: number[],
		limit?: number,
	): Promise<({ score: number } & Schema)[]>;
	abstract updateVectorData<Schema>(
		collection: string,
		data: Schema[],
	): Promise<void>;
	abstract deleteVectorData(collection: string, ids: string[]): Promise<void>;
}

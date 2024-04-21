export abstract class IGenericRepository<Entity> {
	abstract getAll(): Promise<Entity[]>;

	abstract getById(
		id: string,
		populate?: string[],
		select?: string,
	): Promise<Entity | null>;

	abstract get(
		filter: Record<string, string>,
		populate?: string[],
	): Promise<Entity | null>;

	abstract create(entity: Entity): Promise<Entity>;

	abstract update(id: string, entity: Entity): Promise<Entity | null>;

	abstract delete(id: string): Promise<Entity | null>;
}

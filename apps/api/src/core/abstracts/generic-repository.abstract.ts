import { FilterQuery, SortOrder, UpdateQuery } from "mongoose";

export type SortQuery<Entity> = Partial<{ [key in keyof Entity]: SortOrder }>;

export abstract class IGenericRepository<Entity> {
	abstract getAll(
		filter: FilterQuery<Entity>,
		sort: SortQuery<Entity>,
		limit: number,
		skip: number,
		populate?: string[],
	): Promise<Entity[]>;

	abstract getById(
		id: string,
		populate?: string[],
		select?: string,
	): Promise<Entity | null>;

	abstract get(
		filter: FilterQuery<Entity>,
		populate?: string[],
		select?: string,
	): Promise<Entity | null>;

	abstract create(entity: Entity): Promise<Entity>;

	abstract update(
		filter: FilterQuery<Entity>,
		entity: Entity | UpdateQuery<Entity>,
	): Promise<Entity | null>;

	abstract delete(id: string): Promise<Entity | null>;
}

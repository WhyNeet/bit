import type { Model } from "mongoose";
import type { IGenericRepository } from "src/core/abstracts/generic-repository.abstract";

export class MongoGenericRepository<Entity>
	implements IGenericRepository<Entity>
{
	private model: Model<Entity>;

	constructor(model: Model<Entity>) {
		this.model = model;
	}

	public async create(entity: Entity): Promise<Entity> {
		return this.model.create(entity);
	}

	public async getAll(): Promise<Entity[]> {
		return this.model.find().exec();
	}

	public async getById(
		id: string,
		populate?: string[],
		select?: string,
	): Promise<Entity | null> {
		/* @ts-ignore */
		return this.model.findById(id).select(select).populate(populate).exec();
	}

	public async get(
		filter: Record<string, string>,
		populate?: string[],
	): Promise<Entity | null> {
		/* @ts-ignore */
		return this.model.findOne().where(filter).populate(populate).exec();
	}

	public async update(id: string, entity: Entity): Promise<Entity | null> {
		return this.model.findByIdAndUpdate(id, entity).exec();
	}

	public async delete(id: string): Promise<Entity | null> {
		return this.model.findByIdAndDelete(id).exec();
	}
}

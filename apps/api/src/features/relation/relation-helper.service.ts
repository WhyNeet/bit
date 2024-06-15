import { Injectable } from "@nestjs/common";

@Injectable()
export class RelationHelperService {
	// biome-ignore lint/complexity/noBannedTypes: Accepts any object
	public async replaceIdField<T extends Object>(
		data: T[],
		field: keyof T,
		fetchIds: (ids: string[], limit: number) => Promise<unknown[]>,
	) {
		const ids = data.reduce((acc, val) => {
			acc.add((val as unknown)[field]);
			return acc;
		}, new Set()) as Set<string>;
		const entities = await fetchIds([...ids], data.length);
		const entitiesMap = entities.reduce(
			(acc: Map<string, (typeof entities)[0]>, val) => {
				acc.set(val["id"], val);
				return acc;
			},
			new Map(),
		) as Map<string, (typeof entities)[0]>;

		// biome-ignore lint/suspicious/noExplicitAny: TS
		for (const obj of data)
			obj[field] = entitiesMap.get(obj[field] as string) as any;
	}
}

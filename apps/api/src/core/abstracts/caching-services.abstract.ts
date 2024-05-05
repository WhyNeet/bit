export abstract class ICachingServices {
	public abstract set<V>(key: string, value: V): Promise<undefined>;
	public abstract get<V>(key: string, parse?: boolean): Promise<V | null>;
	public abstract delete(key: string): Promise<undefined>;
}

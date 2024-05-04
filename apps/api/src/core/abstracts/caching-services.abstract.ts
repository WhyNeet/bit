export abstract class ICachingServices {
	public abstract set(key: string, value: string): Promise<undefined>;
	public abstract get<V>(key: string): Promise<V>;
	public abstract delete(key: string): Promise<undefined>;
}

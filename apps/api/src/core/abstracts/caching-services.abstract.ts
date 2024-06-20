export abstract class ICachingServices {
  public abstract set<V>(key: string, value: V): Promise<undefined>;
  public abstract get<V>(key: string, parse?: boolean): Promise<V | null>;
  public abstract delete(key: string): Promise<undefined>;

  public abstract sadd<V>(key: string, value: V | V[]): Promise<undefined>;
  public abstract shas<V>(key: string, value: V): Promise<boolean>;
  public abstract sget<V>(key: string, parse?: boolean): Promise<V[] | null>;
  public abstract srem<V>(key: string, value: V): Promise<undefined>;
}

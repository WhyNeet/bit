import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RedisClientType, createClient } from "redis";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";

@Injectable()
export class RedisCachingServices
  implements ICachingServices, OnApplicationBootstrap
{
  private redis: RedisClientType;

  constructor(private configService: ConfigService) {
    this.redis = createClient({
      url: `${
        configService.get<boolean>("env.dev") ? "redis" : "rediss"
      }://${configService.get<string>(
        "db.redis.host",
      )}:${configService.get<number>("db.redis.port")}`,
      username: configService.get<string>("db.redis.auth.username"),
      password: configService.get<string>("db.redis.auth.password"),
    });
  }

  public async onApplicationBootstrap() {
    await this.redis.connect();
  }

  public async get<V>(key: string, parse?: boolean): Promise<V | null> {
    const value = (await this.redis.get(key)) as string | null;

    return parse && value ? JSON.parse(value) : value;
  }

  public async set<V>(key: string, value: V): Promise<undefined> {
    const cachedValue = this.getCachedValue(value);

    await this.redis.set(key, cachedValue);
  }

  public async delete(key: string): Promise<undefined> {
    await this.redis.del(key);
  }

  public async sadd<V>(key: string, value: V | V[]): Promise<undefined> {
    const cachedValue = (value as V[]).map
      ? (value as V[]).map(this.getCachedValue)
      : this.getCachedValue(value);

    await this.redis.sAdd(key, cachedValue);
  }

  public async sget<V>(key: string, parse?: boolean): Promise<V[] | null> {
    const result = await this.redis.sMembers(key);

    return result && parse ? result.map((val) => JSON.parse(val)) : result;
  }

  public async shas<V>(key: string, value: V): Promise<boolean> {
    const cachedValue = this.getCachedValue(value);

    return await this.redis.sIsMember(key, cachedValue);
  }

  public async srem<V>(key: string, value: V): Promise<undefined> {
    const cachedValue = this.getCachedValue(value);

    await this.redis.sRem(key, cachedValue);
  }

  private getCachedValue<V>(value: V): string {
    return typeof value === "string" ? value : JSON.stringify(value);
  }
}

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

	public async get<V>(key: string): Promise<V | null> {
		return (await this.redis.get(key)) as V | null;
	}

	public async set(key: string, value: string): Promise<undefined> {
		await this.redis.set(key, value);
	}

	public async delete(key: string): Promise<undefined> {
		await this.redis.del(key);
	}
}

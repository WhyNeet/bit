import { Module } from "@nestjs/common";
import { RedisCachingServicesModule } from "./redis/redis-caching-services.module";

@Module({
  imports: [RedisCachingServicesModule],
  providers: [],
  exports: [RedisCachingServicesModule],
})
export class CachingServicesModule {}

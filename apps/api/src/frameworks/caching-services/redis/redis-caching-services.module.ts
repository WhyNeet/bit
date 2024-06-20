import { Module } from "@nestjs/common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { RedisCachingServices } from "./redis-caching-services.service";

@Module({
  imports: [],
  providers: [
    {
      provide: ICachingServices,
      useClass: RedisCachingServices,
    },
  ],
  exports: [ICachingServices],
})
export class RedisCachingServicesModule {}

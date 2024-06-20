import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { DataServicesModule } from "src/frameworks/data-services/data-services.module";
import { TokenEncryptionService } from "./token-encryption.service";
import { TokenFactoryService } from "./token-factory.service";
import { TokenRefreshMiddlware } from "./token-refresh.middleware";
import { TokenRepositoryService } from "./token-repository.service";

@Module({
  imports: [
    JwtModule.register({ signOptions: { algorithm: "HS256" } }),
    DataServicesModule,
  ],
  providers: [
    TokenFactoryService,
    TokenRepositoryService,
    TokenEncryptionService,
  ],
  exports: [
    TokenFactoryService,
    JwtModule,
    TokenRepositoryService,
    TokenEncryptionService,
  ],
})
export class TokenFeatureModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenRefreshMiddlware)
      .exclude({ path: "auth/(.*)", method: RequestMethod.ALL })
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}

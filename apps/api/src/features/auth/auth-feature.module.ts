import { Module } from "@nestjs/common";
import { UserFeatureModule } from "../user/user-feature.module";
import { AuthService } from "./auth.service";

@Module({
  imports: [UserFeatureModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthFeatureModule {}

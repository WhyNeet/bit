import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/core/dtos/user.dto";
import { AuthService } from "src/features/auth/auth.service";
import { UserFactoryService } from "src/features/user/user-factory.service";

@Controller("/auth")
export class AuthController {
	constructor(
		private authService: AuthService,
		private userFactoryService: UserFactoryService,
	) {}

	@Post("/register")
	public async register(@Body() createUserDto: CreateUserDto) {
		const user = await this.authService.registerUser(createUserDto);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}
}

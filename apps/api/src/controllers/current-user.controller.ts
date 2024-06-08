import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiResponse, CommunityDto, User, UserDto } from "common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import { IStorageServices } from "src/core/abstracts/storage-services.abstract";
import { CommunityFactoryService } from "src/features/community/community-factory.service";
import { CommunityRepositoryService } from "src/features/community/community-repository.service";
import { UserFactoryService } from "src/features/user/user-factory.service";
import { UserRepositoryService } from "src/features/user/user-repository.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/users/me")
export class CurrentUserController {
	constructor(
		private userRepositoryService: UserRepositoryService,
		private userFactoryService: UserFactoryService,
		private cachingServices: ICachingServices,
		private storageServices: IStorageServices,
		private communityFactoryService: CommunityFactoryService,
		private communityRepositoryService: CommunityRepositoryService,
	) {}

	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	@Get("")
	public async getCurrentUser(
		@Token() token: JwtPayload,
	): ApiResponse<UserDto> {
		const cachedUser = await this.cachingServices.get<User>(
			`user:${token.sub}`,
			true,
		);

		if (cachedUser)
			return {
				data: this.userFactoryService.createDto(cachedUser),
			};

		const user = await this.userRepositoryService.getUserById(token.sub);

		await this.cachingServices.set(`user:${token.sub}`, user);

		return {
			data: this.userFactoryService.createDto(user),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Get("/communities")
	public async getCurrentUserCommunities(
		@Token() payload: JwtPayload,
	): ApiResponse<CommunityDto[]> {
		const cachedCommunities = await this.cachingServices.sget<string>(
			`userCommunities:${payload.sub}`,
		);

		const communitiesIds =
			cachedCommunities.length > 0
				? cachedCommunities
				: (
						await this.communityRepositoryService.getUserCommunities(
							payload.sub,
						)
					).map((c) => c.community.toString());

		const communities =
			await this.communityRepositoryService.getCommunities(communitiesIds);

		return {
			data: communities.map(
				this.communityFactoryService.createDto.bind(
					this.communityFactoryService,
				),
			),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor("file"))
	@Post("/avatar")
	public async setUserAvatar(
		@UploadedFile() file: Express.Multer.File,
		@Token() payload: JwtPayload,
	): ApiResponse<null> {
		const fileName = `avatar/${payload.sub}`;

		await this.storageServices.putFile(fileName, file.buffer);

		return {
			data: null,
		};
	}
}

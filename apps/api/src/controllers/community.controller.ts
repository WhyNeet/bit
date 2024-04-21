import {
	Body,
	Controller,
	ForbiddenException,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	ParseBoolPipe,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { CommunityDto, CreateCommunityDto } from "src/core/dtos/community.dto";
import { ApiResponse } from "src/core/types/response/response.interface";
import { CommunityFactoryService } from "src/features/community/community-factory.service";
import { CommunityRepositoryService } from "src/features/community/community-repository.service";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/communities")
export class CommunityController {
	constructor(
		private communityRepositoryService: CommunityRepositoryService,
		private communityFactoryService: CommunityFactoryService,
	) {}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Post("/create")
	public async createCommunity(
		@Body() createCommunityDto: CreateCommunityDto,
		@Token() token: JwtPayload,
	): ApiResponse<CommunityDto> {
		const community = await this.communityRepositoryService.createCommunity(
			createCommunityDto,
			token.sub,
		);

		return {
			data: this.communityFactoryService.createDto(community),
		};
	}

	@HttpCode(HttpStatus.OK)
	@Get("/:communityId")
	public async getCommunity(
		@Param("communityId") communityId: string,
		@Query("includeAuthor", new ParseBoolPipe({ optional: true }))
		includeAuthor?: boolean,
	): ApiResponse<CommunityDto> {
		const community = await this.communityRepositoryService.getCommunityById(
			communityId,
			includeAuthor,
		);

		return {
			data: this.communityFactoryService.createDto(community),
		};
	}

	@HttpCode(HttpStatus.OK)
	@UseGuards(JwtAuthGuard)
	@Post("/:communityId/delete")
	public async deleteCommunity(
		@Param("communityId") communityId: string,
		@Token() token: JwtPayload,
	): ApiResponse<void> {
		const community = await this.communityRepositoryService.getCommunityById(
			communityId,
			false,
			"author",
		);

		if (community.author.toString() !== token.sub)
			throw new ForbiddenException(
				"You are not authorized to perform this action.",
			);

		await this.communityRepositoryService.deleteCommunity(communityId);

		return {
			data: null,
		};
	}
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiResponse, CommunityDto } from "common";
import { ICachingServices } from "src/core/abstracts/caching-services.abstract";
import {
  CreateCommunityDto,
  UpdateCommunityDto,
} from "src/core/dtos/community.dto";
import { CommunityFactoryService } from "src/features/community/community-factory.service";
import { CommunityRepositoryService } from "src/features/community/community-repository.service";
import { IncludeFields } from "src/features/decorators/includeFields.decorator";
import { CommunityException } from "src/features/exception-handling/exceptions/community.exception";
import { ParseObjectIdPipe } from "src/features/pipes/parse-objectid.pipe";
import { Token } from "src/frameworks/auth/decorators/token.decorator";
import { JwtAuthGuard } from "src/frameworks/auth/guards/jwt.guard";
import { JwtPayload } from "src/frameworks/auth/jwt/types/payload.interface";

@Controller("/communities")
export class CommunityController {
  constructor(
    private communityRepositoryService: CommunityRepositoryService,
    private communityFactoryService: CommunityFactoryService,
    private cachingServices: ICachingServices,
  ) {}

  @HttpCode(HttpStatus.CREATED)
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
    @Param("communityId", ParseObjectIdPipe.stringified()) communityId: string,
    @IncludeFields() includeFields: string[],
  ): ApiResponse<CommunityDto> {
    const community = await this.communityRepositoryService.getCommunityById(
      communityId,
      includeFields,
    );

    if (!community) throw new CommunityException.CommunityDoesNotExist();

    return {
      data: this.communityFactoryService.createDto(community),
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post("/:communityId/join")
  public async joinCommunity(
    @Param("communityId", ParseObjectIdPipe.stringified()) communityId: string,
    @Token() payload: JwtPayload,
  ): ApiResponse<null> {
    const community = await this.communityRepositoryService.getCommunityById(
      communityId,
      [],
      "_id",
    );
    if (!community) throw new CommunityException.CommunityDoesNotExist();

    await this.communityRepositoryService.addMember(communityId, payload.sub);
    await this.cachingServices.sadd(
      `userCommunities:${payload.sub}`,
      communityId,
    );

    return {
      data: null,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Post("/:communityId/leave")
  public async leaveCommunity(
    @Param("communityId", ParseObjectIdPipe.stringified()) communityId: string,
    @Token() payload: JwtPayload,
  ): ApiResponse<null> {
    const community = await this.communityRepositoryService.getCommunityById(
      communityId,
      [],
      "_id",
    );
    if (!community) throw new CommunityException.CommunityDoesNotExist();

    await this.communityRepositoryService.removeMember(
      communityId,
      payload.sub,
    );
    await this.cachingServices.srem(
      `userCommunities:${payload.sub}`,
      communityId,
    );

    return {
      data: null,
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Patch("/:communityId")
  public async updateCommunity(
    @Param("communityId", ParseObjectIdPipe.stringified()) communityId: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
    @Token() payload: JwtPayload,
  ): ApiResponse<CommunityDto> {
    const oldCommunity =
      await this.communityRepositoryService.getCommunityById(communityId);

    if (!oldCommunity) throw new CommunityException.CommunityDoesNotExist();
    if (oldCommunity.owner.toString() !== payload.sub)
      throw new CommunityException.CommunityCannotBeModified();

    const community = await this.communityRepositoryService.updateCommunity(
      communityId,
      updateCommunityDto,
    );

    if (!community) throw new CommunityException.CommunityDoesNotExist();

    const updatedCommunity = this.communityFactoryService.updateCommunity(
      community,
      updateCommunityDto,
    );

    return {
      data: this.communityFactoryService.createDto(updatedCommunity),
    };
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Delete("/:communityId")
  public async deleteCommunity(
    @Param("communityId", ParseObjectIdPipe.stringified()) communityId: string,
    @Token() token: JwtPayload,
  ): ApiResponse<void> {
    const community = await this.communityRepositoryService.getCommunityById(
      communityId,
      [],
      "owner",
    );

    if (!community) throw new CommunityException.CommunityDoesNotExist();

    if (community.owner.toString() !== token.sub)
      throw new CommunityException.CommunityCannotBeModified();

    await this.communityRepositoryService.deleteCommunity(communityId);

    return {
      data: null,
    };
  }
}

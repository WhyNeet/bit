import { Injectable } from "@nestjs/common";
import { Schema } from "mongoose";
import { CommunityDto, CreateCommunityDto } from "src/core/dtos/community.dto";
import { Community } from "src/core/entities/community.entity";
import { UserFactoryService } from "../user/user-factory.service";

@Injectable()
export class CommunityFactoryService {
	constructor(private userFactoryService: UserFactoryService) {}

	public createFromDto(
		createCommunityDto: CreateCommunityDto,
		ownerId: string,
	): Community {
		const community = new Community();

		community.name = createCommunityDto.name;
		community.description = createCommunityDto.description;
		community.owner = ownerId;

		return community;
	}

	public createDto(community: Community): CommunityDto {
		const dto = new CommunityDto();

		dto.id = community.id;
		dto.name = community.name;
		dto.description = community.description;
		dto.owner =
			typeof community.owner === "object"
				? community.owner.toString()
				: typeof community.owner === "string"
					? community.owner
					: this.userFactoryService.createDto(community.owner);

		dto.createdAt = community.createdAt;
		dto.updatedAt = community.updatedAt;

		return dto;
	}
}

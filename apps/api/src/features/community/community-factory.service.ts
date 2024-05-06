import { Injectable } from "@nestjs/common";
import { Community, CommunityDto } from "common";
import {
	CreateCommunityDto,
	UpdateCommunityDto,
} from "src/core/dtos/community.dto";
import { RelationDtoHelper } from "../helpers/relation-dto.helper";
import { UserFactoryService } from "../user/user-factory.service";

@Injectable()
export class CommunityFactoryService {
	constructor(private userFactoryService: UserFactoryService) {}

	public createFromCreateDto(
		createCommunityDto: CreateCommunityDto,
		ownerId: string,
	): Community {
		const community = new Community();

		community.name = createCommunityDto.name;
		community.description = createCommunityDto.description;
		community.owner = ownerId;
		community.members = 0;

		return community;
	}

	public createFromUpdateDto(
		updateCommunityDto: UpdateCommunityDto,
	): Community {
		const community = new Community();

		community.name = updateCommunityDto.name;
		community.description = updateCommunityDto.description;

		return community;
	}

	public createDto(community: Community): CommunityDto {
		const dto = new CommunityDto();

		dto.id = community.id;
		dto.name = community.name;
		dto.description = community.description;
		dto.owner = RelationDtoHelper.createFromRelation(
			community.owner,
			this.userFactoryService.createDto.bind(this.userFactoryService),
		);
		dto.members = community.members;
		dto.createdAt = community.createdAt;
		dto.updatedAt = community.updatedAt;

		return dto;
	}

	public updateCommunity(
		community: Community,
		updateCommunityDto: UpdateCommunityDto,
	): Community {
		community.name = updateCommunityDto.name;
		community.description = updateCommunityDto.description;

		return community;
	}
}

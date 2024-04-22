import { Injectable } from "@nestjs/common";
import { ObjectId, Types } from "mongoose";
import { CommunityDto, CreateCommunityDto } from "src/core/dtos/community.dto";
import { Community } from "src/core/entities/community.entity";
import { User } from "src/core/entities/user.entity";
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
		community.owner = ownerId as unknown as ObjectId;

		return community;
	}

	public createDto(community: Community): CommunityDto {
		const dto = new CommunityDto();

		dto.id = community.id;
		dto.name = community.name;
		dto.description = community.description;
		dto.owner = this.userFactoryService.createDtoOrString(
			community.owner as User | Types.ObjectId,
		);

		dto.createdAt = community.createdAt;
		dto.updatedAt = community.updatedAt;

		return dto;
	}
}

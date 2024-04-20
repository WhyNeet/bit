import { Injectable } from "@nestjs/common";
import { CommunityDto, CreateCommunityDto } from "src/core/dtos/community.dto";
import { Community } from "src/core/entities/community.entity";
@Injectable()
export class CommunityFactoryService {
	public createFromDto(
		createCommunityDto: CreateCommunityDto,
		authorId: string,
	): Community {
		const community = new Community();

		community.name = createCommunityDto.name;
		community.description = createCommunityDto.description;
		community.author = authorId;

		return community;
	}

	public createDto(community: Community): CommunityDto {
		const dto = new CommunityDto();

		dto.id = community.id;
		dto.name = community.name;
		dto.description = community.description;
		dto.author = community.author;
		dto.createdAt = community.createdAt;
		dto.updatedAt = community.updatedAt;

		return dto;
	}
}

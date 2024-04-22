import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { CreateCommunityDto } from "src/core/dtos/community.dto";
import { Community } from "src/core/entities/community.entity";
import { CommunityException } from "../exception-handling/exceptions/community.exception";
import { CommunityFactoryService } from "./community-factory.service";

@Injectable()
export class CommunityRepositoryService {
	constructor(
		private dataServices: IDataServices,
		private communityFactoryService: CommunityFactoryService,
	) {}

	public async getCommunityById(
		id: string,
		includeAuthor?: boolean,
		select?: string,
	): Promise<Community | null> {
		return await this.dataServices.communities.getById(
			id,
			includeAuthor ? ["author"] : undefined,
			select,
		);
	}

	public async createCommunity(
		createCommunityDto: CreateCommunityDto,
		authorId: string,
	): Promise<Community> {
		const community = this.communityFactoryService.createFromDto(
			createCommunityDto,
			authorId,
		);

		try {
			return await this.dataServices.communities.create(community);
		} catch (e) {
			if (e.code && e.code === 11000)
				throw new CommunityException.CommunityAlreadyExists();
			throw e;
		}
	}

	public async updateCommunity(community: Community): Promise<Community> {
		return await this.dataServices.communities.update(community.id, community);
	}

	public async deleteCommunity(id: string): Promise<Community | null> {
		return await this.dataServices.communities.delete(id);
	}
}

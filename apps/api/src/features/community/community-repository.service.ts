import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import {
	CreateCommunityDto,
	UpdateCommunityDto,
} from "src/core/dtos/community.dto";
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
		include?: string[],
		select?: string,
	): Promise<Community | null> {
		return await this.dataServices.communities.getById(id, include, select);
	}

	public async createCommunity(
		createCommunityDto: CreateCommunityDto,
		ownerId: string,
	): Promise<Community> {
		const community = this.communityFactoryService.createFromCreateDto(
			createCommunityDto,
			ownerId,
		);

		try {
			return await this.dataServices.communities.create(community);
		} catch (e) {
			if (e.code && e.code === 11000)
				throw new CommunityException.CommunityAlreadyExists();
			throw e;
		}
	}

	public async updateCommunity(
		id: string,
		updateCommunityDto: UpdateCommunityDto,
	): Promise<Community> {
		const community =
			this.communityFactoryService.createFromUpdateDto(updateCommunityDto);

		return await this.dataServices.communities.update({ _id: id }, community);
	}

	public async addMember(
		communityId: string,
		memberId: string,
	): Promise<Community> {
		return await this.dataServices.communities.update(
			{ _id: communityId },
			{ $push: { members: memberId } },
		);
	}

	public async deleteCommunity(id: string): Promise<Community | null> {
		return await this.dataServices.communities.delete(id);
	}
}

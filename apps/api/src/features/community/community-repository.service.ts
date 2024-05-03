import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import {
	CreateCommunityDto,
	UpdateCommunityDto,
} from "src/core/dtos/community.dto";
import { Community } from "src/core/entities/community.entity";
import {
	UserCommunityRelation,
	UserCommunityRelationType,
} from "src/core/entities/relation/user-community.entity";
import { CommunityException } from "../exception-handling/exceptions/community.exception";
import { RelationFactoryService } from "../relation/relation-factory.service";
import { CommunityFactoryService } from "./community-factory.service";

@Injectable()
export class CommunityRepositoryService {
	constructor(
		private dataServices: IDataServices,
		private communityFactoryService: CommunityFactoryService,
		private relationFactoryService: RelationFactoryService,
	) {}

	public async getUserCommunities(
		userId: string,
		include?: string[],
		limit?: number,
	): Promise<UserCommunityRelation[]> {
		return await this.dataServices.userCommunityRelations.getAll(
			{ user: userId, type: UserCommunityRelationType.Member },
			{},
			limit ?? 100,
			0,
			include,
		);
	}

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
	): Promise<UserCommunityRelation | null> {
		if (
			await this.dataServices.userCommunityRelations.get({
				community: communityId,
				user: memberId,
				type: UserCommunityRelationType.Member,
			})
		)
			return null;

		const relation = this.relationFactoryService.createUserCommunityRelation(
			memberId,
			communityId,
			UserCommunityRelationType.Member,
		);

		await this.dataServices.communities.update(
			{ _id: communityId },
			{ $inc: { members: 1 } },
		);
		return await this.dataServices.userCommunityRelations.create(relation);
	}

	public async removeMember(
		communityId: string,
		memberId: string,
	): Promise<UserCommunityRelation> {
		await this.dataServices.communities.update(
			{ _id: communityId },
			{ $inc: { members: -1 } },
		);

		return await this.dataServices.userCommunityRelations.delete({
			user: memberId,
			community: communityId,
			type: UserCommunityRelationType.Member,
		});
	}

	public async deleteCommunity(id: string): Promise<Community | null> {
		return await this.dataServices.communities.delete({ _id: id });
	}
}

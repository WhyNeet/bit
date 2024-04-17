import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Token } from "src/core/entities/token.entity";

@Injectable()
export class TokenRepositoryService {
	constructor(private dataServices: IDataServices) {}

	public async createToken(token: Token): Promise<Token> {
		return this.dataServices.tokens.create(token);
	}

	public async getTokenById(id: string): Promise<Token | null> {
		return this.dataServices.tokens.getById(id);
	}

	public async deleteToken(id: string): Promise<Token | null> {
		return this.dataServices.tokens.delete(id);
	}
}

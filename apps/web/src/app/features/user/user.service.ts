import { Inject, Injectable } from "@angular/core";
import { API_BASE_URL } from "../../misc/tokens";

@Injectable({
	providedIn: "root",
})
export class UserService {
	constructor(@Inject(API_BASE_URL) private apiBaseUrl: string) {}

	public getCurrentUserAvatarUrl(): string {
		return `${this.apiBaseUrl}/media/avatar`;
	}
}

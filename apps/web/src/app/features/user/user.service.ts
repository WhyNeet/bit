import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class UserService {
	public getCurrentUserAvatarUrl(): string {
		return `${environment.API_BASE_URL}/media/avatar`;
	}
}

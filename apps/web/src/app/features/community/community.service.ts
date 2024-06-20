import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommunityService {
  public getCommunityIconUrl(id: string): string {
    return `${environment.API_BASE_URL}/media/community/${id}/icon`;
  }
}

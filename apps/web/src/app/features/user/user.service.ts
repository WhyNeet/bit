import { isPlatformServer } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Store } from "@ngrx/store";
import { CommunityDto, UserDto } from "common";
import { Observable, map } from "rxjs";
import { environment } from "../../../environments/environment";
import { userCommunitiesFetched } from "../../state/user/actions";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
    // biome-ignore lint/complexity/noBannedTypes: Angular
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  public getCurrentUserCommunities() {
    if (isPlatformServer(this.platformId)) return;

    this.httpClient
      .get(`${environment.API_BASE_URL}/users/me/communities`, {
        withCredentials: true,
      })
      .pipe(map((res) => (res as { data: CommunityDto[] }).data))
      .subscribe((communities) =>
        this.store.dispatch(userCommunitiesFetched({ communities })),
      );
  }

  public getCurrentUserAvatarUrl(): string {
    return `${environment.API_BASE_URL}/media/avatar`;
  }

  public getUserAvatarUrl(userId: string): string {
    return `${environment.API_BASE_URL}/media/avatar/${userId}`;
  }

  public getUserById(userId: string): Observable<UserDto> {
    return this.httpClient
      .get(`${environment.API_BASE_URL}/users/user/${userId}`, {
        withCredentials: true,
      })
      .pipe(map((data) => (data as { data: UserDto }).data));
  }
}

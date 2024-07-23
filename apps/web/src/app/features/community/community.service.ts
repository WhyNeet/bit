import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommunityDto } from "common";
import { Observable, catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommunityService {
  constructor(private httpClient: HttpClient) {}

  public getCommunityIconUrl(id: string): string {
    return `${environment.API_BASE_URL}/media/community/${id}/icon`;
  }

  public getCommunity(
    id: string,
    include: string[] = [],
  ): Observable<CommunityDto> {
    return this.httpClient
      .get(
        `${environment.API_BASE_URL}/community/${id}?include=${include.join(
          ",",
        )}`,
      )
      .pipe(
        map((res) => (res as { data: CommunityDto }).data),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
  }
}

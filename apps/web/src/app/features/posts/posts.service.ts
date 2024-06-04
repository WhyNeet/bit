import { isPlatformServer } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Store } from "@ngrx/store";
import { PostDto } from "common";
import { catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { latestPostsFetched } from "../../state/posts/actions";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	constructor(
		private store: Store,
		private httpClient: HttpClient,
		// biome-ignore lint/complexity/noBannedTypes: Angular
		@Inject(PLATFORM_ID) private platformId: Object,
	) {}

	public getLatestPosts(include?: string[]) {
		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/latest?include=${
					include?.join(",") ?? ""
				}`,
			)
			.pipe(
				map((res) => (res as { data: PostDto[] }).data),
				catchError((err) => {
					return throwError(() => err);
				}),
			)
			.subscribe((posts) => this.store.dispatch(latestPostsFetched({ posts })));
	}

	public getHomePosts(include?: string[]) {
		// home posts require user cookies
		// and cannot be fetched on the server
		if (isPlatformServer(this.platformId)) return;

		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/home?include=${
					include?.join(",") ?? ""
				}`,
				{
					withCredentials: true,
				},
			)
			.pipe(
				map((res) => (res as { data: PostDto[] }).data),
				catchError((err) => {
					return throwError(() => err);
				}),
			)
			.subscribe((posts) => this.store.dispatch(latestPostsFetched({ posts })));
	}
}

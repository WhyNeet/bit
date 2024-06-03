import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { State, Store } from "@ngrx/store";
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
	) {}

	public getLatestPosts(include?: string[]) {
		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/latest?include=${include?.join(
					",",
				)}`,
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
		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/home?include=${include?.join(",")}`,
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

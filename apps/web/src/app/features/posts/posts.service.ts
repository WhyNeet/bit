import { isPlatformServer } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Store } from "@ngrx/store";
import { PostDto } from "common";
import { catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import {
	homePostsFetched,
	latestPostsFetched,
	postsFetching,
} from "../../state/posts/actions";

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

	public getLatestPosts(page: number, perPage: number, include?: string[]) {
		this.store.dispatch(postsFetching({ section: "latest" }));

		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/latest?include=${
					include?.join(",") ?? ""
				}&page=${page}&perPage=${perPage}`,
			)
			.pipe(
				map((res) => (res as { data: PostDto[] }).data),
				catchError((err) => {
					return throwError(() => err);
				}),
			)
			.subscribe((posts) => this.store.dispatch(latestPostsFetched({ posts })));
	}

	public getHomePosts(page: number, perPage: number, include?: string[]) {
		// home posts require user cookies
		// and cannot be fetched on the server
		if (isPlatformServer(this.platformId)) return;

		this.store.dispatch(postsFetching({ section: "home" }));

		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/home?include=${
					include?.join(",") ?? ""
				}&page=${page}&perPage=${perPage}`,
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
			.subscribe((posts) => this.store.dispatch(homePostsFetched({ posts })));
	}

	public createPost(
		title: string,
		content: string,
		images: Blob[],
		files: Blob[],
		community?: string,
	) {
		const post = new FormData();

		post.set("title", title);
		post.set("content", content);
		if (community) post.set("community", community);
		for (const image of images) post.append("images", image);
		for (const file of files) post.append("files", file);

		this.httpClient
			.post(`${environment.API_BASE_URL}/posts/create`, post, {
				withCredentials: true,
			})
			.subscribe(console.log);
	}
}

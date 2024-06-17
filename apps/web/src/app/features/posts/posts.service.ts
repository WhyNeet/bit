import { isPlatformServer } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { PostDto, UserDto } from "common";
import { catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import {
	homePostsFetched,
	latestPostsFetched,
	postCreated,
	postDislikeRemoved,
	postDisliked,
	postLikeRemoved,
	postLiked,
	postsFetching,
} from "../../state/posts/actions";
import { selectUser } from "../../state/user/selectors";

@Injectable({
	providedIn: "root",
})
export class PostsService {
	private user!: UserDto | null;

	constructor(
		private store: Store,
		private httpClient: HttpClient,
		// biome-ignore lint/complexity/noBannedTypes: Angular
		@Inject(PLATFORM_ID) private platformId: Object,
	) {
		this.store.pipe(select(selectUser)).subscribe((user) => {
			this.user = user;
		});
	}

	public getLatestPosts(page: number, perPage: number, include?: string[]) {
		if (isPlatformServer(this.platformId)) return;

		this.store.dispatch(postsFetching({ section: "latest" }));

		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/latest?include=${
					include?.join(",") ?? ""
				}&page=${page}&perPage=${perPage}`,
				{ withCredentials: true },
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
			.pipe(
				map((res) => (res as { data: PostDto }).data),
				catchError((err) => {
					return throwError(() => err);
				}),
			)
			.subscribe((post) =>
				this.store.dispatch(
					postCreated({
						post: {
							...post,
							author: this.user ?? undefined,
						},
					}),
				),
			);
	}

	public getPost(id: string, include?: string[]) {
		return this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/${id}?include=${
					include?.join(",") ?? ""
				}`,
			)
			.pipe(map((res) => (res as { data: PostDto }).data));
	}

	public likePost(id: string) {
		this.httpClient
			.post(`${environment.API_BASE_URL}/posts/${id}/upvote`, undefined, {
				withCredentials: true,
			})
			.subscribe(() => this.store.dispatch(postLiked({ id })));
	}

	public removePostLike(id: string) {
		this.httpClient
			.delete(`${environment.API_BASE_URL}/posts/${id}/upvote`, {
				withCredentials: true,
			})
			.subscribe(() => this.store.dispatch(postLikeRemoved({ id })));
	}

	public dislikePost(id: string) {
		this.httpClient
			.post(`${environment.API_BASE_URL}/posts/${id}/downvote`, undefined, {
				withCredentials: true,
			})
			.subscribe(() => this.store.dispatch(postDisliked({ id })));
	}

	public removePostDislike(id: string) {
		this.httpClient
			.delete(`${environment.API_BASE_URL}/posts/${id}/downvote`, {
				withCredentials: true,
			})
			.subscribe(() => this.store.dispatch(postDislikeRemoved({ id })));
	}
}

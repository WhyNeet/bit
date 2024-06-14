import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { PostVectorData } from "common";
import { catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { searchFinished } from "../../state/search/actions";

@Injectable({ providedIn: "root" })
export class SearchService {
	constructor(
		private httpClient: HttpClient,
		private store: Store,
	) {}

	public search(query: string) {
		this.httpClient
			.get(`${environment.API_BASE_URL}/posts/search?query=${query}`)
			.pipe(
				map((data) => (data as { data: PostVectorData[] }).data),
				catchError((err) => {
					return throwError(() => err);
				}),
			)
			.subscribe((results) =>
				this.store.dispatch(searchFinished({ posts: results })),
			);
	}
}

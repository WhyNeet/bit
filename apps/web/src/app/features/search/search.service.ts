import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { PostVectorData } from "common";
import { catchError, map, tap, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { searchFinished, searchLoading } from "../../state/search/actions";
import { LocalStorageService } from "../storage/local-storage.service";

@Injectable({ providedIn: "root" })
export class SearchService {
	constructor(
		private httpClient: HttpClient,
		private store: Store,
		private localStorageService: LocalStorageService,
	) {}

	public search(query: string, include?: string[]) {
		this.store.dispatch(searchLoading());

		this.httpClient
			.get(
				`${environment.API_BASE_URL}/posts/search?query=${query}&include=${
					include?.join(",") ?? ""
				}`,
			)
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

	public saveToHistory(query: string) {
		const storedHistory = this.localStorageService.getItem("searchHistory");
		const history: string[] = storedHistory ? JSON.parse(storedHistory) : [];

		this.localStorageService.setItem("searchHistory", [query, ...history]);
	}
}

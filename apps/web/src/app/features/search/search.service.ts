import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { PostVectorData } from "common";
import {
	Observable,
	catchError,
	filter,
	map,
	startWith,
	tap,
	throwError,
} from "rxjs";
import { environment } from "../../../environments/environment";
import { searchFinished, searchLoading } from "../../state/search/actions";
import { LocalStorageService } from "../storage/local-storage.service";

@Injectable({ providedIn: "root" })
export class SearchService {
	private historyReplaySubject: Observable<string[] | null> =
		this.localStorageService.getChanges().pipe(
			filter((change) => change.key === "searchHistory"),
			map((change) => change.value as string[]),
			startWith(this.getSavedHistory()),
		);

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

	private getSavedHistory() {
		const storedHistory = this.localStorageService.getItem("searchHistory");

		return storedHistory ? JSON.parse(storedHistory) : null;
	}

	public getHistory() {
		return this.historyReplaySubject;
	}
}

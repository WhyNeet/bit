import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideSearch, lucideX, lucideXCircle } from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { PostVectorData } from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
	BehaviorSubject,
	Observable,
	Subscription,
	debounceTime,
	filter,
	map,
	switchMap,
	takeWhile,
} from "rxjs";
import { SearchService } from "../../features/search/search.service";
import { UserService } from "../../features/user/user.service";
import {
	selectIsSearchLoading,
	selectSearchPosts,
} from "../../state/search/selectors";
import { AvatarComponent } from "../ui/avatar/avatar.component";
import { DialogContent } from "../ui/dialog-container/dialog-content.component";
import { ProgressSpinnerComponent } from "../ui/progress-spinner/progress-spinner.component";

dayjs.extend(relativeTime);

@Component({
	selector: "app-search-panel",
	standalone: true,
	imports: [
		NgIcon,
		DialogContent,
		FormsModule,
		CommonModule,
		ProgressSpinnerComponent,
		AvatarComponent,
	],
	providers: [],
	viewProviders: [provideIcons({ lucideSearch, lucideX, lucideXCircle })],
	templateUrl: "./search-panel.component.html",
	styleUrl: "./search-panel.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPanelComponent implements OnDestroy {
	protected searchQuery = new BehaviorSubject<string>("");
	private sub: Subscription;

	protected isLoading$: Observable<boolean>;
	protected searchResults$: Observable<PostVectorData[] | null>;
	protected history$: Observable<string[] | null>;

	constructor(
		private store: Store,
		private searchService: SearchService,
		protected userService: UserService,
	) {
		this.sub = this.searchQuery
			.pipe(
				map((q) => q.trim()),
				filter((q) => !!q.length),
				debounceTime(200),
			)
			.subscribe((q) => {
				this.searchService.search(q, ["author", "community"]);
			});

		this.isLoading$ = this.store.pipe(select(selectIsSearchLoading));

		// remove search results when query is empty
		this.searchResults$ = this.store.pipe(
			select(selectSearchPosts),
			switchMap((data) =>
				this.searchQuery.pipe(
					map((q) => !q.trim().length),
					map((isEmpty) => (isEmpty ? null : data)),
				),
			),
		);

		this.history$ = this.searchService.getHistory();

		this.searchResults$
			.pipe(
				takeWhile(() => !this.sub.closed),
				debounceTime(1000),
				map(() => this.searchQuery.getValue()),
				map((query) => query.trim()),
				filter((query) => !!query.length),
			)
			.subscribe((query) => this.searchService.saveToHistory(query));
	}

	protected searchQueryChanged(query: string) {
		this.searchQuery.next(query);
	}

	protected getTimeElapsed(since: Date) {
		return dayjs(since).fromNow();
	}

	protected onHistoryItemClick(item: string) {
		this.searchQuery.next(item);
	}

	protected removeHistoryItem(event: Event, idx: number) {
		event.stopPropagation();
		this.searchService.removeHistoryItem(idx);
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}

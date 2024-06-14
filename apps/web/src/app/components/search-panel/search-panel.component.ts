import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideSearch } from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { PostVectorData } from "common";
import {
	BehaviorSubject,
	Observable,
	Subscription,
	debounceTime,
	filter,
	map,
} from "rxjs";
import { SearchService } from "../../features/search/search.service";
import {
	selectIsSearchLoading,
	selectSearchPosts,
} from "../../state/search/selectors";
import { DialogContent } from "../ui/dialog-container/dialog-content.component";
import { ProgressSpinnerComponent } from "../ui/progress-spinner/progress-spinner.component";

@Component({
	selector: "app-search-panel",
	standalone: true,
	imports: [
		NgIcon,
		DialogContent,
		FormsModule,
		CommonModule,
		ProgressSpinnerComponent,
	],
	providers: [],
	viewProviders: [provideIcons({ lucideSearch })],
	templateUrl: "./search-panel.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPanelComponent implements OnDestroy {
	protected searchQuery = new BehaviorSubject<string>("");
	private sub: Subscription;

	protected isLoading$: Observable<boolean>;
	protected searchResults$: Observable<PostVectorData[] | null>;

	constructor(
		private store: Store,
		private searchService: SearchService,
	) {
		this.sub = this.searchQuery
			.pipe(
				map((q) => q.trim()),
				filter((q) => !!q.length),
				debounceTime(200),
			)
			.subscribe((q) => {
				this.searchService.search(q);
			});

		this.isLoading$ = this.store.pipe(select(selectIsSearchLoading));
		this.searchResults$ = this.store.pipe(select(selectSearchPosts));
	}

	protected searchQueryChanged(query: string) {
		this.searchQuery.next(query);
	}

	ngOnDestroy(): void {
		this.sub.unsubscribe();
	}
}

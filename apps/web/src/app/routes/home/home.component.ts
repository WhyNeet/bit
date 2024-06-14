import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	signal,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCommand, lucideHeart, lucideHistory } from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { PostDto } from "common";
import { Observable, filter, map, take } from "rxjs";
import { PostFormComponent } from "../../components/post-form/post-form.component";
import { PostListComponent } from "../../components/post-list/post-list.component";
import { SearchPanelComponent } from "../../components/search-panel/search-panel.component";
import { GradientBlurComponent } from "../../components/ui/blur/gradient-blur.component";
import { KBDComponent } from "../../components/ui/kbd/kbd.component";
import { DialogService } from "../../features/dialog/dialog.service";
import { PostsService } from "../../features/posts/posts.service";
import {
	selectHomePosts,
	selectLatestPosts,
} from "../../state/posts/selectors";
import { selectUser } from "../../state/user/selectors";

export type Section = "latest" | "following";

@Component({
	selector: "app-page-home",
	standalone: true,
	imports: [
		PostFormComponent,
		CommonModule,
		NgIcon,
		PostListComponent,
		GradientBlurComponent,
		KBDComponent,
	],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
	viewProviders: [provideIcons({ lucideHistory, lucideHeart, lucideCommand })],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	@HostBinding() class = "flex-auto";
	protected isLoggedIn$: Observable<boolean>;
	protected latestPosts$: Observable<{
		posts: PostDto[][] | null;
		isLoading: boolean;
	}>;
	protected followingPosts$: Observable<{
		posts: PostDto[][] | null;
		isLoading: boolean;
	}>;

	protected currentSection = signal<Section>("latest");

	constructor(
		private store: Store,
		private postsService: PostsService,
		private dialogService: DialogService,
	) {
		this.isLoggedIn$ = this.store.pipe(
			select(selectUser),
			map((user) => !!user),
		);

		this.latestPosts$ = this.store.pipe(select(selectLatestPosts));
		this.followingPosts$ = this.store.pipe(select(selectHomePosts));
	}

	protected setSection(section: Section) {
		this.currentSection.set(section);
	}

	protected fetchMoreLatest(page: number, perPage: number) {
		this.postsService.getLatestPosts(page, perPage, ["author", "community"]);
	}

	protected fetchMoreFollowing(page: number, perPage: number) {
		this.postsService.getHomePosts(page, perPage, ["author", "community"]);
	}

	protected openSearch() {
		this.dialogService.open(SearchPanelComponent);
	}
}

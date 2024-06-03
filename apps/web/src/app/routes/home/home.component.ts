import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	OnInit,
	signal,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideHeart, lucideHistory } from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { PostDto } from "common";
import { Observable, filter, map, take } from "rxjs";
import { PostFormComponent } from "../../components/post-form/post-form.component";
import { SkeletonComponent } from "../../components/ui/skeleton/skeleton.component";
import { PostsService } from "../../features/posts/posts.service";
import { selectHomePosts } from "../../state/posts/selectors";
import { selectUser } from "../../state/user/selectors";

export type Section = "latest" | "following";

@Component({
	selector: "app-page-home",
	standalone: true,
	imports: [PostFormComponent, CommonModule, SkeletonComponent, NgIcon],
	templateUrl: "./home.component.html",
	styleUrl: "./home.component.css",
	viewProviders: [provideIcons({ lucideHistory, lucideHeart })],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
	@HostBinding() class = "flex-auto";
	protected isLoggedIn: Observable<boolean>;
	protected posts: Observable<PostDto[] | null>;
	protected isLoading: Observable<boolean>;

	protected currentSection = signal<Section>("latest");

	constructor(
		private store: Store,
		private postsService: PostsService,
	) {
		this.isLoggedIn = this.store.pipe(
			select(selectUser),
			map((user) => !!user),
		);

		this.posts = this.store.pipe(select(selectHomePosts));

		this.isLoading = this.posts.pipe(map((posts) => !!posts));
	}

	ngOnInit(): void {
		this.posts
			.pipe(
				filter((posts) => !posts),
				take(1),
			)
			.subscribe(() => this.postsService.getHomePosts());
	}

	protected setSection(section: Section) {
		this.currentSection.set(section);
	}
}

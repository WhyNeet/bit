import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import { PostDto } from "common";
import { filter, take } from "rxjs";

@Component({
	selector: "app-posts-list",
	standalone: true,
	imports: [],
	providers: [],
	templateUrl: "./post-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent {
	posts = input.required<PostDto[][] | null>();
	isLoading = input.required<boolean>();

	fetchMore = input.required<(page: number, perPage: number) => void>();

	constructor() {
		toObservable(this.posts)
			.pipe(
				filter((posts) => !posts),
				take(1),
			)
			.subscribe(() => this.fetchMore()(0, 20));
	}
}

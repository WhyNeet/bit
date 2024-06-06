import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from "@angular/core";
import { PostDto } from "common";
import { Observable, filter, map, take } from "rxjs";
import { PostComponent } from "../ui/post/post.component";
import { SkeletonComponent } from "../ui/skeleton/skeleton.component";

@Component({
	selector: "app-posts-list",
	standalone: true,
	imports: [SkeletonComponent, PostComponent, CommonModule],
	providers: [],
	templateUrl: "./post-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit {
	@Input() data!: Observable<{ posts: PostDto[][] | null; isLoading: boolean }>;

	protected posts$!: Observable<PostDto[][] | null>;
	protected isLoading$!: Observable<boolean>;

	@Input() fetchMore!: (page: number, perPage: number) => void;

	ngOnInit(): void {
		this.data
			.pipe(
				map((data) => data.posts),
				filter((posts) => !posts),
				take(1),
			)
			.subscribe(() => this.fetchMore(0, 20));

		this.posts$ = this.data.pipe(map((data) => data.posts));
		this.isLoading$ = this.data.pipe(map((data) => data.isLoading));
	}
}

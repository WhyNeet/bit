import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideChevronLeft } from "@ng-icons/lucide";
import { CommunityDto, PostDto, UserDto } from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Observable, map } from "rxjs";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { markdown } from "../../components/ui/post/markdown.conf";
import { PostFooterComponent } from "../../components/ui/post/post-footer.component";
import { PostsService } from "../../features/posts/posts.service";
import { UserService } from "../../features/user/user.service";

dayjs.extend(relativeTime);

@Component({
	selector: "app-page-post",
	standalone: true,
	imports: [
		CommonModule,
		NgIcon,
		RouterLink,
		AvatarComponent,
		PostFooterComponent,
	],
	viewProviders: [provideIcons({ lucideChevronLeft })],
	templateUrl: "./post.component.html",
	styleUrl: "./post.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPageComponent {
	private postId = this.activatedRoute.snapshot.params["postId"] as string;
	protected post$: Observable<
		| (PostDto & {
				community: CommunityDto;
				author: UserDto;
				renderedContent: string;
		  })
		| null
	>;

	constructor(
		private activatedRoute: ActivatedRoute,
		private postsService: PostsService,
		protected userService: UserService,
	) {
		this.post$ = this.postsService
			.getPost(this.postId, ["author", "community"])
			.pipe(
				map((post) => ({
					...post,
					renderedContent: markdown.render(post.content),
				})),
			) as typeof this.post$;
	}

	protected timeElapsed(since: Date) {
		return dayjs(since).fromNow();
	}
}

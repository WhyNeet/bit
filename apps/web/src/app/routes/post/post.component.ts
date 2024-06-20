import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  afterNextRender,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideChevronLeft } from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { CommunityDto, PostDto, UserDto, UserPostRelationType } from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { BehaviorSubject, Observable, Subject, map, switchMap } from "rxjs";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { markdown } from "../../components/ui/post/markdown.conf";
import { PostFooterComponent } from "../../components/ui/post/post-footer.component";
import { PostsService } from "../../features/posts/posts.service";
import { UserService } from "../../features/user/user.service";
import { selectUser } from "../../state/user/selectors";

dayjs.extend(relativeTime);

export type FullPost = PostDto & {
  community: CommunityDto;
  author: UserDto;
  renderedContent: string;
};

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
  protected post$ = new BehaviorSubject<FullPost | null>(null);
  protected postVotingState$!: Observable<PostDto["votingState"]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    protected userService: UserService,
  ) {
    this.postsService
      .getPost(this.postId, ["author", "community"])
      .pipe(
        map((post) => ({
          ...post,
          renderedContent: markdown.render(post.content),
        })),
      )
      .subscribe((data) => this.post$.next(data as FullPost));

    afterNextRender(() => {
      // voting state is specific for every user, fetch it on the client
      this.postVotingState$ = this.postsService.getPostVotingState(this.postId);
      this.postVotingState$.subscribe((votingState) =>
        this.post$.next({
          ...(this.post$.getValue() ?? {}),
          votingState,
        } as FullPost),
      );
    });
  }

  protected onVoteChange(votingState: PostDto["votingState"]) {
    // if (!this.isLoggedIn()) return

    // biome-ignore lint/style/noNonNullAssertion: is always a non-null value if this handler is invoked
    const currentPost = this.post$.getValue()!;

    if (votingState === null) {
      // if the new vote is "null", remove the existing one
      if (currentPost.votingState === UserPostRelationType.Upvote)
        currentPost.upvotes -= 1;
      else currentPost.downvotes -= 1;
    } else if (votingState === UserPostRelationType.Upvote) {
      currentPost.upvotes += 1;
      if (currentPost.votingState === UserPostRelationType.Downvote)
        currentPost.downvotes -= 1;
    } else {
      // if currentPost is downvoted
      currentPost.downvotes += 1;
      if (currentPost.votingState === UserPostRelationType.Upvote)
        currentPost.upvotes -= 1;
    }

    this.post$.next({ ...currentPost, votingState } as FullPost);
  }

  protected timeElapsed(since: Date) {
    return dayjs(since).fromNow();
  }
}

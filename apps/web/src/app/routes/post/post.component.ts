import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideChevronLeft, lucideSendHorizontal } from "@ng-icons/lucide";
import { CommunityDto, PostDto, UserDto, UserPostRelationType } from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  BehaviorSubject,
  Observable,
  filter,
  map,
  switchMap,
  take,
} from "rxjs";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { markdown } from "../../components/ui/post/markdown.conf";
import { PostFooterComponent } from "../../components/ui/post/post-footer.component";
import { CommentsService } from "../../features/comments/comments.service";
import { PostsService } from "../../features/posts/posts.service";
import { UserService } from "../../features/user/user.service";

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
    ReactiveFormsModule,
  ],
  viewProviders: [provideIcons({ lucideChevronLeft, lucideSendHorizontal })],
  templateUrl: "./post.component.html",
  styleUrl: "./post.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostPageComponent {
  protected comment = new FormControl("", {
    validators: [
      Validators.minLength(1),
      Validators.maxLength(512),
      Validators.required,
    ],
  });

  private postId = this.activatedRoute.snapshot.params["postId"] as string;
  protected post$ = new BehaviorSubject<FullPost | null>(null);
  protected postVotingState$!: Observable<PostDto["votingState"]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    protected userService: UserService,
    private commentsService: CommentsService,
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
      this.postVotingState$
        .pipe(
          switchMap((state) =>
            this.post$.pipe(map((post) => ({ post, state }))),
          ),
          filter(({ post }) => !!post),
          map(({ state, post }) => ({ ...post, votingState: state })),
          take(1),
        )
        .subscribe((post) => this.post$.next(post as FullPost));
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

  protected handleCreateCommentClick() {
    if (this.comment.invalid) return;

    // biome-ignore lint/style/noNonNullAssertion: is not null
    this.commentsService.createComment(this.postId, this.comment.value!);
  }
}

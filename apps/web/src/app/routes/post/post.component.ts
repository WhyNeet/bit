import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  afterNextRender,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideChevronLeft, lucideSendHorizontal } from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import {
  CommentDto,
  CommunityDto,
  PostDto,
  UserDto,
  UserPostRelationType,
} from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  takeWhile,
  throwError,
} from "rxjs";
import { CommentsListComponent } from "../../components/comments-list/comments-list.component";
import { PostFormComponent } from "../../components/post-form/post-form.component";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { PostGalleryComponent } from "../../components/ui/post-gallery/post-gallery.component";
import { markdown } from "../../components/ui/post/markdown.conf";
import { PostFooterComponent } from "../../components/ui/post/post-footer.component";
import { ProgressSpinnerComponent } from "../../components/ui/progress-spinner/progress-spinner.component";
import { CommentsService } from "../../features/comments/comments.service";
import { PostsService } from "../../features/posts/posts.service";
import { UserService } from "../../features/user/user.service";
import { selectComments } from "../../state/comments/selectors";
import { selectUser } from "../../state/user/selectors";

dayjs.extend(relativeTime);

export type FullComment = CommentDto & { author: UserDto };

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
    ProgressSpinnerComponent,
    CommentsListComponent,
    PostGalleryComponent,
    PostFormComponent,
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
  protected postComments$: Observable<FullComment[][] | undefined>;
  protected commentsLoading$ = new Subject<boolean>();
  protected isNotFound$ = new Subject<boolean>();
  protected isLoggedIn$: Observable<boolean>;

  protected isEditing = signal(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    protected userService: UserService,
    private commentsService: CommentsService,
    private store: Store,
    private router: Router,
  ) {
    this.isLoggedIn$ = this.store.pipe(
      select(selectUser),
      map((user) => !!user),
    );

    this.postsService
      .getPost(this.postId, ["author", "community"])
      .pipe(
        catchError((err) => {
          this.isNotFound$.next(true);
          return throwError(() => err);
        }),
        map((post) => ({
          ...post,
          renderedContent: markdown.render(post.content),
        })),
      )
      .subscribe((data) => {
        this.post$.next(data as FullPost);
      });

    this.postComments$ = this.store.pipe(
      select(selectComments),
      map(
        (comments) => comments.get(this.postId) as FullComment[][] | undefined,
      ),
    );

    this.post$
      .pipe(
        filter((post) => !!post),
        mergeMap((post) =>
          this.postComments$.pipe(
            map((comments) => ({ comments, id: (post as FullPost).id })),
          ),
        ),
        takeWhile(({ comments }) => comments === undefined),
        take(1),
      )
      .subscribe(({ id }) => {
        this.commentsLoading$.next(true);
        this.commentsService.getComments(id, 0, 20, ["author"]);
      });

    this.postComments$.subscribe(() => this.commentsLoading$.next(false));

    afterNextRender(() => {
      // voting state is specific for every user, fetch it on the client side
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
    // biome-ignore lint/style/noNonNullAssertion: is never a null value if this handler is invoked
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

  protected fetchComments(page: number, perPage: number) {
    this.commentsService.getComments(this.postId, page, perPage, ["author"]);
  }

  protected toggleIsEditing() {
    this.isEditing.update((prev) => !prev);
  }

  protected handleEditFinish({
    content,
    title,
    files,
    images,
  }: { title: string; content: string; files: File[]; images: File[] }) {
    this.postsService
      .updatePost(
        (this.post$.getValue() as FullPost).id,
        title,
        content,
        files,
        images,
      )
      .subscribe((post) => {
        this.post$.next({
          ...(this.post$.getValue() as FullPost),
          content: post.content,
          title: post.title,
          renderedContent: markdown.render(post.content),
          images: post.images,
          files: post.files,
        });
      });
    this.isEditing.set(false);
  }

  protected getBackLink() {
    if (!this.router.lastSuccessfulNavigation) return null;
    return this.router.lastSuccessfulNavigation.previousNavigation?.finalUrl?.toString();
  }
}

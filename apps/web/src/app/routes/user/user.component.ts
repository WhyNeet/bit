import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  afterNextRender,
  effect,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgIcon } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { PostDto, UserDto, UserPostRelationType } from "common";
import { Observable, catchError, filter, map, take, throwError } from "rxjs";
import { PostListComponent } from "../../components/post-list/post-list.component";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { ProgressSpinnerComponent } from "../../components/ui/progress-spinner/progress-spinner.component";
import { AuthService } from "../../features/auth/auth.service";
import { PostsService } from "../../features/posts/posts.service";
import { UserService } from "../../features/user/user.service";
import { selectUser } from "../../state/user/selectors";

@Component({
  selector: "app-page-user",
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerComponent,
    NgIcon,
    AvatarComponent,
    PostListComponent,
    RouterLink,
  ],
  styleUrl: "./user.component.css",
  templateUrl: "./user.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent {
  private userId: string;
  protected isCurrentUser: Signal<boolean | undefined>;
  protected user = signal<UserDto | null>(null);
  protected isError = signal(false);
  protected isLoggedIn: Signal<boolean | undefined>;
  private userPosts = signal<PostDto[][] | null>(null);
  protected userPosts$: Observable<PostDto[][] | null>;
  protected userPostsLoading = signal(false);
  protected isUserPostsError = signal(false);
  protected userPostsLoading$ = toObservable(this.userPostsLoading);
  protected isFollowing = signal<boolean | null>(null);
  protected followers = signal<UserDto[] | null>(null);

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    protected userService: UserService,
    private authService: AuthService,
    private postsService: PostsService,
  ) {
    this.userId = this.activatedRoute.snapshot.params["userId"];

    this.isCurrentUser = toSignal(
      this.store.pipe(
        select(selectUser),
        map((user) => user?.id === this.userId),
      ),
    );

    this.isLoggedIn = toSignal(
      this.store.pipe(
        select(selectUser),
        map((user) => !!user),
      ),
    );

    this.userPosts$ = toObservable(this.userPosts);

    effect(
      () => {
        if (this.userPostsLoading() || this.userPosts() || !this.user()) return;

        this.userPostsLoading.set(true);

        this.postsService
          .getUserPosts((this.user() as UserDto).id, ["author", "community"])
          .pipe(
            catchError((err) => {
              this.isUserPostsError.set(true);
              return throwError(() => err);
            }),
            take(1),
          )
          .subscribe((posts) => {
            this.userPosts.update((prev) => [...(prev ?? []), posts]);
            this.userPostsLoading.set(false);
          });
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        if (!this.user()) return;

        this.userService
          .getUserFollowers((this.user() as UserDto).id)
          .subscribe((followers) => this.followers.set(followers));
      },
      { allowSignalWrites: true },
    );

    this.userService
      .getUserById(this.userId)
      .pipe(
        catchError((err) => {
          this.isError.set(true);
          return throwError(() => err);
        }),
      )
      .subscribe((user) => this.user.set(user));

    afterNextRender(() => {
      this.userService
        .isUserFollowed(this.userId)
        .subscribe((isFollowed) => this.isFollowing.set(isFollowed));

      this.userPosts$
        .pipe(
          filter((posts) => !!posts),
          take(1),
        )
        .subscribe((posts) =>
          this.postsService
            .getPostsVotingState(
              (posts as PostDto[][])[0].map((post) => post.id),
            )
            .subscribe((res) =>
              this.userPosts.update((posts) => {
                if (!posts) return null;

                posts[0] = posts[0].map((post) => ({
                  ...post,
                  votingState: res.get(post.id)?.type ?? post.votingState,
                }));
                return [...posts];
              }),
            ),
        );
    });
  }

  protected logout() {
    this.authService.logout();
  }

  protected fetchMorePosts(page: number, perPage: number) {
    this.postsService
      .getUserPosts(this.userId, ["author", "community"], page, perPage)
      .pipe(
        catchError((err) => {
          this.isUserPostsError.set(true);
          return throwError(() => err);
        }),
        take(1),
      )
      .subscribe((posts) =>
        this.userPosts.update((prev) => [...(prev ?? []), posts]),
      );
  }

  protected handlePostVote(data: {
    postId: string;
    votingState: PostDto["votingState"];
  }) {
    if (!this.isLoggedIn()) return;

    this.userPosts.update((prev) => {
      if (!prev) return null;

      return prev.map((batch) =>
        batch.map((post) => ({
          ...post,
          votingState:
            post.id === data.postId ? data.votingState : post.votingState,
          upvotes:
            post.votingState === UserPostRelationType.Upvote
              ? post.upvotes - 1
              : data.votingState === UserPostRelationType.Upvote
                ? post.upvotes + 1
                : post.upvotes,
          downvotes:
            post.votingState === UserPostRelationType.Downvote
              ? post.downvotes - 1
              : data.votingState === UserPostRelationType.Downvote
                ? post.downvotes + 1
                : post.downvotes,
        })),
      );
    });
  }

  protected handleFollowClick() {
    this.isFollowing.set(true);
    this.userService.followUser(this.userId).subscribe();
  }

  protected handleUnfollowClick() {
    this.isFollowing.set(false);
    this.userService.unfollowUser(this.userId).subscribe();
  }
}

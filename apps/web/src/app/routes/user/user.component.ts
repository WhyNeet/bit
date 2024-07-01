import { CommonModule, isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
  Signal,
  afterNextRender,
  effect,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { NgIcon } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { PostDto, UserDto } from "common";
import {
  Observable,
  Subject,
  catchError,
  filter,
  map,
  take,
  throwError,
} from "rxjs";
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
  protected isLoggedIn$: Observable<boolean>;
  private userPosts = signal<PostDto[][] | null>(null);
  protected userPosts$: Observable<PostDto[][] | null>;
  protected userPostsLoading = signal(false);
  protected isUserPostsError = signal(false);
  protected userPostsLoading$ = toObservable(this.userPostsLoading);

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    protected userService: UserService,
    private authService: AuthService,
    private postsService: PostsService,
    private cdr: ChangeDetectorRef,
  ) {
    this.userId = this.activatedRoute.snapshot.params["userId"];

    this.isCurrentUser = toSignal(
      this.store.pipe(
        select(selectUser),
        map((user) => user?.id === this.userId),
      ),
    );

    this.isLoggedIn$ = this.store.pipe(
      select(selectUser),
      map((user) => !!user),
    );

    this.userPosts$ = toObservable(this.userPosts);

    effect(() => {
      if (this.userPostsLoading() || this.userPosts()) return;

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
    });

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
            .subscribe((res) => console.log("voting state:", res)),
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
}

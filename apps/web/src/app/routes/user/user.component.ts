import { CommonModule, isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
  Signal,
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
  protected user$ = new Subject<UserDto | null>();
  protected isError = signal(false);
  protected isLoggedIn$: Observable<boolean>;
  private userPosts = signal<PostDto[][] | null>(null);
  protected userPosts$: Observable<PostDto[][] | null>;
  protected userPostsLoading$: Observable<boolean>;
  protected isUserPostsError = signal(false);

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    protected userService: UserService,
    // biome-ignore lint/complexity/noBannedTypes: Angular
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private postsService: PostsService,
  ) {
    this.userPosts$ = toObservable(this.userPosts);
    this.userPostsLoading$ = this.userPosts$.pipe(map((posts) => !posts));

    this.user$
      .pipe(
        filter((user) => !!user),
        take(1),
      )
      .subscribe((user) => {
        this.postsService
          .getUserPosts((user as UserDto).id, ["author", "community"])
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
      });

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

    if (isPlatformServer(this.platformId)) return;

    this.userService
      .getUserById(this.userId)
      .pipe(
        catchError((err) => {
          this.isError.set(true);
          return throwError(() => err);
        }),
      )
      .subscribe((user) => this.user$.next(user));
  }

  protected logout() {
    this.authService.logout();
  }

  protected fetchMorePosts(page: number, perPage: number) {
    console.log("TODO: fetchMoreUserPosts", page, perPage);
  }
}

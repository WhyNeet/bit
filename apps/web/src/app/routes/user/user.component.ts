import { CommonModule, isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  PLATFORM_ID,
  Signal,
  effect,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { NgIcon } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { UserDto } from "common";
import {
  Observable,
  Subject,
  catchError,
  filter,
  map,
  take,
  takeWhile,
  throwError,
} from "rxjs";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { ProgressSpinnerComponent } from "../../components/ui/progress-spinner/progress-spinner.component";
import { AuthService } from "../../features/auth/auth.service";
import { UserService } from "../../features/user/user.service";
import { selectUser } from "../../state/user/selectors";

@Component({
  selector: "app-page-user",
  standalone: true,
  imports: [CommonModule, ProgressSpinnerComponent, NgIcon, AvatarComponent],
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

  constructor(
    private store: Store,
    private activatedRoute: ActivatedRoute,
    protected userService: UserService,
    // biome-ignore lint/complexity/noBannedTypes: Angular
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
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
}

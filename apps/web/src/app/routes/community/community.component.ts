import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { NgIcon } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { CommunityDto, UserDto } from "common";
import { catchError, map, take, throwError } from "rxjs";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { ProgressSpinnerComponent } from "../../components/ui/progress-spinner/progress-spinner.component";
import { CommunityService } from "../../features/community/community.service";
import { selectUser } from "../../state/user/selectors";

export type FullCommunity = CommunityDto & { owner: UserDto };

@Component({
  selector: "app-page-community",
  standalone: true,
  imports: [ProgressSpinnerComponent, NgIcon, AvatarComponent],
  templateUrl: "./community.component.html",
  styleUrl: "./community.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityPageComponent {
  private communityId: string;
  protected isCommunityOwner = signal(false);
  private currentUser: Signal<UserDto | null | undefined>;
  protected isLoggedIn = computed(() => !!this.currentUser());
  protected community = signal<FullCommunity | null>(null);
  protected isError = signal(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    protected communityService: CommunityService,
    private store: Store,
  ) {
    this.communityId = this.activatedRoute.snapshot.params["communityId"];

    this.communityService
      .getCommunity(this.communityId, ["owner"])
      .pipe(
        catchError((err) => {
          this.isError.set(true);
          return throwError(() => err);
        }),
        take(1),
      )
      .subscribe((community) => this.community.set(community as FullCommunity));

    this.currentUser = toSignal(this.store.pipe(select(selectUser)));

    effect(
      () => {
        this.isCommunityOwner.set(
          this.currentUser()?.id === this.community()?.owner.id,
        );
      },
      { allowSignalWrites: true },
    );
  }
}

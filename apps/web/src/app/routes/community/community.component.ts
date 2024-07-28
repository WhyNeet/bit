import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { NgIcon } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { CommunityDto, PostDto, UserDto, UserPostRelationType } from "common";
import { Observable, catchError, map, take, throwError } from "rxjs";
import { PostListComponent } from "../../components/post-list/post-list.component";
import { AvatarComponent } from "../../components/ui/avatar/avatar.component";
import { ProgressSpinnerComponent } from "../../components/ui/progress-spinner/progress-spinner.component";
import { CommunityService } from "../../features/community/community.service";
import { selectUser } from "../../state/user/selectors";

export type FullCommunity = CommunityDto & { owner: UserDto };

@Component({
  selector: "app-page-community",
  standalone: true,
  imports: [
    ProgressSpinnerComponent,
    NgIcon,
    AvatarComponent,
    PostListComponent,
  ],
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
  protected communityPosts = signal<PostDto[][] | null>(null);
  protected communityPosts$: Observable<PostDto[][] | null>;
  protected communityPostsLoading$: Observable<boolean>;
  protected isError = signal(false);

  constructor(
    private activatedRoute: ActivatedRoute,
    protected communityService: CommunityService,
    private store: Store,
  ) {
    this.communityId = this.activatedRoute.snapshot.params["communityId"];

    this.communityPosts$ = toObservable(this.communityPosts);
    this.communityPostsLoading$ = this.communityPosts$.pipe(
      map((posts) => !posts),
    );

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

    effect(
      () => {
        if (this.community())
          // biome-ignore lint/style/noNonNullAssertion: checked above
          this.communityService
            .getCommunityPosts(this.community()!.id, ["author", "community"])
            .subscribe((posts) =>
              this.communityPosts.update((prev) => [...(prev ?? []), posts]),
            );
      },
      { allowSignalWrites: true },
    );
  }

  protected fetchMorePosts(page: number, perPage: number) {
    this.communityService
      .getCommunityPosts(this.communityId, ["owner"], page, perPage)
      .pipe(
        catchError((err) => {
          return throwError(() => err);
        }),
        take(1),
      )
      .subscribe((posts) =>
        this.communityPosts.update((prev) => [...(prev ?? []), posts]),
      );
  }

  protected handlePostVote(data: {
    postId: string;
    votingState: PostDto["votingState"];
  }) {
    if (!this.isLoggedIn()) return;

    this.communityPosts.update((prev) => {
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

  protected handleJoinClick() {
    // TODO
  }

  protected handleLeaveClick() {
    // TODO
  }
}

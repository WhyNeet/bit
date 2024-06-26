import { CommonModule, Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  output,
} from "@angular/core";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  lucideExternalLink,
  lucideThumbsDown,
  lucideThumbsUp,
} from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { CommunityDto, PostDto, UserDto, UserPostRelationType } from "common";
import { Observable, map } from "rxjs";
import { PostsService } from "../../../features/posts/posts.service";
import { selectUser } from "../../../state/user/selectors";
import { Option, OptionsComponent } from "../options/options.component";

@Component({
  selector: "app-ui-post-footer",
  standalone: true,
  imports: [NgIcon, RouterLink, OptionsComponent, CommonModule],
  providers: [],
  viewProviders: [
    provideIcons({ lucideThumbsUp, lucideThumbsDown, lucideExternalLink }),
  ],
  template: `
    <div class="flex gap-2">
      <div class="footer-item-group">
        <button (click)="handleLikeClick()" class="flex items-center gap-2 {{ isLiked() ? 'text-red-500' : 'text-text/80' }}">
          <ng-icon size="16" name="lucideThumbsUp" />
          {{ post.upvotes }}
        </button>
        <button (click)="handleDislikeClick()" class="flex items-center gap-2 {{ isDisliked() ? 'text-blue-500' : 'text-text/80' }}">
          <ng-icon size="16" name="lucideThumbsDown" />
          {{ post.downvotes }}
        </button>
      </div>
      @if (!isExpanded) {
        <a routerLink="/post/{{ post.id }}" class="footer-item-group">
          <ng-icon size="16" name="lucideExternalLink" />
        </a>
      }
      @if ((userId$ | async) === post.author.id) {
        <app-ui-options (onSelectionChange)="onAction($event)" [options]="actions" />
      }
    </div>
	`,
  styleUrl: "./post-footer.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFooterComponent {
  @Input() post!: PostDto & { author: UserDto; community: CommunityDto };
  protected isExpanded = false;

  public onEditClick = output();

  protected userId$: Observable<string | undefined>;

  @Input() canVote = true;

  public onVote = output<PostDto["votingState"]>();

  protected actions: Option[] = [
    {
      label: "Edit",
      icon: "lucidePencil",
    },
    {
      label: "Delete",
      icon: "lucideTrash",
    },
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private postsService: PostsService,
    private store: Store,
    private location: Location,
  ) {
    this.userId$ = this.store.pipe(
      select(selectUser),
      map((user) => user?.id),
    );

    // if current route is when user clicked "open post"
    if (typeof this.activatedRoute.snapshot.params["postId"] === "string")
      this.isExpanded = true;
  }

  protected isLiked() {
    return this.post.votingState === UserPostRelationType.Upvote;
  }

  protected isDisliked() {
    return this.post.votingState === UserPostRelationType.Downvote;
  }

  protected handleLikeClick() {
    if (!this.canVote) return;

    if (this.post.votingState === UserPostRelationType.Upvote) {
      this.onVote.emit(null);
      this.postsService.removePostLike(this.post.id);
    } else {
      this.onVote.emit(UserPostRelationType.Upvote);
      this.postsService.likePost(this.post.id);
    }
  }

  protected handleDislikeClick() {
    if (!this.canVote) return;

    if (this.post.votingState === UserPostRelationType.Downvote) {
      this.onVote.emit(null);
      this.postsService.removePostDislike(this.post.id);
    } else {
      this.onVote.emit(UserPostRelationType.Downvote);
      this.postsService.dislikePost(this.post.id);
    }
  }

  protected onAction(idx: number) {
    switch (idx) {
      case 0:
        this.onEditClick.emit();
        break;
      case 1:
        this.postsService.deletePost(this.post.id);
        if (this.isExpanded) this.location.back();
        break;
    }
  }
}

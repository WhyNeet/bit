import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
	lucideExternalLink,
	lucideThumbsDown,
	lucideThumbsUp,
} from "@ng-icons/lucide";
import { CommunityDto, PostDto, UserDto } from "common";

@Component({
	selector: "app-ui-post-footer",
	standalone: true,
	imports: [NgIcon, RouterLink],
	providers: [],
	viewProviders: [
		provideIcons({ lucideThumbsUp, lucideThumbsDown, lucideExternalLink }),
	],
	template: `
    <div class="flex gap-2">
      <div class="footer-item-group">
        <button class="flex items-center gap-2 text-text/80">
          <ng-icon size="16" name="lucideThumbsUp" />
          {{ post.upvotes }}
        </button>
        <button class="flex items-center gap-2 text-text/80">
          <ng-icon size="16" name="lucideThumbsDown" />
          {{ post.downvotes }}
        </button>
      </div>
      @if (!isExpanded) {
        <a routerLink="/post/{{ post.id }}" class="footer-item-group">
          <ng-icon size="16" name="lucideExternalLink" />
        </a>
      }
    </div>
	`,
	styleUrl: "./post-footer.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFooterComponent {
	@Input() post!: PostDto & { author: UserDto; community: CommunityDto };
	protected isExpanded = false;

	constructor(private activatedRoute: ActivatedRoute) {
		// if current route is when user clicked "open post"
		if (typeof this.activatedRoute.snapshot.params["postId"] === "string")
			this.isExpanded = true;
	}
}

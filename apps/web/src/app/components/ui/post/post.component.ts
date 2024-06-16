import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
	lucideExternalLink,
	lucideThumbsDown,
	lucideThumbsUp,
} from "@ng-icons/lucide";
import { CommunityDto, PostDto, UserDto } from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserService } from "../../../features/user/user.service";
import { AvatarComponent } from "../avatar/avatar.component";
import { markdown } from "./markdown.conf";

dayjs.extend(relativeTime);

@Component({
	selector: "app-ui-post",
	standalone: true,
	imports: [AvatarComponent, NgIcon, RouterLink],
	providers: [UserService],
	viewProviders: [
		provideIcons({ lucideThumbsUp, lucideThumbsDown, lucideExternalLink }),
	],
	templateUrl: "./post.component.html",
	styleUrl: "./post.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
	constructor(protected userService: UserService) {}

	@Input() post!: PostDto & { author: UserDto; community: CommunityDto };
	protected renderedContent!: string;

	protected timeElapsed = "";

	ngOnInit(): void {
		this.timeElapsed = dayjs(this.post.createdAt).fromNow();
		this.renderedContent = markdown.render(this.post.content);
	}
}

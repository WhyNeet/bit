import {
	ChangeDetectionStrategy,
	Component,
	Input,
	OnInit,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideThumbsDown, lucideThumbsUp } from "@ng-icons/lucide";
import { PostDto, UserDto } from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { UserService } from "../../../features/user/user.service";
import { AvatarComponent } from "../avatar/avatar.component";
import { markdown } from "./markdown.conf";

dayjs.extend(relativeTime);

@Component({
	selector: "app-ui-post",
	standalone: true,
	imports: [AvatarComponent, NgIcon],
	providers: [UserService],
	viewProviders: [provideIcons({ lucideThumbsUp, lucideThumbsDown })],
	templateUrl: "./post.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
	constructor(protected userService: UserService) {}

	@Input() post!: PostDto & { author: UserDto };
	protected renderedContent!: string;

	protected timeElapsed = "";

	ngOnInit(): void {
		this.timeElapsed = dayjs(this.post.createdAt).fromNow();
		this.renderedContent = markdown.render(this.post.content);
	}
}

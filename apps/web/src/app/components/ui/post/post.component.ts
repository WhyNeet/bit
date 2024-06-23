import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  signal,
} from "@angular/core";
import { CommunityDto, PostDto, UserDto } from "common";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PostsService } from "../../../features/posts/posts.service";
import { UserService } from "../../../features/user/user.service";
import { PostFormComponent } from "../../post-form/post-form.component";
import { AvatarComponent } from "../avatar/avatar.component";
import { markdown } from "./markdown.conf";
import { PostFooterComponent } from "./post-footer.component";

dayjs.extend(relativeTime);

@Component({
  selector: "app-ui-post",
  standalone: true,
  imports: [AvatarComponent, PostFooterComponent, PostFormComponent],
  providers: [UserService],
  templateUrl: "./post.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostComponent implements OnInit {
  constructor(
    protected userService: UserService,
    private postsService: PostsService,
  ) {}

  protected isEditing = signal(false);

  @Input() post!: PostDto & { author: UserDto; community: CommunityDto };
  protected renderedContent!: string;

  protected timeElapsed = "";

  ngOnInit(): void {
    this.timeElapsed = dayjs(this.post.createdAt).fromNow();
    this.renderedContent = markdown.render(this.post.content);
  }

  protected handleEditClick() {
    this.isEditing.set(true);
  }

  protected handleEditFinish({
    content,
    title,
  }: { title: string; content: string }) {
    this.postsService.updatePost(this.post.id, title, content);
    this.isEditing.set(false);
  }
}

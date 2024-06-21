import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { CommentDto, UserDto } from "common";
import { UserService } from "../../../features/user/user.service";
import { AvatarComponent } from "../avatar/avatar.component";

@Component({
  selector: "app-ui-comment",
  standalone: true,
  imports: [AvatarComponent],
  providers: [],
  templateUrl: "./comment.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input({ required: true }) comment!: CommentDto & { author: UserDto };

  constructor(protected userService: UserService) {}
}

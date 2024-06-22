import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgIcon } from "@ng-icons/core";
import { Store, select } from "@ngrx/store";
import { CommentDto, UserDto } from "common";
import { Observable, map } from "rxjs";
import { CommentsService } from "../../../features/comments/comments.service";
import { UserService } from "../../../features/user/user.service";
import { selectUser } from "../../../state/user/selectors";
import { AvatarComponent } from "../avatar/avatar.component";
import { Option, OptionsComponent } from "../options/options.component";

@Component({
  selector: "app-ui-comment",
  standalone: true,
  imports: [
    AvatarComponent,
    OptionsComponent,
    CommonModule,
    ReactiveFormsModule,
    NgIcon,
  ],
  providers: [],
  templateUrl: "./comment.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent implements OnInit {
  @Input({ required: true }) comment!: CommentDto & { author: UserDto };
  protected userId$: Observable<string | undefined>;

  protected isEditing = signal(false);
  protected changedContent!: FormControl;

  @ViewChild("contentInput")
  private contentInput!: ElementRef<HTMLInputElement>;

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
    protected userService: UserService,
    private store: Store,
    private commentsService: CommentsService,
  ) {
    this.userId$ = this.store.pipe(
      select(selectUser),
      map((user) => user?.id),
    );
  }

  ngOnInit(): void {
    this.changedContent = new FormControl(this.comment.content, {
      validators: [
        Validators.minLength(1),
        Validators.maxLength(512),
        Validators.required,
      ],
    });
  }

  protected onAction(idx: number) {
    switch (idx) {
      case 0:
        this.isEditing.set(true);
        setTimeout(() => this.contentInput.nativeElement.focus(), 10);
        break;
      case 1:
        this.commentsService.deleteComment(this.comment.id);
        break;
    }
  }

  protected onEditsCancel() {
    this.isEditing.set(false);
    this.changedContent.setValue(this.comment.content);
  }

  protected onEditsApproved() {
    const content = this.changedContent.value as string;
    console.log(content);
    this.commentsService.updateComment(this.comment.id, content);
    this.isEditing.set(false);
  }
}

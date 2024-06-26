import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  Signal,
  WritableSignal,
  effect,
  input,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { CommunityDto, UserDto } from "common";
import { map, take, takeWhile } from "rxjs";
import { UserService } from "../../features/user/user.service";
import { selectUser, selectUserCommunities } from "../../state/user/selectors";
import { EditorComponent } from "../editor/editor.component";
import {
  DropdownComponent,
  DropdownItem,
} from "../ui/dropdown/dropdown.component";

@Component({
  selector: "app-post-form",
  standalone: true,
  imports: [
    EditorComponent,
    DropdownComponent,
    CommonModule,
    CdkTextareaAutosize,
    ReactiveFormsModule,
  ],
  providers: [],
  templateUrl: "./post-form.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
  private userCommunities = signal<CommunityDto[]>([]);
  protected publishOptions = signal<DropdownItem[]>([]);
  protected title = new FormControl("", {
    validators: [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(255),
    ],
  });
  private communityId = signal<string | null>(null);
  private currentUser!: Signal<UserDto>;
  canChangeCommunity = input(true);

  @Input() handleSend!: (data: {
    title: string;
    content: string;
    communityId?: string;
    files: File[];
    images: File[];
  }) => void;
  initialDetails = input<{ title: string; content: string } | undefined>();

  constructor(
    private store: Store,
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {
    effect(() => {
      this.title.setValue(this.initialDetails()?.title ?? "");
      this.title.updateValueAndValidity();
      this.cdr.detectChanges();
    });

    this.currentUser = toSignal(
      this.store.pipe(select(selectUser)),
    ) as Signal<UserDto>;

    const userCommunities = this.store.pipe(select(selectUserCommunities));

    this.userCommunities = toSignal(userCommunities) as WritableSignal<
      CommunityDto[]
    >;
    userCommunities
      .pipe(
        takeWhile((communities) => !communities),
        take(1),
      )
      .subscribe(() => this.userService.getCurrentUserCommunities());

    this.publishOptions = toSignal(
      userCommunities.pipe(
        map((communities) =>
          (communities ?? []).map(
            (c) =>
              ({
                label: c.name,
                icon: "lucideUsersRound",
              }) as DropdownItem,
          ),
        ),
        map((communities) => [
          {
            label: this.currentUser().username,
            imageUrl: this.userService.getCurrentUserAvatarUrl(),
            icon: "lucideUserRound",
          },
          ...communities,
        ]),
      ),
    ) as WritableSignal<DropdownItem[]>;
  }

  protected onPublisherSelectionChange(idx: number) {
    // first publisher is current user, thus the community is none
    const communityId =
      idx === 0 ? null : (this.userCommunities().at(idx - 1)?.id as string);

    this.communityId.set(communityId);
  }

  protected handleSendClick({
    content,
    files,
    images,
  }: { content: string; files: File[]; images: File[] }) {
    this.handleSend({
      title: this.title.value as string,
      content,
      communityId: this.communityId() ?? undefined,
      files,
      images,
    });
  }
}

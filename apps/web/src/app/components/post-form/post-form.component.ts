import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	Signal,
	WritableSignal,
	signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { CommunityDto, UserDto } from "common";
import { Observable, map, take, takeWhile, tap } from "rxjs";
import { CommunityService } from "../../features/community/community.service";
import { PostsService } from "../../features/posts/posts.service";
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

	constructor(
		private store: Store,
		private userService: UserService,
		private postsService: PostsService,
		private communityService: CommunityService,
	) {
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
				tap(console.log),
			),
		) as WritableSignal<DropdownItem[]>;
	}

	protected onPublisherSelectionChange(idx: number) {
		// first publisher is current user, thus the community is none
		const communityId =
			idx === 0 ? null : (this.userCommunities().at(idx - 1)?.id as string);

		this.communityId.set(communityId);
	}

	protected handleSend(content: string) {
		this.postsService.createPost(
			// biome-ignore lint/style/noNonNullAssertion: not null
			this.title.value!,
			content,
			[],
			[],
			this.communityId() ?? undefined,
		);
	}
}

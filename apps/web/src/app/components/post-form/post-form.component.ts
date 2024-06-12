import { CdkTextareaAutosize } from "@angular/cdk/text-field";
import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	afterNextRender,
	signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store, select } from "@ngrx/store";
import { CommunityDto } from "common";
import { Observable, map, take, takeWhile } from "rxjs";
import { CommunityService } from "../../features/community/community.service";
import { PostsService } from "../../features/posts/posts.service";
import { UserService } from "../../features/user/user.service";
import { selectUserCommunities } from "../../state/user/selectors";
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
	private userCommunities$!: Observable<CommunityDto[] | null>;
	protected publishOptions$!: Observable<DropdownItem[]>;
	protected title = new FormControl("", {
		validators: [
			Validators.required,
			Validators.minLength(1),
			Validators.maxLength(255),
		],
	});
	private community = signal<string | null>(null);

	constructor(
		private store: Store,
		private userService: UserService,
		private postsService: PostsService,
		private communityService: CommunityService,
		private cdr: ChangeDetectorRef,
	) {
		afterNextRender(() => {
			this.userCommunities$ = this.store.pipe(select(selectUserCommunities));
			this.userCommunities$
				.pipe(
					takeWhile((communities) => !communities),
					take(1),
				)
				.subscribe(() => this.userService.getCurrentUserCommunities());

			this.publishOptions$ = this.userCommunities$.pipe(
				map((communities) =>
					(communities ?? []).map(
						(c) =>
							({
								label: c.name,
								imageUrl: this.communityService.getCommunityIconUrl(c.id),
							}) as DropdownItem,
					),
				),
			);

			this.publishOptions$.subscribe(() => this.cdr.detectChanges());
		});
	}

	protected handleSend(content: string) {
		this.postsService.createPost(
			// biome-ignore lint/style/noNonNullAssertion: not null
			this.title.value!,
			content,
			[],
			[],
			this.community() ?? undefined,
		);
	}
}

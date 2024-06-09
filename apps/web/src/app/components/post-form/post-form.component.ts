import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	afterNextRender,
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { CommunityDto } from "common";
import { Observable, map, take, takeWhile } from "rxjs";
import { CommunityService } from "../../features/community/community.service";
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
	imports: [EditorComponent, DropdownComponent, CommonModule],
	providers: [],
	templateUrl: "./post-form.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {
	private userCommunities$!: Observable<CommunityDto[] | null>;
	protected publishOptions$!: Observable<DropdownItem[]>;

	constructor(
		private store: Store,
		private userService: UserService,
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
}

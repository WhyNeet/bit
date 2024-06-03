import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostBinding } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Observable, map } from "rxjs";
import { PostFormComponent } from "../../components/post-form/post-form.component";
import { selectUser } from "../../state/user/selectors";

@Component({
	selector: "app-page-home",
	standalone: true,
	imports: [PostFormComponent, CommonModule],
	providers: [],
	templateUrl: "./home.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	@HostBinding() class = "flex-auto";
	protected isLoggedIn: Observable<boolean>;

	constructor(private store: Store) {
		this.isLoggedIn = this.store.pipe(
			select(selectUser),
			map((user) => !!user),
		);
	}
}

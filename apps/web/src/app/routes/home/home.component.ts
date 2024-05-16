import { ChangeDetectionStrategy, Component, HostBinding } from "@angular/core";
import { PostFormComponent } from "../../components/post-form/post-form.component";

@Component({
	selector: "app-page-home",
	standalone: true,
	imports: [PostFormComponent],
	providers: [],
	templateUrl: "./home.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
	@HostBinding() class = "flex-auto";
}

import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-page-home",
	standalone: true,
	imports: [],
	providers: [],
	templateUrl: "./home.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}

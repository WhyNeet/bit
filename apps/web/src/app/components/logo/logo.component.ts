import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-logo",
	standalone: true,
	imports: [],
	providers: [],
	templateUrl: "./logo.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {}

import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LogoComponent } from "../logo/logo.component";

@Component({
	selector: "app-header",
	standalone: true,
	imports: [LogoComponent],
	providers: [],
	templateUrl: "./header.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}

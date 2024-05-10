import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideSearch } from "@ng-icons/lucide";
import { LogoComponent } from "../logo/logo.component";

@Component({
	selector: "app-header",
	standalone: true,
	imports: [LogoComponent, NgIcon],
	providers: [],
	viewProviders: [provideIcons({ lucideSearch })],
	templateUrl: "./header.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {}

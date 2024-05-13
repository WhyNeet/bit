import {
	ChangeDetectionStrategy,
	Component,
	afterNextRender,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { environment } from "../environments/environment";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AuthService } from "./features/auth/auth.service";
import { API_BASE_URL } from "./misc/tokens";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, SidebarComponent, HeaderComponent],
	providers: [
		AuthService,
		{ provide: API_BASE_URL, useValue: environment.API_BASE_URL },
	],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	constructor(private authService: AuthService) {
		afterNextRender(() => this.authService.getCurrentUser());
	}
}

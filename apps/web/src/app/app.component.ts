import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AuthService } from "./features/auth/auth.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, SidebarComponent, HeaderComponent],
	providers: [AuthService],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	constructor(private authService: AuthService) {
		this.authService.getCurrentUser();
	}
}

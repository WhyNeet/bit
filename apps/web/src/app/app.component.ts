import {
	ChangeDetectionStrategy,
	Component,
	afterNextRender,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { AuthService } from "./features/auth/auth.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, SidebarComponent],
	providers: [AuthService],
	templateUrl: "./app.component.html",
	styleUrl: "./app.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
	constructor(private authService: AuthService) {
		afterNextRender(() => this.authService.getCurrentUser());
	}
}

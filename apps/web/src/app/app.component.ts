import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./features/auth/auth.service";

@Component({
	selector: "app-root",
	standalone: true,
	imports: [RouterOutlet, CommonModule],
	providers: [AuthService],
	templateUrl: "./app.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}

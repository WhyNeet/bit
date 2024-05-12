import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { AuthDialogLoginComponent } from "./login/auth-dialog-login.component";
import { AuthDialogSignupComponent } from "./signup/auth-dialog-signup.component";

@Component({
	selector: "app-dialog-auth",
	standalone: true,
	imports: [AuthDialogLoginComponent, AuthDialogSignupComponent],
	providers: [],
	templateUrl: "./auth-dialog.component.html",
	styleUrl: "./auth-dialog.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {
	protected isLogin = signal(true);
}

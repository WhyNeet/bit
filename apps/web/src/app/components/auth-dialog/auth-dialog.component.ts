import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-dialog-auth",
	standalone: true,
	imports: [],
	providers: [],
	templateUrl: "./auth-dialog.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {}

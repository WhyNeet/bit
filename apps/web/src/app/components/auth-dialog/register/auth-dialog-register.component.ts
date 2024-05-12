import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-dialog-auth-signup",
	standalone: true,
	imports: [],
	providers: [],
	template: `
		register
    `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogSignupComponent {}

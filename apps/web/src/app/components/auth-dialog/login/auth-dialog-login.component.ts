import { CdkStep, CdkStepLabel } from "@angular/cdk/stepper";
import { ChangeDetectionStrategy, Component, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { StepperComponent } from "../../ui/stepper/stepper.component";

@Component({
	selector: "app-dialog-auth-login",
	standalone: true,
	imports: [StepperComponent, CdkStep, CdkStepLabel, ReactiveFormsModule],
	providers: [],
	templateUrl: "./auth-dialog-login.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogLoginComponent {
	protected email = new FormControl("", {
		validators: [Validators.email, Validators.required],
	});
	protected password = new FormControl("", {
		validators: [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(72),
		],
	});
}

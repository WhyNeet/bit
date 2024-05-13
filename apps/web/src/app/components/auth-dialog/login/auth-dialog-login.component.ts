import { CommonModule } from "@angular/common";
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	OnDestroy,
	OnInit,
	signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { ErrorResponse, UserCredentialsDto } from "common";
import { Observable, Subject, Subscription, filter, map } from "rxjs";
import { appear } from "../../../animations/appear.animation";
import { disappear } from "../../../animations/disappear.animation";
import { dynamicHeight } from "../../../animations/height.animation";
import { AuthService } from "../../../features/auth/auth.service";
import { SessionStorageService } from "../../../features/storage/session-storage.service";
import { ProgressSpinnerComponent } from "../../ui/progress-spinner/progress-spinner.component";

@Component({
	selector: "app-dialog-auth-login",
	standalone: true,
	imports: [ReactiveFormsModule, CommonModule, ProgressSpinnerComponent],
	providers: [SessionStorageService],
	animations: [dynamicHeight, appear, disappear],
	templateUrl: "./auth-dialog-login.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogLoginComponent implements OnInit, OnDestroy {
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

	protected error$: Observable<ErrorResponse | null>;
	protected isLoading = signal(false);

	constructor(
		private sessionStorage: SessionStorageService,
		private authService: AuthService,
	) {
		this.error$ = this.authService.getError();
	}

	protected login() {
		if (this.email.invalid || this.password.invalid) return;

		this.isLoading.set(true);

		this.authService.login(
			new UserCredentialsDto(
				this.email.value as string,
				this.password.value as string,
			),
		);
	}

	private sub?: Subscription;

	ngOnInit(): void {
		this.email.setValue(this.sessionStorage.getItem("email") ?? "");

		this.sub = this.error$.subscribe((e) =>
			e ? this.isLoading.set(false) : null,
		);
	}

	ngOnDestroy(): void {
		this.sessionStorage.setItem("email", this.email.value ?? "");
		this.sub?.unsubscribe();
	}
}

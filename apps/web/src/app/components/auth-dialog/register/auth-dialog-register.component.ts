import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { SessionStorageService } from "../../../features/storage/session-storage.service";

@Component({
	selector: "app-dialog-auth-signup",
	standalone: true,
	imports: [ReactiveFormsModule],
	providers: [SessionStorageService],
	templateUrl: "./auth-dialog-register.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogSignupComponent implements OnInit, OnDestroy {
	protected email = new FormControl("", {
		validators: [Validators.email, Validators.required],
	});

	protected username = new FormControl("", {
		validators: [
			Validators.required,
			Validators.minLength(2),
			Validators.maxLength(32),
			Validators.pattern(/^[0-9A-Za-z_-]{2,32}$/),
		],
	});

	protected password = new FormControl("", {
		validators: [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(72),
		],
	});

	protected name = new FormControl("", {
		validators: [
			Validators.required,
			Validators.minLength(2),
			Validators.maxLength(64),
		],
	});

	constructor(private sessionStorage: SessionStorageService) {}

	ngOnInit(): void {
		this.email.setValue(this.sessionStorage.getItem("email") ?? "");
		this.name.setValue(this.sessionStorage.getItem("name") ?? "");
		this.username.setValue(this.sessionStorage.getItem("username") ?? "");
	}

	ngOnDestroy(): void {
		this.sessionStorage.setItem("email", this.email.value ?? "");
		this.sessionStorage.setItem("username", this.username.value ?? "");
		this.sessionStorage.setItem("name", this.name.value ?? "");
	}
}

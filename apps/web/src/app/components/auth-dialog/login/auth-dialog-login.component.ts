import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	OnInit,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { SessionStorageService } from "../../../features/storage/session-storage.service";

@Component({
	selector: "app-dialog-auth-login",
	standalone: true,
	imports: [ReactiveFormsModule],
	providers: [SessionStorageService],
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

	constructor(private sessionStorage: SessionStorageService) {}

	ngOnInit(): void {
		this.email.setValue(this.sessionStorage.getItem("email") ?? "");
	}

	ngOnDestroy(): void {
		this.sessionStorage.setItem("email", this.email.value ?? "");
	}
}

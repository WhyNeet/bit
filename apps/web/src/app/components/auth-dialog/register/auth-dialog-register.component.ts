import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { CreateUserDto, ErrorResponse } from "common";
import { Observable, Subscription } from "rxjs";
import { appear } from "../../../animations/appear.animation";
import { disappear } from "../../../animations/disappear.animation";
import { dynamicHeight } from "../../../animations/height.animation";
import { label } from "../../../animations/label.animation";
import { AuthService } from "../../../features/auth/auth.service";
import { SessionStorageService } from "../../../features/storage/session-storage.service";
import { ErrorLabelDirective } from "../../ui/form/error-label/error-label.directive";
import { ProgressSpinnerComponent } from "../../ui/progress-spinner/progress-spinner.component";

@Component({
  selector: "app-dialog-auth-signup",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ProgressSpinnerComponent,
    CommonModule,
    ErrorLabelDirective,
  ],
  providers: [SessionStorageService],
  animations: [dynamicHeight, appear, disappear, label],
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

  protected error$: Observable<ErrorResponse | null>;
  protected isLoading = signal(false);

  constructor(
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
  ) {
    this.error$ = this.authService.getError();
  }

  protected register() {
    if (
      this.email.invalid ||
      this.password.invalid ||
      this.name.invalid ||
      this.username.invalid
    )
      return;

    this.isLoading.set(true);

    this.authService.register(
      new CreateUserDto(
        this.email.value as string,
        this.username.value as string,
        this.password.value as string,
        this.name.value as string,
      ),
    );
  }

  private sub?: Subscription;

  ngOnInit(): void {
    this.email.setValue(this.sessionStorage.getItem("email") ?? "");
    this.name.setValue(this.sessionStorage.getItem("name") ?? "");
    this.username.setValue(this.sessionStorage.getItem("username") ?? "");

    this.sub = this.error$.subscribe((e) =>
      e ? this.isLoading.set(false) : null,
    );
  }

  ngOnDestroy(): void {
    this.sessionStorage.setItem("email", this.email.value ?? "");
    this.sessionStorage.setItem("username", this.username.value ?? "");
    this.sessionStorage.setItem("name", this.name.value ?? "");

    this.sub?.unsubscribe();
  }
}

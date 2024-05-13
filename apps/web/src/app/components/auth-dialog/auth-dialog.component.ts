import {
	ChangeDetectionStrategy,
	Component,
	afterNextRender,
	computed,
	signal,
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { map } from "rxjs";
import { heightChangeAnmation } from "../../animations/height.animation";
import { selectUser } from "../../state/user/selectors";
import { AnimatedDialogRef } from "../ui/dialog-container/dialog-animated-ref";
import { DialogContent } from "../ui/dialog-container/dialog-content.component";
import { TabComponent } from "../ui/tabs/tab/tab.component";
import { TabsComponent } from "../ui/tabs/tabs.component";
import { AuthDialogLoginComponent } from "./login/auth-dialog-login.component";
import { AuthDialogSignupComponent } from "./register/auth-dialog-register.component";

@Component({
	selector: "app-dialog-auth",
	standalone: true,
	imports: [
		AuthDialogLoginComponent,
		AuthDialogSignupComponent,
		TabsComponent,
		TabComponent,
		DialogContent,
	],
	providers: [],
	animations: [heightChangeAnmation],
	templateUrl: "./auth-dialog.component.html",
	styleUrl: "./auth-dialog.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {
	protected tab = signal(0);
	protected enterStart = computed(() => (this.tab() === 1 ? "100%" : "-100%"));
	protected leaveEnd = computed(() => (this.tab() === 1 ? "-100%" : "100%"));

	constructor(
		private store: Store,
		private dialogRef: AnimatedDialogRef<unknown>,
	) {
		afterNextRender(() => {
			this.store
				.pipe(
					select(selectUser),
					map((user) => !!user),
				)
				.subscribe((hasUser) => (hasUser ? this.dialogRef.close() : null));
		});
	}
}

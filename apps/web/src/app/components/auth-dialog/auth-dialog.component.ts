import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from "@angular/core";
import { heightChangeAnmation } from "../../animations/height.animation";
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
}

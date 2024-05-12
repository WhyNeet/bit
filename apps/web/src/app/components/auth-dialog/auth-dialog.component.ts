import {
	animate,
	group,
	query,
	style,
	transition,
	trigger,
} from "@angular/animations";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	signal,
} from "@angular/core";
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
	animations: [
		trigger("paneChange", [
			transition(
				"* => *",
				[
					query(":self", [style({ height: "{{startHeight}}px" })]),
					query(":enter", [
						style({
							opacity: 0,
							transform: "translateX({{enterStart}})",
						}),
					]),
					query(
						":leave",
						[
							style({
								opacity: 1,
								position: "absolute",
								transform: "translateX(0)",
							}),
							animate(
								"0.2s ease-in-out",
								style({
									opacity: 0,
									transform: "translateX({{leaveEnd}})",
								}),
							),
						],
						{ optional: true },
					),
					group(
						[
							query(":self", [
								animate("0.2s ease-in-out", style({ height: "*" })),
							]),
							query(":enter", [
								animate(
									"0.2s ease-in-out",
									style({ opacity: 1, transform: "translateX(0)" }),
								),
							]),
						],
						{ params: { startHeight: 0 } },
					),
				],
				{ params: { enterStart: "", leaveEnd: "" } },
			),
		]),
	],
	templateUrl: "./auth-dialog.component.html",
	styleUrl: "./auth-dialog.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthDialogComponent {
	protected tab = signal(0);
	protected enterStart = computed(() => (this.tab() === 1 ? "100%" : "-100%"));
	protected leaveEnd = computed(() => (this.tab() === 1 ? "-100%" : "100%"));
}

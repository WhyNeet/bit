import { Dialog } from "@angular/cdk/dialog";
import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ViewEncapsulation,
} from "@angular/core";
import { AuthDialogComponent } from "../auth-dialog/auth-dialog.component";

@Component({
	selector: "app-auth-button",
	standalone: true,
	imports: [],
	providers: [],
	template: `
        <button [classList]="class" (click)="openAuthDialog()">
            <ng-content />
        </button>
    `,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
})
export class AuthButtonComponent {
	@Input() class = "";

	constructor(private dialog: Dialog) {}

	protected openAuthDialog() {
		this.dialog.open(AuthDialogComponent, {});
	}
}

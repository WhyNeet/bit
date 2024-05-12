import { Dialog, DialogRef } from "@angular/cdk/dialog";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { AuthDialogComponent } from "../auth-dialog/auth-dialog.component";
import { AnimatedDialogRef } from "../ui/dialog-container/dialog-animated-ref";
import { DialogContainerComponent } from "../ui/dialog-container/dialog-container.component";

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
})
export class AuthButtonComponent {
	@Input() class = "";

	constructor(private dialog: Dialog) {}

	protected openAuthDialog() {
		let animatedDialogRef: AnimatedDialogRef;

		const ref = this.dialog.open<unknown>(AuthDialogComponent, {
			container: DialogContainerComponent,
			disableClose: true,
			closeOnOverlayDetachments: true,
			providers(dialogRef, config, container) {
				animatedDialogRef = new AnimatedDialogRef(dialogRef);
				return [
					{
						provide: AnimatedDialogRef,
						useValue: animatedDialogRef,
					},
				];
			},
		});
	}
}

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DialogService } from "../../features/dialog/dialog.service";
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
})
export class AuthButtonComponent {
  @Input() class = "";

  constructor(private dialogService: DialogService) {}

  protected openAuthDialog() {
    this.dialogService.open(AuthDialogComponent);
  }
}

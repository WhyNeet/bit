import { Dialog } from "@angular/cdk/dialog";
import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { AnimatedDialogRef } from "../../components/ui/dialog-container/dialog-animated-ref";
import { DialogContainerComponent } from "../../components/ui/dialog-container/dialog-container.component";

@Injectable({ providedIn: "root" })
export class DialogService {
  constructor(private dialog: Dialog) {}

  public open(component: ComponentType<unknown>) {
    let animatedDialogRef: AnimatedDialogRef<unknown>;

    const ref = this.dialog.open<unknown>(component, {
      container: DialogContainerComponent,
      disableClose: true,
      closeOnOverlayDetachments: true,
      providers(dialogRef, _config, _container) {
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

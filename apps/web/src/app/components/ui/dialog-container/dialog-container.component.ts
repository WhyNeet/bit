import { AnimationEvent } from "@angular/animations";
import { CdkDialogContainer, DialogModule } from "@angular/cdk/dialog";
import { CdkPortalOutlet } from "@angular/cdk/portal";
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  ViewEncapsulation,
} from "@angular/core";
import { EventEmitter } from "@angular/core";
import { dialogAnimations } from "../../../animations/dialog.animation";

@Component({
  selector: "app-ui-dialog-container",
  standalone: true,
  imports: [DialogModule, CdkPortalOutlet],
  providers: [],
  animations: [dialogAnimations],
  template: `
        <ng-template cdkPortalOutlet />
    `,
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class DialogContainerComponent extends CdkDialogContainer {
  @HostBinding() class =
    "block rounded-default bg-background border border-text/10 relative min-w-96";

  @HostBinding("@dialogEnterLeave")
  protected animationState: "void" | "open" | "closed" = "open";

  animationStateChanged = new EventEmitter<AnimationEvent>();

  @HostListener("@dialogEnterLeave.start", ["$event"])
  onAnimationStart($event: AnimationEvent) {
    this.animationStateChanged.emit($event);
  }

  @HostListener("@dialogEnterLeave.done", ["$event"])
  onAnimationDone($event: AnimationEvent) {
    this.animationStateChanged.emit($event);
  }

  startExitAnimation() {
    this.animationState = "closed";
  }
}

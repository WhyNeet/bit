import { AnimationEvent } from "@angular/animations";
import { CdkDialogContainer, DialogModule } from "@angular/cdk/dialog";
import { PortalModule } from "@angular/cdk/portal";
import {
	ChangeDetectionStrategy,
	Component,
	HostBinding,
	HostListener,
} from "@angular/core";
import { EventEmitter } from "@angular/core";
import { dialogAnimations } from "../../../animations/dialog.animations";

@Component({
	selector: "app-ui-dialog-container",
	standalone: true,
	imports: [DialogModule, PortalModule],
	providers: [],
	animations: [dialogAnimations],
	template: `
        <div class="p-6 rounded-default bg-background border border-text/10">
            <ng-template cdkPortalOutlet></ng-template>
        </div>
    `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogContainerComponent extends CdkDialogContainer {
	@HostBinding("@dialogEnterLeave")
	private animationState: "void" | "open" | "closed" = "open";

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

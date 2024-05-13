import { DialogRef } from "@angular/cdk/dialog";
import { hasModifierKey } from "@angular/cdk/keycodes";
import { Injectable } from "@angular/core";
import { filter, take } from "rxjs";
import { DialogContainerComponent } from "./dialog-container.component";

@Injectable({ providedIn: "root" })
export class AnimatedDialogRef<R> {
	constructor(private dialogRef: DialogRef<R, unknown>) {
		dialogRef.backdropClick.pipe(take(1)).subscribe(() => this.close());

		dialogRef.keydownEvents
			.pipe(
				filter((evt) => evt.key === "Escape" && !hasModifierKey(evt)),
				take(1),
			)
			.subscribe((evt) => {
				evt.stopPropagation();
				this.close();
			});
	}

	public close(result?: R) {
		const containerInstance = this.dialogRef
			.containerInstance as DialogContainerComponent;

		containerInstance.animationStateChanged
			.pipe(
				filter((evt) => evt.phaseName === "start"),
				take(1),
			)
			.subscribe(() => this.dialogRef.overlayRef.detachBackdrop());

		containerInstance.animationStateChanged
			.pipe(
				filter((evt) => evt.phaseName === "done" && evt.toState === "closed"),
				take(1),
			)
			.subscribe(() => this.dialogRef.close(result));

		containerInstance.startExitAnimation();
	}
}

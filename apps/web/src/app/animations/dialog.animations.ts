import {
	animate,
	state,
	style,
	transition,
	trigger,
} from "@angular/animations";

export const dialogAnimations = trigger("dialogEnterLeave", [
	state("void", style({ opacity: 0, scale: 1.5 })),
	state("open", style({ opacity: 1, scale: 1 })),
	state("closed", style({ opacity: 0, scale: 1.5 })),
	transition("void => open", [animate("150ms ease-in-out")]),
	transition("open => closed", [animate("150ms ease-in-out")]),
]);

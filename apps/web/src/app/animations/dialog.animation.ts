import {
	animate,
	state,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { cubic, quart } from "./easings";

export const dialogAnimations = trigger("dialogEnterLeave", [
	state("void", style({ opacity: 0, scale: 1.03 })),
	state("open", style({ opacity: 1, scale: 1 })),
	state("closed", style({ opacity: 0, scale: 1.03 })),
	transition("void => open", [animate(`150ms ${cubic}`)]),
	transition("open => closed", [animate(`150ms ${cubic}`)]),
]);

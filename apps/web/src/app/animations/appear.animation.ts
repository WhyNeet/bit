import { animate, style, transition, trigger } from "@angular/animations";
import { sine } from "./easings";

export const appear = trigger("appear", [
	transition(":enter", [
		style({ opacity: 0, scale: 0.95 }),
		animate("150ms ease-in-out", style({ opacity: 1, scale: 1 })),
	]),
]);

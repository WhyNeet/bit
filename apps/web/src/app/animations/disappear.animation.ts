import { animate, style, transition, trigger } from "@angular/animations";

export const disappear = trigger("disappear", [
  transition(":leave", [
    style({ opacity: 1, scale: 1 }),
    animate("150ms ease-in-out", style({ opacity: 0, scale: 0.95 })),
  ]),
]);

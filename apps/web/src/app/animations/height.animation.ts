import {
	animate,
	group,
	query,
	style,
	transition,
	trigger,
} from "@angular/animations";

export const heightChangeAnmation = trigger("heightChange", [
	transition(
		"* => *",
		[
			query(":self", [style({ height: "{{startHeight}}px" })]),
			query(":enter", [
				style({
					opacity: 0,
					transform: "translateX({{enterStart}})",
				}),
			]),
			query(
				":leave",
				[
					style({
						opacity: 1,
						position: "absolute",
						transform: "translateX(0)",
					}),
					animate(
						"0.2s ease-in-out",
						style({
							opacity: 0,
							transform: "translateX({{leaveEnd}})",
						}),
					),
				],
				{ optional: true },
			),
			group(
				[
					query(":self", [animate("0.2s ease-in-out", style({ height: "*" }))]),
					query(":enter", [
						animate(
							"0.2s ease-in-out",
							style({ opacity: 1, transform: "translateX(0)" }),
						),
					]),
				],
				{ params: { startHeight: 0 } },
			),
		],
		{ params: { enterStart: "0", leaveEnd: "0" } },
	),
]);

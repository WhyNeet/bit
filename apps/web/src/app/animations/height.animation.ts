import {
	animate,
	group,
	query,
	style,
	transition,
	trigger,
} from "@angular/animations";
import { cubic, sine } from "./easings";

export const heightChangeAnmation = trigger("heightChange", [
	transition(
		"* => *",
		[
			query(":self", [style({ height: "{{startHeight}}px" })]),
			query(
				":enter",
				[
					style({
						opacity: 0,
						transform: "translateX({{enterStart}})",
					}),
				],
				{ optional: true },
			),
			query(
				":leave",
				[
					style({
						opacity: 1,
						position: "absolute",
						transform: "translateX(0)",
					}),
					animate(
						`150ms ${sine}`,
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
					query(":self", [animate(`150ms ${sine}`, style({ height: "*" }))]),
					query(
						":enter",
						[
							animate(
								`150ms ${sine}`,
								style({ opacity: 1, transform: "translateX(0)" }),
							),
						],
						{ optional: true },
					),
				],
				{ params: { startHeight: 0 } },
			),
		],
		{ params: { enterStart: "0", leaveEnd: "0" } },
	),
]);

export const dynamicHeight = trigger("dynamicHeight", [
	transition(
		"* <=> *",
		[
			query(":self", [
				style({ height: "{{startHeight}}px" }),
				animate(`150ms ${sine}`, style({ height: "*" })),
			]),
		],
		{ params: { startHeigth: 0 } },
	),
]);

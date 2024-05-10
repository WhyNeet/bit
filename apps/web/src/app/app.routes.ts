import { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "home",
		loadComponent: () =>
			import("./routes/home/home.component").then((m) => m.HomeComponent),
	},
	{
		path: "auth",
		children: [
			{
				path: "sign-in",
				loadComponent: () =>
					import("./routes/sign-in/sign-in.component").then(
						(m) => m.SignInComponent,
					),
			},
		],
	},
	{
		path: "",
		redirectTo: "home",
		pathMatch: "full",
	},
];

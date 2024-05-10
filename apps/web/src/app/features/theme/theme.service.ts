import { Injectable, afterNextRender } from "@angular/core";
import { Theme } from "./theme.interface";

@Injectable({
	providedIn: "root",
})
export class ThemeService {
	private currentTheme!: Theme;

	constructor() {
		afterNextRender(() => {
			this.currentTheme = (localStorage.getItem("theme") ?? "dark") as Theme;
		});
	}

	public setTheme(theme: Theme) {
		theme === "light"
			? document.documentElement.classList.remove("dark")
			: document.documentElement.classList.add("dark");

		this.currentTheme = theme;
		localStorage.setItem("theme", this.currentTheme);
	}

	public getCurrentTheme(): Theme {
		return this.currentTheme;
	}
}

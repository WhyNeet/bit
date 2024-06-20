import { Injectable, afterNextRender } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Theme } from "./theme.interface";

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private currentTheme!: BehaviorSubject<Theme>;

  constructor() {
    afterNextRender(() => {
      this.currentTheme = new BehaviorSubject(
        (localStorage.getItem("theme") ?? "dark") as Theme,
      );

      this.currentTheme.subscribe((theme) => {
        localStorage.setItem("theme", theme);

        theme === "light"
          ? document.documentElement.classList.remove("dark")
          : document.documentElement.classList.add("dark");
      });
    });
  }

  public setTheme(theme: Theme) {
    this.currentTheme.next(theme);
  }

  public toggleTheme() {
    const nextTheme: Theme =
      this.currentTheme.getValue() === "light" ? "dark" : "light";
    this.currentTheme.next(nextTheme);
  }

  public getCurrentTheme(): Observable<Theme> {
    return this.currentTheme;
  }
}

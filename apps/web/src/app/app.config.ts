import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideClientHydration } from "@angular/platform-browser";
import { provideStore } from "@ngrx/store";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
	providers: [provideRouter(routes), provideClientHydration(), provideStore()],
};

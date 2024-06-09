import { ApplicationConfig, isDevMode } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideHttpClient } from "@angular/common/http";
import {
	provideClientHydration,
	withHttpTransferCacheOptions,
} from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideNgIconLoader, withCaching } from "@ng-icons/core";
import { provideStore } from "@ngrx/store";
import { provideStoreDevtools } from "@ngrx/store-devtools";
import { routes } from "./app.routes";
import { reducers } from "./state";

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideClientHydration(
			withHttpTransferCacheOptions({
				includePostRequests: true,
			}),
		),
		provideStore(reducers),
		provideHttpClient(),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
		provideAnimations(),
		provideNgIconLoader(async (name) => {
			return (await import("@ng-icons/lucide"))[name] as string;
		}, withCaching()),
	],
};

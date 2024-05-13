import { CommonModule, NgOptimizedImage } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	afterNextRender,
} from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
	lucideBell,
	lucideCog,
	lucideHome,
	lucideLogIn,
	lucideMessageCircle,
	lucideUserRound,
} from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { UserDto } from "common";
import { Observable, map } from "rxjs";
import { ThemeService } from "../../features/theme/theme.service";
import { UserService } from "../../features/user/user.service";
import { selectIsUserLoading, selectUser } from "../../state/user/selectors";
import { AuthButtonComponent } from "../auth-button/auth-button.component";
import { LogoComponent } from "../logo/logo.component";
import { SkeletonComponent } from "../ui/skeleton/skeleton.component";
import { SwitchComponent } from "../ui/switch/switch.component";

@Component({
	selector: "app-sidebar",
	standalone: true,
	imports: [
		RouterLink,
		RouterLinkActive,
		LogoComponent,
		NgIcon,
		CommonModule,
		SwitchComponent,
		SkeletonComponent,
		AuthButtonComponent,
		NgOptimizedImage,
	],
	providers: [ThemeService, UserService],
	viewProviders: [
		provideIcons({
			lucideHome,
			lucideMessageCircle,
			lucideBell,
			lucideCog,
			lucideLogIn,
			lucideUserRound,
		}),
	],
	templateUrl: "./sidebar.component.html",
	styleUrl: "./sidebar.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
	protected user$: Observable<UserDto | null>;
	protected isUserLoading$: Observable<boolean>;
	protected isDarkTheme$!: Observable<boolean>;

	constructor(
		private store: Store,
		private themeService: ThemeService,
		protected userService: UserService,
	) {
		this.user$ = this.store.pipe(select(selectUser));
		this.isUserLoading$ = this.store.pipe(select(selectIsUserLoading));

		afterNextRender(() => {
			this.isDarkTheme$ = this.themeService
				.getCurrentTheme()
				.pipe(map((theme) => theme === "dark"));
		});
	}

	protected toggleTheme() {
		this.themeService.toggleTheme();
	}
}

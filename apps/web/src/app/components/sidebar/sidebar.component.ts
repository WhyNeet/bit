import { CommonModule } from "@angular/common";
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
	lucideMessageCircle,
} from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { UserDto } from "common";
import { Observable, map } from "rxjs";
import { ThemeService } from "../../features/theme/theme.service";
import { selectUser } from "../../state/user/selectors";
import { LogoComponent } from "../logo/logo.component";
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
	],
	providers: [ThemeService],
	viewProviders: [
		provideIcons({ lucideHome, lucideMessageCircle, lucideBell, lucideCog }),
	],
	templateUrl: "./sidebar.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
	protected user$: Observable<UserDto | null>;
	protected isDarkTheme$!: Observable<boolean>;

	constructor(
		private store: Store,
		private themeService: ThemeService,
	) {
		this.user$ = this.store.pipe(select(selectUser));

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

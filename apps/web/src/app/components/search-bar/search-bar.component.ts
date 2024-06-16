import {
	ChangeDetectionStrategy,
	Component,
	HostListener,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideCommand } from "@ng-icons/lucide";
import { DialogService } from "../../features/dialog/dialog.service";
import { SearchPanelComponent } from "../search-panel/search-panel.component";
import { GradientBlurComponent } from "../ui/blur/gradient-blur.component";
import { KBDComponent } from "../ui/kbd/kbd.component";

@Component({
	selector: "app-search-bar",
	standalone: true,
	imports: [KBDComponent, GradientBlurComponent, NgIcon],
	providers: [],
	viewProviders: [provideIcons({ lucideCommand })],
	templateUrl: "./search-bar.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarComponent {
	constructor(private dialogService: DialogService) {}

	protected openSearch() {
		this.dialogService.open(SearchPanelComponent);
	}

	@HostListener("document:keydown.meta.k", ["$event"])
	protected handleOpenSearchHotkey(event: Event) {
		event.preventDefault();
		this.openSearch();
	}
}

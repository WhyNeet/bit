import { CdkConnectedOverlay, CdkOverlayOrigin } from "@angular/cdk/overlay";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	input,
	output,
	signal,
} from "@angular/core";
import { NgIcon, injectNgIconLoader, provideIcons } from "@ng-icons/core";
import { lucideChevronDown } from "@ng-icons/lucide";
import { AvatarComponent } from "../avatar/avatar.component";
import { DropdownItemComponent } from "./dropdown-item.component";

export type DropdownItem =
	| { label: string; icon: string }
	| { label: string; imageUrl: string };

@Component({
	selector: "app-ui-dropdown",
	standalone: true,
	imports: [
		CdkOverlayOrigin,
		CdkConnectedOverlay,
		DropdownItemComponent,
		NgIcon,
		AvatarComponent,
	],
	providers: [],
	viewProviders: [provideIcons({ lucideChevronDown })],
	templateUrl: "./dropdown.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
	items = input.required<DropdownItem[] | null>();
	onSelectionChange = output<number>();

	protected currentItemIndex = signal(0);
	protected currentItem = computed(
		() => this.items()?.[this.currentItemIndex()],
	);

	protected isOpen = signal(false);

	// biome-ignore lint/style/noNonNullAssertion: not null
	protected loadIcon = injectNgIconLoader()!;

	protected toggle() {
		this.isOpen.set(!this.isOpen());
	}

	protected isWithIcon(
		item: DropdownItem | undefined,
	): item is { label: string; icon: string } {
		return typeof (item as Record<string, string>)?.["icon"] === "string";
	}

	protected isWithImage(
		item: DropdownItem | undefined,
	): item is { label: string; imageUrl: string } {
		return typeof (item as Record<string, string>)?.["imageUrl"] === "string";
	}

	protected setCurrentItem(idx: number) {
		this.currentItemIndex.set(idx);
		this.onSelectionChange.emit(this.currentItemIndex());
		this.isOpen.set(false);
	}
}

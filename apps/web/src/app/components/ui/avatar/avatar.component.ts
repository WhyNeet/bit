import { NgOptimizedImage } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideUserRound } from "@ng-icons/lucide";

@Component({
	selector: "app-ui-avatar",
	standalone: true,
	imports: [NgOptimizedImage, NgIcon],
	providers: [],
	viewProviders: [provideIcons({ lucideUserRound })],
	template: `
  <div [style]="{ height: (size() ?? 24) + 'px' }" class="relative flex items-center justify-center aspect-square rounded-full {{ withBackground() ? 'bg-text/5' : '' }}">
    <ng-icon size="24" name="lucideUserRound" />
    <img [ngSrc]="src()" class="absolute inset-0 rounded-full" [height]="iconSize()" [width]="iconSize()" onerror="this.style.display='none'" />
  </div>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
	src = input.required<string>();
	size = input<number>();
	withBackground = input<boolean>();

	protected iconSize = computed(() => {
		return (this.size() ?? 24).toString();
	});
}

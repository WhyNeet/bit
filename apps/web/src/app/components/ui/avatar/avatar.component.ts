import { NgOptimizedImage } from "@angular/common";
import {
	ChangeDetectionStrategy,
	Component,
	OnInit,
	computed,
	input,
	signal,
} from "@angular/core";
import { NgIcon, injectNgIconLoader, provideIcons } from "@ng-icons/core";
import { lucideUserRound } from "@ng-icons/lucide";

@Component({
	selector: "app-ui-avatar",
	standalone: true,
	imports: [NgOptimizedImage, NgIcon],
	providers: [],
	viewProviders: [provideIcons({ lucideUserRound })],
	template: `
  <div [style]="{ height: (size() ?? 24) + 'px' }" class="relative flex items-center justify-center aspect-square rounded-full {{ withBackground() ? 'bg-text/5' : '' }}">
    @if (customIcon()) {
      <ng-icon size="24" [svg]="customSvg()" />
    } @else {
      <ng-icon size="24" name="lucideUserRound" />
    }
    <img [ngSrc]="src()" class="absolute inset-0 rounded-full" [height]="iconSize()" [width]="iconSize()" onerror="this.style.display='none'" />
  </div>
  `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent implements OnInit {
	src = input.required<string>();
	size = input<number>();
	withBackground = input<boolean>();
	customIcon = input<string>();

	// biome-ignore lint/style/noNonNullAssertion: provided in app.config.ts
	private iconLoader = injectNgIconLoader()!;

	// biome-ignore lint/style/noNonNullAssertion: set in lifecycle hook
	protected customSvg = signal<string>(null!);

	async ngOnInit() {
		if (this.customIcon()) {
			// biome-ignore lint/style/noNonNullAssertion: the return value is string
			const icon = (await this.iconLoader(this.customIcon()!)) as string;
			this.customSvg.set(icon);
		}
	}

	protected iconSize = computed(() => {
		return (this.size() ?? 24).toString();
	});
}

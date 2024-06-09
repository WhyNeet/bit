import { ChangeDetectionStrategy, Component, output } from "@angular/core";

@Component({
	selector: "app-ui-dropdown-item",
	standalone: true,
	imports: [],
	providers: [],
	template: `
    <button (click)="onSelect.emit()" class="flex items-center gap-2 px-2 py-1.5 rounded-default hover:bg-text/5 w-full">
			<div class="h-6 w-6 rounded-full overflow-hidden">
				<ng-content select="[icon]" />
			</div>
			<div class="font-display">
				<ng-content />
			</div>
		</button>
    `,
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownItemComponent {
	onSelect = output();
}

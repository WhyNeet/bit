import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-ui-kdb",
  standalone: true,
  imports: [],
  providers: [],
  template: `
	  <div class="px-1.5 py-0.5 bg-text/10 rounded-[calc(var(--border-radius)*0.8)] text-text/40 text-sm font-display flex items-center gap-1">
			<ng-content />
		</div>
	`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KBDComponent {}

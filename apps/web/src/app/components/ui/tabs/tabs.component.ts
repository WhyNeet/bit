import {
	ChangeDetectionStrategy,
	Component,
	ContentChildren,
	QueryList,
	output,
} from "@angular/core";
import { TabComponent } from "./tab/tab.component";

@Component({
	selector: "app-ui-tabs",
	standalone: true,
	imports: [],
	providers: [],
	templateUrl: "./tabs.component.html",
	styleUrl: "./tabs.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent {
	@ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
	protected selectedIndex = 0;

	onSelectionChange = output<number>();

	protected selectIndex(index: number) {
		this.selectedIndex = index;
		this.onSelectionChange.emit(index);
	}
}

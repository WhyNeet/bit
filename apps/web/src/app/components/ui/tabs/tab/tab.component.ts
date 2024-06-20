import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "app-ui-tabs-tab",
  standalone: true,
  imports: [],
  providers: [],
  template: `
        <ng-template>
            <ng-content></ng-content>
        </ng-template>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input() title = "";
}

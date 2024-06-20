import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "app-ui-skeleton",
  standalone: true,
  imports: [],
  providers: [],
  template: `
        <div [classList]="['bg-text/10 animate-pulse', class].join(' ')"></div>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonComponent {
  @Input() class = "";
}

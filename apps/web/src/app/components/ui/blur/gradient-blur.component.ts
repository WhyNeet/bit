import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
	selector: "app-ui-gradient-blur",
	standalone: true,
	imports: [],
	providers: [],
	template: `
  	<div class="gradient-blur">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  `,
	styleUrl: "./gradient-blur.component.css",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradientBlurComponent {}

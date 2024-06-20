import { CdkStepper } from "@angular/cdk/stepper";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from "@angular/core";

@Component({
  selector: "app-ui-stepper",
  standalone: true,
  imports: [],
  providers: [{ provide: CdkStepper, useExisting: StepperComponent }],
  templateUrl: "./stepper.component.html",
  styleUrl: "./stepper.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperComponent extends CdkStepper {
  maxSelectedIndex = input(0);
  @Input() class = "";

  protected selectStepByIndex(index: number): void {
    if (index > this.maxSelectedIndex()) return;
    this.selectedIndex = index;
  }
}

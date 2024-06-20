import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-logo",
  standalone: true,
  imports: [RouterLink],
  providers: [],
  templateUrl: "./logo.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent {}

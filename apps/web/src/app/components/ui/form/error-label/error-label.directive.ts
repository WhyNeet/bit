import { Directive, HostBinding } from "@angular/core";

@Directive({
	standalone: true,
	selector: "[formErrorLabel]",
})
export class ErrorLabelDirective {
	@HostBinding() class = "type error";
	@HostBinding("@label") labelAppear = true;
}

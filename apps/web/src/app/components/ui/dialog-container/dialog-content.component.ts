import { Component, HostBinding } from "@angular/core";

@Component({
	selector: "app-ui-dialog-content",
	standalone: true,
	imports: [],
	providers: [],
	template: `
        <ng-content />
    `,
})
export class DialogContent {
	@HostBinding() class = "p-6 block overflow-hidden";
}

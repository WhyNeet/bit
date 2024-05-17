import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideBold, lucideSendHorizontal } from "@ng-icons/lucide";
import { EditorComponent } from "../editor/editor.component";

@Component({
	selector: "app-post-form",
	standalone: true,
	imports: [NgIcon, EditorComponent],
	providers: [],
	viewProviders: [provideIcons({ lucideSendHorizontal, lucideBold })],
	templateUrl: "./post-form.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {}

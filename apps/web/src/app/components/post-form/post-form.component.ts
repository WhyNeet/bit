import { ChangeDetectionStrategy, Component } from "@angular/core";
import { EditorComponent } from "../editor/editor.component";

@Component({
	selector: "app-post-form",
	standalone: true,
	imports: [EditorComponent],
	providers: [],
	templateUrl: "./post-form.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostFormComponent {}

import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	ViewChild,
	afterNextRender,
} from "@angular/core";
import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

@Component({
	selector: "app-editor",
	standalone: true,
	imports: [],
	providers: [],
	templateUrl: "./editor.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
	@ViewChild("root") editorRoot!: ElementRef;

	constructor() {
		afterNextRender(() => {
			const state = EditorState.create({
				schema,
				plugins: [
					history(),
					keymap({ "Mod-z": undo, "Mod-y": redo }),
					keymap(baseKeymap),
				],
			});
			const view = new EditorView(this.editorRoot.nativeElement, { state });
		});
	}
}

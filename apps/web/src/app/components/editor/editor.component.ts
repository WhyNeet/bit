import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	ViewChild,
	afterNextRender,
} from "@angular/core";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Mark, MarkType } from "prosemirror-model";
import { marks, schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { placeholder } from "./plugins/placeholder.plugin";

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

	private view!: EditorView;

	constructor() {
		afterNextRender(() => {
			const state = EditorState.create({
				schema,
				plugins: [
					history(),
					keymap({ "Mod-z": undo, "Mod-y": redo }),
					keymap(baseKeymap),
					placeholder("What's on your mind?"),
					keymap({
						"Mod-b": (state, dispatch) => {
							const markType = state.schema.marks["strong"];
							return toggleMark(markType)(state, dispatch);
						},
					}),
				],
			});

			this.view = new EditorView(this.editorRoot.nativeElement, {
				state: state,
			});
		});
	}

	protected toggleMark(mark: string) {
		const { state, dispatch } = this.view;

		this.view.focus();

		const markType = state.schema.marks[mark];
		toggleMark(markType)(state, dispatch);
	}
}

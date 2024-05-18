import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

export const placeholder = (text: string) => {
	return new Plugin({
		props: {
			decorations(state) {
				const doc = state.doc;
				if (
					doc.childCount === 1 &&
					doc.firstChild?.isTextblock &&
					doc.firstChild?.content.size === 0
				)
					return DecorationSet.create(doc, [
						Decoration.widget(1, document.createTextNode(text)),
					]);
				return null;
			},
		},
	});
};

import { isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  lucideBold,
  lucideCode,
  lucideItalic,
  lucideSendHorizontal,
} from "@ng-icons/lucide";
import { baseKeymap, toggleMark } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import {
  defaultMarkdownParser,
  defaultMarkdownSerializer,
} from "prosemirror-markdown";
import { schema } from "prosemirror-schema-basic";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { __read } from "tslib";
import { imageAppear } from "../../animations/appear.animation";
import { placeholder } from "./plugins/placeholder.plugin";

@Component({
  selector: "app-editor",
  standalone: true,
  imports: [NgIcon],
  providers: [],
  viewProviders: [
    provideIcons({
      lucideSendHorizontal,
      lucideBold,
      lucideCode,
      lucideItalic,
    }),
  ],
  animations: [imageAppear],
  templateUrl: "./editor.component.html",
  styleUrl: "./editor.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent {
  @ViewChild("root") editorRoot!: ElementRef;

  @ViewChild("imagePicker") imagePicker!: ElementRef<HTMLInputElement>;
  @ViewChild("filePicker") filePicker!: ElementRef<HTMLInputElement>;

  protected images = signal<File[]>([]);
  protected loadedImages = signal<(string | null)[]>([]);
  protected files = signal<File[]>([]);

  onSend = output<string>();
  disabled = input<boolean>(false);

  @Input() initialContent: string | undefined = undefined;

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
            "Mod-i": (state, dispatch) => {
              const markType = state.schema.marks["em"];
              return toggleMark(markType)(state, dispatch);
            },
          }),
        ],
        doc: this.initialContent
          ? defaultMarkdownParser.parse(this.initialContent)
          : undefined,
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

  protected handleSendClick() {
    if (this.disabled()) return;

    this.onSend.emit(defaultMarkdownSerializer.serialize(this.view.state.doc));
  }

  protected openFileSelector() {
    this.filePicker.nativeElement.click();
  }

  protected openImageSelector() {
    this.imagePicker.nativeElement.click();
  }

  protected onAttachmentsPicked(event: Event, type: "image" | "file") {
    const files = Array.from((event.target as HTMLInputElement).files ?? []);

    const prevLength = this.images().length;

    if (type === "image") this.images.update((prev) => [...prev, ...files]);
    else this.files.update((prev) => [...prev, ...files]);

    for (let i = prevLength; i < this.images().length; i++)
      this.readImageData(i);
  }

  protected readImageData(idx: number) {
    const image = this.images()[idx];

    const reader = new FileReader();

    reader.readAsDataURL(image);

    reader.addEventListener("load", (e) => {
      this.loadedImages.update((imgs) => {
        imgs[idx] = e.target?.result as string;
        return [...imgs];
      });
    });
  }

  protected removeImage(idx: number) {
    this.images.update((prev) => {
      prev.splice(idx, 1);

      return [...prev];
    });

    this.loadedImages.update((prev) => {
      prev.splice(idx, 1);

      return [...prev];
    });
  }

  protected removeFile(idx: number) {
    this.files.update((prev) => {
      prev.splice(idx, 1);

      return [...prev];
    });
  }
}

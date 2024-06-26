import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  afterNextRender,
  computed,
  effect,
  input,
  output,
  signal,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import {
  lucideAlertCircle,
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
import { Observable, Subject, map } from "rxjs";
import { imageAppear } from "../../animations/appear.animation";
import { PostsService } from "../../features/posts/posts.service";
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
      lucideAlertCircle,
    }),
  ],
  animations: [imageAppear],
  templateUrl: "./editor.component.html",
  styleUrl: "./editor.component.css",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements OnInit {
  @ViewChild("root") editorRoot!: ElementRef;

  @ViewChild("imagePicker") imagePicker!: ElementRef<HTMLInputElement>;
  @ViewChild("filePicker") filePicker!: ElementRef<HTMLInputElement>;

  protected images = signal<File[]>([]);
  protected loadedImages = signal<(string | null)[]>([]);
  public initialImages = input<string[]>([]);
  protected files = signal<File[]>([]);
  public initialFiles = input<string[]>([]);

  onSend = output<{ content: string; files: File[]; images: File[] }>();
  disabled = input<boolean>(false);

  private invalidImages = computed(
    () =>
      this.images().length > 3 || this.images().some((f) => f.size > 3000000),
  );
  private invalidFiles = computed(
    () => this.files().length > 3 || this.files().some((f) => f.size > 3000000),
  );

  protected sendDisabled = computed(
    () => this.disabled() || this.invalidImages() || this.invalidFiles(),
  );

  @Input() initialContent: string | undefined = undefined;

  private view!: EditorView;

  constructor(private postsService: PostsService) {
    effect(() => {
      for (let i = this.loadedImages().length; i < this.images().length; i++)
        this.readImageData(i);
    });

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

  ngOnInit(): void {
    for (const initial of this.initialFiles()) {
      this.loadFileById(initial).subscribe((file) =>
        this.files.update((prev) => [...prev, file]),
      );
    }

    for (const initial of this.initialImages()) {
      this.loadFileById(initial).subscribe((file) =>
        this.images.update((prev) => [...prev, file]),
      );
    }
  }

  protected toggleMark(mark: string) {
    const { state, dispatch } = this.view;

    this.view.focus();

    const markType = state.schema.marks[mark];
    toggleMark(markType)(state, dispatch);
  }

  protected handleSendClick() {
    if (this.disabled()) return;

    this.onSend.emit({
      content: defaultMarkdownSerializer.serialize(this.view.state.doc),
      files: this.files(),
      images: this.images(),
    });
  }

  protected loadFileById(id: string): Observable<File> {
    return this.postsService
      .getFileBlobById(id)
      .pipe(map((blob) => new File([blob], id.split("/").at(-1) as string)));
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

    const dataTransfer = new DataTransfer();
    for (const image of this.images()) dataTransfer.items.add(image);
    this.imagePicker.nativeElement.files = dataTransfer.files;
  }

  protected removeFile(idx: number) {
    this.files.update((prev) => {
      prev.splice(idx, 1);

      return [...prev];
    });

    const dataTransfer = new DataTransfer();
    for (const file of this.files()) dataTransfer.items.add(file);
    this.imagePicker.nativeElement.files = dataTransfer.files;
  }

  protected readableFileSize(attachmentSize: number) {
    const sizeInKb = attachmentSize / 1024;

    if (sizeInKb > 1024) {
      return `${(sizeInKb / 1024).toFixed(2)} mb`;
    }
    return `${sizeInKb.toFixed(2)} kb`;
  }
}

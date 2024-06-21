import { CommonModule, isPlatformServer } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from "@angular/core";
import { CommentDto } from "common";
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  filter,
  map,
  tap,
  withLatestFrom,
} from "rxjs";
import { label } from "../../animations/label.animation";
import { CommentComponent } from "../ui/comment/comment.component";
import { ProgressSpinnerComponent } from "../ui/progress-spinner/progress-spinner.component";
import { SkeletonComponent } from "../ui/skeleton/skeleton.component";

@Component({
  selector: "app-comments-list",
  standalone: true,
  imports: [
    SkeletonComponent,
    CommentComponent,
    CommonModule,
    ProgressSpinnerComponent,
  ],
  providers: [],
  animations: [label],
  templateUrl: "./comments-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsListComponent implements OnInit, OnDestroy {
  @Input({ required: true }) comments$!: Observable<CommentDto[][] | undefined>;
  @Input() isLoading$!: Observable<boolean>;
  @Input() fetchMore!: (page: number, perPage: number) => void;

  @ViewChild("listEnd") listEnd!: ElementRef<HTMLDivElement>;
  private listEndObserver!: IntersectionObserver;

  private onListEnd = new Subject<boolean>();
  private sub!: Subscription;

  // biome-ignore lint/complexity/noBannedTypes: Angular
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.sub = this.onListEnd
      .pipe(
        debounceTime(100),
        filter((isIntersecting) => isIntersecting),
        withLatestFrom(this.isLoading$),
        map(([_, isLoading]) => isLoading),
        filter((isLoading) => !isLoading),
        withLatestFrom(this.comments$),
        map(([_, comments]) => comments),
        filter((comments) => !!comments && (comments.at(-1)?.length ?? 0) > 0),
        map((comments) => (comments as { length: number }).length),
      )
      .subscribe((lastPageIdx) => this.fetchMore(lastPageIdx as number, 20));
  }

  ngAfterViewInit(): void {
    if (isPlatformServer(this.platformId)) return;

    this.listEndObserver = new IntersectionObserver((entries) => {
      this.onListEnd.next(entries[0].isIntersecting);
    });

    this.listEndObserver.observe(this.listEnd.nativeElement);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();

    if (isPlatformServer(this.platformId)) return;

    this.listEndObserver.disconnect();
  }
}

import { CommonModule, isPlatformServer } from "@angular/common";
import {
  AfterViewInit,
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
import { Store } from "@ngrx/store";
import { PostDto } from "common";
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  filter,
  map,
  switchMap,
  take,
  takeWhile,
  tap,
  withLatestFrom,
} from "rxjs";
import { appear } from "../../animations/appear.animation";
import { disappear } from "../../animations/disappear.animation";
import { label } from "../../animations/label.animation";
import { postsFetching } from "../../state/posts/actions";
import { PostComponent } from "../ui/post/post.component";
import { ProgressSpinnerComponent } from "../ui/progress-spinner/progress-spinner.component";
import { SkeletonComponent } from "../ui/skeleton/skeleton.component";

@Component({
  selector: "app-posts-list",
  standalone: true,
  imports: [
    SkeletonComponent,
    PostComponent,
    CommonModule,
    ProgressSpinnerComponent,
  ],
  providers: [],
  animations: [appear, disappear, label],
  templateUrl: "./post-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() posts!: Observable<PostDto[][] | null>;
  @Input() isLoading!: Observable<boolean>;

  protected posts$!: Observable<PostDto[][] | null>;
  protected isLoading$!: Observable<boolean>;

  @Input() fetchMore!: (page: number, perPage: number) => void;

  @ViewChild("listEnd") listEnd!: ElementRef<HTMLDivElement>;
  private listEndObserver!: IntersectionObserver;

  private onListEnd = new Subject<boolean>();
  private sub!: Subscription;

  constructor(
    // biome-ignore lint/complexity/noBannedTypes: Angular
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.posts
      .pipe(
        takeWhile((posts) => !posts),
        take(1),
      )
      .subscribe(() => this.fetchMore(0, 20));

    this.posts$ = this.posts;
    this.isLoading$ = this.isLoading;

    this.sub = this.onListEnd
      .pipe(
        debounceTime(100),
        filter((isIntersecting) => isIntersecting),
        withLatestFrom(this.isLoading$),
        map(([_, isLoading]) => isLoading),
        filter((isLoading) => !isLoading),
        withLatestFrom(this.posts$),
        map(([_, posts]) => posts),
        filter((posts) => !!posts && (posts.at(-1)?.length ?? 0) > 0),
        map((posts) => (posts as { length: number }).length),
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

  protected handleScroll(event: Event) {
    console.log(event);
  }
}

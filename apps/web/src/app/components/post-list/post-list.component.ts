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
  output,
} from "@angular/core";
import { Store } from "@ngrx/store";
import { PostDto, UserPostRelationType } from "common";
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  filter,
  map,
  take,
  takeWhile,
  withLatestFrom,
} from "rxjs";
import { label } from "../../animations/label.animation";
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
  animations: [label],
  templateUrl: "./post-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() posts!: Observable<PostDto[][] | null>;
  @Input() isLoading!: Observable<boolean>;

  public onPostVote = output<{
    postId: string;
    votingState: UserPostRelationType | null;
  }>();

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

  protected onPostVoted(data: {
    postId: string;
    votingState: PostDto["votingState"];
  }) {
    this.onPostVote.emit(data);
  }
}

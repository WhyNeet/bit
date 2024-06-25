import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  signal,
} from "@angular/core";
import { NgIcon, provideIcons } from "@ng-icons/core";
import { lucideHeart, lucideHistory } from "@ng-icons/lucide";
import { Store, select } from "@ngrx/store";
import { PostDto } from "common";
import { Observable, map } from "rxjs";
import { PostFormComponent } from "../../components/post-form/post-form.component";
import { PostListComponent } from "../../components/post-list/post-list.component";
import { PostsService } from "../../features/posts/posts.service";
import {
  selectHomePosts,
  selectLatestPosts,
} from "../../state/posts/selectors";
import { selectUser } from "../../state/user/selectors";

export type Section = "latest" | "following";

@Component({
  selector: "app-page-home",
  standalone: true,
  imports: [PostFormComponent, CommonModule, NgIcon, PostListComponent],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  viewProviders: [provideIcons({ lucideHistory, lucideHeart })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  @HostBinding() class = "flex-auto";
  protected isLoggedIn$: Observable<boolean>;
  protected latestPosts$: Observable<PostDto[][] | null>;
  protected latestPostsLoading$: Observable<boolean>;

  protected followingPosts$: Observable<PostDto[][] | null>;
  protected followingPostsLoading$: Observable<boolean>;

  protected currentSection = signal<Section>("latest");

  constructor(
    private store: Store,
    private postsService: PostsService,
  ) {
    this.isLoggedIn$ = this.store.pipe(
      select(selectUser),
      map((user) => !!user),
    );

    const splitStoreModel = (
      input: Observable<{ posts: PostDto[][] | null; isLoading: boolean }>,
    ) => ({
      posts: input.pipe(map((data) => data.posts)),
      isLoading: input.pipe(map((data) => data.isLoading)),
    });

    const { isLoading: latestPostsLoading, posts: latestPosts } =
      splitStoreModel(this.store.pipe(select(selectLatestPosts)));

    this.latestPosts$ = latestPosts;
    this.latestPostsLoading$ = latestPostsLoading;

    const { isLoading: homePostsLoading, posts: homePosts } = splitStoreModel(
      this.store.pipe(select(selectHomePosts)),
    );

    this.followingPosts$ = homePosts;
    this.followingPostsLoading$ = homePostsLoading;
  }

  protected setSection(section: Section) {
    this.currentSection.set(section);
  }

  protected fetchMoreLatest(page: number, perPage: number) {
    this.postsService.getLatestPosts(page, perPage, ["author", "community"]);
  }

  protected fetchMoreFollowing(page: number, perPage: number) {
    this.postsService.getHomePosts(page, perPage, ["author", "community"]);
  }

  protected handleSend({
    content,
    title,
    communityId,
    files,
    images,
  }: {
    title: string;
    content: string;
    communityId?: string;
    files: File[];
    images: File[];
  }) {
    this.postsService.createPost(title, content, images, files, communityId);
  }
}

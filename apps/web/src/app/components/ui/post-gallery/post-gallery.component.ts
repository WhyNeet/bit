import { NgOptimizedImage } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from "@angular/core";
import { NgIcon } from "@ng-icons/core";
import { PostsService } from "../../../features/posts/posts.service";

@Component({
  selector: "app-ui-post-gallery",
  standalone: true,
  imports: [NgOptimizedImage, NgIcon],
  providers: [],
  templateUrl: "./post-gallery.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostGalleryComponent {
  images = input.required<string[], string[]>({
    transform: (images: string[]) =>
      images.map(this.postsService.getPostFileUrl.bind(this.postsService)),
  });

  protected currentImageIndex = signal(0);

  constructor(protected postsService: PostsService) {}

  protected onImageSelected(idx: number) {
    this.currentImageIndex.set(idx);
  }
}

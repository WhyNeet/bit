import { UserPostRelationType } from "src/entities";
import { CommunityDto } from "./community.dto";
import { UserDto } from "./user.dto";

export class CreatePostDto {
  title: string;

  content: string;

  community: string;

  images: File[];

  files: File[];
}

export class UpdatePostDto {
  title: string;

  content: string;

  images: File[];

  files: File[];
}

export class PostDto {
  id: string;

  title: string;
  content: string;

  images: string[];
  files: string[];

  author?: UserDto | string;
  community?: CommunityDto | string;

  upvotes: number;
  downvotes: number;
  votingState:
    | UserPostRelationType.Downvote
    | UserPostRelationType.Upvote
    | null;

  createdAt: Date;
  updatedAt: Date;
}

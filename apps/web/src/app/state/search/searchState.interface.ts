import { PostVectorDataDto } from "common";

export interface SearchState {
  searchResults: PostVectorDataDto[] | null;
  isLoading: boolean;
}

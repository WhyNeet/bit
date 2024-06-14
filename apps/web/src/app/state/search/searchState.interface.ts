import { PostVectorData } from "common";

export interface SearchState {
	searchResults: PostVectorData[] | null;
	isLoading: boolean;
}

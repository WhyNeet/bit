import { createAction, props } from "@ngrx/store";
import { PostVectorDataDto } from "common";

export const searchLoading = createAction("[Search] Loading");
export const searchFinished = createAction(
  "[Search] Finished",
  props<{ posts: PostVectorDataDto[] }>(),
);

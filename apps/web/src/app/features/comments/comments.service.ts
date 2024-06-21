import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { CommentDto, CreateCommentDto } from "common";
import { catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { commentCreated, commentsFetched } from "../../state/comments/actions";

@Injectable({
  providedIn: "root",
})
export class CommentsService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
  ) {}

  public getComments(post: string, page = 0, perPage = 20, include = []) {
    this.httpClient
      .get(
        `${environment}/comments/${post}?page=${page}&perPage=${perPage}&include=${include.join(
          ",",
        )}`,
      )
      .pipe(
        map((res) => (res as { data: CommentDto[] }).data),
        catchError((err) => {
          return throwError(() => err);
        }),
      )
      .subscribe((comments) =>
        this.store.dispatch(commentsFetched({ postId: post, comments })),
      );
  }

  public createComment(post: string, content: string) {
    const data: CreateCommentDto = {
      content,
      post,
    };

    this.httpClient
      .post(`${environment.API_BASE_URL}/comments`, data, {
        withCredentials: true,
      })
      .pipe(
        map((res) => (res as { data: CommentDto }).data),
        catchError((err) => {
          return throwError(() => err);
        }),
      )
      .subscribe((comment) =>
        this.store.dispatch(commentCreated({ postId: post, comment })),
      );
  }
}

export interface Response<T> {
  data: T;
}

export interface ErrorResponse {
  type: string;
  title: string;
  detail: string;
  instance: string;
}

export type ApiResponse<T> = Promise<Response<T>>;

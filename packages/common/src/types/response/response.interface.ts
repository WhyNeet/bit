export interface Response<T> {
	data: T;
}

export type ApiResponse<T> = Promise<Response<T>>;

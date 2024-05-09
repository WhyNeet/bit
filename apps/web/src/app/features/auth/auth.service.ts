import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { CreateUserDto, UserDto } from "common";
import { catchError, map, throwError } from "rxjs";
import { loggedIn } from "../../state/user/actions";
import { apiBaseUrl } from "../../utils/env";

@Injectable({
	providedIn: "root",
})
export class AuthService {
	constructor(
		private httpClient: HttpClient,
		private store: Store,
	) {}

	public register(
		email: string,
		username: string,
		password: string,
		name: string,
	): void {
		const createUserDto: CreateUserDto = {
			email,
			name,
			password,
			username,
		};

		this.httpClient
			.post(`${apiBaseUrl}/auth/register`, createUserDto, {
				withCredentials: true,
			})
			.pipe(
				map((result: unknown) => (result as { data: UserDto }).data),
				catchError((err) => {
					return throwError(() => err.error);
				}),
			)
			.subscribe((user) => this.store.dispatch(loggedIn({ user })));
	}
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { CreateUserDto, UserCredentialsDto, UserDto } from "common";
import { catchError, map, throwError } from "rxjs";
import { apiBaseUrl } from "../../misc/env";
import { loggedIn, loggedOut } from "../../state/user/actions";

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

	public login(email: string, password: string): void {
		const userCredentialsDto: UserCredentialsDto = {
			email,
			password,
		};

		this.httpClient
			.post(`${apiBaseUrl}/auth/login`, userCredentialsDto, {
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

	public getCurrentUser(): void {
		this.httpClient
			.get(`${apiBaseUrl}/users/me`, {
				withCredentials: true,
			})
			.pipe(
				map((result: unknown) => (result as { data: UserDto }).data),
				catchError((err) => {
					this.store.dispatch(loggedOut());
					return throwError(() => err.error);
				}),
			)
			.subscribe((user) => this.store.dispatch(loggedIn({ user })));
	}
}

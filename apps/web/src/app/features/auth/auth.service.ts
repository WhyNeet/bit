import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  CreateUserDto,
  ErrorResponse,
  UserCredentialsDto,
  UserDto,
} from "common";
import { Subject, catchError, map, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { loggedIn, loggedOut } from "../../state/user/actions";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private httpClient: HttpClient,
    private store: Store,
  ) {}

  private error$ = new Subject<ErrorResponse | null>();

  public getError() {
    return this.error$.asObservable();
  }

  public register(createUserDto: CreateUserDto): void {
    this.error$.next(null);

    this.httpClient
      .post(`${environment.API_BASE_URL}/auth/register`, createUserDto, {
        withCredentials: true,
      })
      .pipe(
        map((result: unknown) => (result as { data: UserDto }).data),
        catchError((err) => {
          this.error$.next(err.error);
          return throwError(() => err);
        }),
      )
      .subscribe((user) => this.store.dispatch(loggedIn({ user })));
  }

  public login(userCredentialsDto: UserCredentialsDto): void {
    this.error$.next(null);

    this.httpClient
      .post(`${environment.API_BASE_URL}/auth/login`, userCredentialsDto, {
        withCredentials: true,
      })
      .pipe(
        map((result: unknown) => (result as { data: UserDto }).data),
        catchError((err) => {
          this.error$.next(err.error);
          return throwError(() => err.error);
        }),
      )
      .subscribe((user) => this.store.dispatch(loggedIn({ user })));
  }

  public getCurrentUser(): void {
    this.httpClient
      .get(`${environment.API_BASE_URL}/users/me`, {
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

  public logout() {
    this.httpClient
      .post(`${environment.API_BASE_URL}/auth/logout`, undefined, {
        withCredentials: true,
      })
      .subscribe(() => this.store.dispatch(loggedOut()));
  }
}

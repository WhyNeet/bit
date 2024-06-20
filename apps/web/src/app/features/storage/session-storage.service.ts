import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SessionStorageService {
  private storageChange$ = new ReplaySubject<{ key: string; value: string }>();

  public setItem(key: string, value: string) {
    window.sessionStorage.setItem(key, value);
    this.storageChange$.next({ key, value });
  }

  public getItem(key: string) {
    return window.sessionStorage.getItem(key);
  }

  public getChanges() {
    return this.storageChange$.asObservable();
  }
}

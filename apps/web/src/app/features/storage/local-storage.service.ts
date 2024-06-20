import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs";

@Injectable({ providedIn: "root" })
export class LocalStorageService {
  private storageChange$ = new ReplaySubject<{ key: string; value: unknown }>();

  // biome-ignore lint/complexity/noBannedTypes: Object represents a random object
  public setItem(key: string, value: string | Object) {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);

    window.localStorage.setItem(key, serializedValue);
    this.storageChange$.next({ key, value });
  }

  public removeItem(key: string) {
    window.localStorage.removeItem(key);
  }

  public getItem(key: string) {
    return window.localStorage.getItem(key);
  }

  public getChanges() {
    return this.storageChange$.asObservable();
  }
}

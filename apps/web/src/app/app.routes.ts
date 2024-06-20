import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "home",
    loadComponent: () =>
      import("./routes/home/home.component").then((m) => m.HomePageComponent),
  },
  {
    path: "post/:postId",
    loadComponent: () =>
      import("./routes/post/post.component").then((m) => m.PostPageComponent),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

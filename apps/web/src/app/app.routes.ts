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
    path: "user/:userId",
    loadComponent: () =>
      import("./routes/user/user.component").then((m) => m.UserPageComponent),
  },
  {
    path: "community/:communityId",
    loadComponent: () =>
      import("./routes/community/community.component").then(
        (m) => m.CommunityPageComponent,
      ),
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
];

import { createRouter, createWebHistory } from "vue-router";
import PresentationView from "../views/Presentation/PresentationView.vue";
import AboutView from "../views/LandingPages/Map/MapView.vue";
import SignInBasicView from "../views/LandingPages/SignIn/SignIn.vue";
import SingUpBasicView from "../views/LandingPages/SignIn/SignUp.vue";
import MyPageView from "../views/LandingPages/MyPage/MyPageView.vue";
import BoardView from "../views/LandingPages/Board/BoardView.vue";const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "presentation",
      component: PresentationView,
    },
    {
      path: "/pages/landing-pages/about-us",
      name: "about",
      component: AboutView,
    },
    {
      path: "/pages/landing-pages/signin",
      name: "signin-basic",
      component: SignInBasicView,
    },
    {
      path: "/pages/landing-pages/signup",
      name: "signup-basic",
      component: SingUpBasicView,
    },
    {
      path: "/pages/landing-pages/mypage",
      name: "mypage",
      component: MyPageView,
    },
    {
      path: "/pages/landing-pages/board",
      name: "board",
      component: BoardView,
    },
  ],
});

export default router;

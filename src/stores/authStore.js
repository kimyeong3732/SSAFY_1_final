import { reactive } from 'vue'
import { defineStore } from 'pinia'

import http from "@/common/axios.js";
import notLoginUserProfileImageUrl from '@/assets/noProfileImage.jpg';

export const useAuthStore = defineStore('authStore', () => {
  console.log(notLoginUserProfileImageUrl)
  const authStore = reactive({
    // NavBar
    isLogin: false,

    userName: '',
    userProfileImageUrl: notLoginUserProfileImageUrl,
    userRole: '010',

    // Login
    userEmail: "dskim@dskim.com",
    userPassword: "1234",
  })

  // getter 는 생략 직접 사용하는 걸로
  const setLogin = (payload) => {
    sessionStorage.setItem("isLogin", "true");
    sessionStorage.setItem("userName", payload.userName);
    sessionStorage.setItem("userProfileImageUrl", payload.userProfileImageUrl);
    sessionStorage.setItem('userRole', payload.userRole);

    authStore.isLogin = payload.isLogin;
    authStore.userName = payload.userName;
    authStore.userProfileImageUrl = payload.userProfileImageUrl;
    authStore.userRole = payload.userRole;
    console.log(authStore)
  }

  const logout = async () => {
    try {
       let { data } = await http.get("/logout");

       if (data.result == "success") {
        setLogout()
       }
    } catch (error) {
       console.error(error);
    }
  }

  const setLogout = () => {
    sessionStorage.removeItem("isLogin");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userProfileImageUrl");
    sessionStorage.removeItem("userRole");

    authStore.isLogin = false;
    authStore.userName = '';
    authStore.userProfileImageUrl = notLoginUserProfileImageUrl;
    authStore.userRole = '010';
  }

  return {
    authStore,
    setLogin,
    setLogout,
    logout
  }
})
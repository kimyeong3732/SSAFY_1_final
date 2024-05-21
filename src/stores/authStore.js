import { reactive } from 'vue'
import { defineStore } from 'pinia'

import http from "@/common/axios.js";

export const useAuthStore = defineStore('authStore', () => {
  const authStore = reactive({
    // NavBar
    isLogin: false,

    userName: '',
    userProfileImage: null,
    userRole: '010',
    userMessage: 'Nothing there. Please edit your profile to put a message.',

    // Login
    userEmail: "dskim@dskim.com",
    userPassword: "1234",
  })

  // getter 는 생략 직접 사용하는 걸로
  const setLogin = (payload) => {
    sessionStorage.setItem("isLogin", "true");
    sessionStorage.setItem("userName", payload.userName);
    sessionStorage.setItem('userRole', payload.userRole);
    
    if(payload.userMessage) {
      authStore.userMessage = payload.userMessage;
    }
    if(payload.userProfileImage) {
      authStore.userProfileImage = 'http://localhost:8080/img/' + payload.userProfileImage.fileUUID;
    }
    
    sessionStorage.setItem("userProfileImage", authStore.userProfileImage);

    authStore.isLogin = payload.isLogin;
    authStore.userName = payload.userName;
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
    sessionStorage.removeItem("userProfileImage");
    sessionStorage.removeItem("userRole");

    authStore.isLogin = false;
    authStore.userName = '';
    authStore.userProfileImage = null;
    authStore.userRole = '010';
    authStore.userMessage = 'Nothing there. Please edit your profile to put a message.';
    
    // authStore.userEmail = '';
    // authStore.userPassword = '';
  }

  const setProfileImage = (img) => {
    authStore.userProfileImage = img;
  }

  return {
    authStore,
    setLogin,
    setLogout,
    logout,
    setProfileImage
  }
})
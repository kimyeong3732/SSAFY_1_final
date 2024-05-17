<script setup>
/*
=========================================================
* Vue Material Kit 2 - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vue-material-kit
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
  import { RouterView } from 'vue-router'

  import { useAuthStore } from '@/stores/authStore.js'
  const authStore = useAuthStore()

  let isLogin = sessionStorage.getItem("isLogin");
  // console.log(isLogin)
  if( isLogin == "true" ){
      let userName = sessionStorage.getItem("userName");
      let userProfileImageUrl = sessionStorage.getItem("userProfileImageUrl");
      authStore.setLogin({ 
        isLogin: true,
        userName: userName,
        userProfileImageUrl: userProfileImageUrl 
      });
  }
</script>

<template>
  <router-view />
</template>

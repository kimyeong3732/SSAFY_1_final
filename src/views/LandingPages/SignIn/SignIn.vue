<script setup>
import http from "@/common/axios.js";
import { useAuthStore } from '@/stores/authStore.js';
import { useRouter } from 'vue-router'
import { onMounted } from "vue";

// example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";

//Vue Material Kit 2 components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});
 
// import VueAlertify from "vue-alertify";

const { authStore, setLogin } = useAuthStore()
const router = useRouter()

console.log(authStore);
const login = async () => {
  // #1 Not JSON Way : application/x-www-form-urlencoded;charset=UTF-8

  // backend 는 @RequestBody X
  // let options = {
  //   headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
  // }

  // application/x-www-form-urlencoded 일 때 param 은 URLSearchParams() 를 이용
  // const params = new URLSearchParams();
  // params.append('userEmail', authStore.userEmail);
  // params.append('userPassword', authStore.userPassword);

  // #2 JSON Way : application/json
  let loginObj = {
    userEmail: authStore.userEmail,
    userPassword: authStore.userPassword,
  };

  try {
    // #1
    // let {data} = await  http.post('/login', params, options );

    // #2
    let { data } = await http.post("/login", loginObj);

    console.log("LoginVue: data : ");
    console.log(data);
    console.log(data.userName);

    if( data.result == "success" ){
      setLogin({ isLogin: true, userName: data.userName, userProfileImageUrl: data.userProfileImageUrl, userRole: data.userClsf });
      // board 로 이동
      router.push("/");
    }else if( data.result == "fail" ){
      // this.$alertify.error('이메일 또는 비밀번호를 확인하세요.');
      alert('이메일 또는 비밀번호를 확인하세요.');
    }
  } catch (error) {
    // LoginController 에서 ResponseEntity 로 404 보내면 여기로 떨어진다.
    console.log("LoginVue: error : ");
    console.log(error);
    // this.$alertify.error('로그인 과정에서 오류가 발생했습니다.');
    alert('로그인 과정에서 오류가 발생했습니다.');
  }
}
</script>
<template>
  <DefaultNavbar transparent />
  <Header>
    <div
      class="page-header align-items-start min-vh-100"
      :style="{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80)'
      }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container my-auto">
        <div class="row">
          <div class="col-lg-4 col-md-8 col-12 mx-auto">
            <div class="card z-index-0 fadeIn3 fadeInBottom">
              <div
                class="card-header p-0 position-relative mt-n4 mx-3 z-index-2"
              >
                <div
                  class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1"
                >
                  <h4
                    class="text-white font-weight-bolder text-center mt-2 mb-0"
                  >
                    Sign in
                  </h4>
                  <div class="row mt-3">
                    <div class="col-2 text-center ms-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-facebook text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center px-1">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-github text-white text-lg"></i>
                      </a>
                    </div>
                    <div class="col-2 text-center me-auto">
                      <a class="btn btn-link px-3" href="javascript:;">
                        <i class="fa fa-google text-white text-lg"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <!-- <form role="form" class="text-start"> -->
                <div class="input-group input-group-outline my-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    v-model="authStore.userEmail"
                  />
                </div>
                <div class="input-group input-group-outline my-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    v-model="authStore.userPassword"
                  />
                </div>
                  <!-- <MaterialInput
                    id="email"
                    class="input-group-outline my-3"
                    :label="{ text: 'Email', class: 'form-label' }"
                    type="email"
                  />
                  <MaterialInput
                    id="password"
                    class="input-group-outline mb-3"
                    :label="{ text: 'Password', class: 'form-label' }"
                    type="password"
                  /> -->
                  <!-- <MaterialSwitch
                    class="d-flex align-items-center mb-3"
                    id="rememberMe"
                    labelClass="mb-0 ms-3"
                    checked
                    >Remember me</MaterialSwitch
                  > -->

                  <div class="text-center">
                    <button
                      class="btn my-4 mb-2 bg-gradient-success w-100"
                      @click="login"
                      >Sign in</button
                    >
                    <!-- <MaterialButton
                      class="my-4 mb-2"
                      variant="gradient"
                      color="success"
                      fullWidth
                      >Sign in</MaterialButton
                    > -->
                  </div>
                  <p class="mt-4 text-sm text-center">
                    Don't have an account?
                    <router-link
                      to="/pages/landing-pages/signup"
                      class="text-success text-gradient font-weight-bold"
                      >Sign up</router-link
                    >
                  </p>
                <!-- </form> -->
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer class="footer position-absolute bottom-2 py-2 w-100">
        <div class="container">
          <div class="row align-items-center justify-content-lg-between">
            <div class="col-12 col-md-6 my-auto">
              <div
                class="copyright text-center text-sm text-white text-lg-start"
              >
                © {{ new Date().getFullYear() }}, made with
                <i class="fa fa-heart" aria-hidden="true"></i> by
                <a
                  href="https://www.creative-tim.com"
                  class="font-weight-bold text-white"
                  target="_blank"
                  >Creative Tim</a
                >
                for a better web.
              </div>
            </div>
            <div class="col-12 col-md-6">
              <ul
                class="nav nav-footer justify-content-center justify-content-lg-end"
              >
                <li class="nav-item">
                  <a
                    href="https://www.creative-tim.com"
                    class="nav-link text-white"
                    target="_blank"
                    >Creative Tim</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://www.creative-tim.com/presentation"
                    class="nav-link text-white"
                    target="_blank"
                    >About Us</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://www.creative-tim.com/blog"
                    class="nav-link text-white"
                    target="_blank"
                    >Blog</a
                  >
                </li>
                <li class="nav-item">
                  <a
                    href="https://www.creative-tim.com/license"
                    class="nav-link pe-0 text-white"
                    target="_blank"
                    >License</a
                  >
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </Header>
</template>

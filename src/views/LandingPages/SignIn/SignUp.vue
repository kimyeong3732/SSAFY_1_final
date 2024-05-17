<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'

// example components
import DefaultNavbar from "@/examples/navbars/NavbarDefault.vue";
import Header from "@/examples/Header.vue";

//Vue Material Kit 2 components
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";

import http from "@/common/axios.js";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});

const router = useRouter()

const userName = ref('')
const userEmail = ref('')
const userPassword = ref('')
const userPassword2 = ref('')

// focus
const isUserNameFocus = ref(false)
const isUserEmailFocus = ref(false)
const isUserPasswordFocus = ref(false)
const isUserPassword2Focus = ref(false)

// validation
const isUserNameValid = ref(false)
const isUserEmailValid = ref(false)
const isUserPasswordValid = ref(false)
const isUserPassword2Valid = ref(false)

// 회원 구분
const groupCode = '001'
const codeList = ref([])
const userClsf = ref('010') // 일반회원 default

const isUserNameFocusAndValid = computed(() => isUserNameFocus.value && isUserNameValid.value) 
const isUserNameFocusAndInvalid = computed(() => isUserNameFocus.value && !isUserNameValid.value) 
const isUserEmailFocusAndValid = computed(() => isUserEmailFocus.value && isUserEmailValid.value) 
const isUserEmailFocusAndInValid = computed(() => isUserEmailFocus.value && !isUserEmailValid.value) 
const isUserPasswordFocusAndValid = computed(() => isUserPasswordFocus.value && isUserPasswordValid.value) 
const isUserPasswordFocusAndInvalid = computed(() => isUserPasswordFocus.value && !isUserPasswordValid.value) 
const isUserPassword2FocusAndValid = computed(() => isUserPassword2Focus.value && isUserPassword2Valid.value) 
const isUserPassword2FocusAndInvalid = computed(() => isUserPassword2Focus.value && !isUserPassword2Valid.value) 

const getCodeList = async () => {
    let params = {
        groupCode: groupCode // reactive X
    };

    try {
        let { data } = await http.get("/codes", { params }); // params : params shorthand property, Not JSON request
        console.log("UsersPage: data : ");
        console.log(data);

        codeList.value = data;
    } catch (error) {
        console.log("UsersPage: error : ");
        console.log(error);
        alert("서버에 문제가 발생했습니다.");
    }
}

const register = async () => {
    if (!isUserEmailValid || !isUserPasswordValid || !isUserPassword2Valid) return;

    let registerObj = {
        userName: userName.value,
        userEmail: userEmail.value,
        userPassword: userPassword.value,
        userClsf: userClsf.value,
    };

    try {
        let { data } = await http.post("/users", registerObj); // JSON Request, { params : registerObj } X params 를 쓰면 get => query string
        console.log("UsersPage: data : ");
        console.log(data.result);

        alert('회원가입을 축하합니다. 로그인 페이지로 이동합니다.');
        router.push("/pages/landing-pages/signin");
        // let $this = this;
        // $alertify.alert("회원가입을 축하합니다. 로그인 페이지로 이동합니다", function () {
        //    $$router.push("/login");
        // });
    } catch (error) {
        console.log("UsersPage: error : ");
        console.log(error);
        // $alertify.error("서버에 문제가 발생했습니다.");
        alert('서버에 문제가 발생했습니다.')
    }
}

const validateUserName = () => {
    isUserNameValid.value = userName.value.length > 0 ? true : false;
    console.log(isUserNameValid.value);
}
const validateEmail = () => {
    // ^ 시작일치, $ 끝 일치
    // {2, 3} 2개 ~ 3개
    // * 0회 이상, + 1회 이상
    // [-_.] - 또는 _ 또는 .
    // ? 없거나 1회
    let regexp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
    isUserEmailValid.value = regexp.test(userEmail.value) ? true : false;
    console.log(isUserEmailValid.value);
    }
    const validatePassword = () => {
    let patternEngAtListOne = new RegExp(/[a-zA-Z]+/); // + for at least one
    let patternSpeAtListOne = new RegExp(/[~!@#$%^&*()_+|<>?:{}]+/); // + for at least one
    let patternNumAtListOne = new RegExp(/[0-9]+/); // + for at least one

    isUserPasswordValid.value = 
        patternEngAtListOne.test(userPassword.value) && 
        patternSpeAtListOne.test(userPassword.value) && 
        patternNumAtListOne.test(userPassword.value) && 
        userPassword.value.length >= 8 ? true : false;
}
const validatePassword2 = () => {
    isUserPassword2Valid.value = userPassword.value == userPassword2.value ? true : false;
}

getCodeList();
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
                    Sign up
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
                <div class="input-group input-group-outline my-3">
                  <label class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    :class="{ 'is-valid': isUserNameFocusAndValid, 'is-invalid': isUserNameFocusAndInvalid }"
                    v-model="userName"
                    @input="validateUserName"
                    @focus="isUserNameFocus = true"
                  />
                  <div class="valid-feedback">Valid.</div>
                  <div class="invalid-feedback">올바른 이름을 입력해 주세요.</div>
                </div>
                
                <div class="input-group input-group-outline my-3">
                  <label class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    :class="{ 'is-valid': isUserEmailFocusAndValid, 'is-invalid': isUserEmailFocusAndInValid }"
                    v-model="userEmail"
                    @input="validateEmail"
                    @focus="isUserEmailFocus = true"
                  />
                  <div class="valid-feedback">Valid.</div>
                  <div class="invalid-feedback">올바른 Email 을 입력해 주세요.</div>
                </div>
                
                <div class="input-group input-group-outline my-3">
                  <label class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-valid': isUserPasswordFocusAndValid, 'is-invalid': isUserPasswordFocusAndInvalid }"
                    v-model="userPassword"
                    @input="validatePassword"
                    @focus="isUserPasswordFocus = true"
                  />
                  <div class="valid-feedback">Valid.</div>
                  <div class="invalid-feedback">1개 이상의 특수문자, 대소문자 및 숫자를 포함하고 8자리 이상이여야 합니다.</div>
                </div>
                
                <div class="input-group input-group-outline my-3">
                  <label class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    :class="{ 'is-valid': isUserPassword2FocusAndValid, 'is-invalid': isUserPassword2FocusAndInvalid }"
                    v-model="userPassword2"
                    @input="validatePassword2"
                    @focus="isUserPassword2Focus = true"
                  />
                  <div class="valid-feedback">Valid.</div>
                  <div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
                </div>

                <!-- <MaterialInput
                  id="name"
                  class="input-group-outline my-3"
                  :label="{ text: 'Name', class: 'form-label' }"
                  type="text"
                />
                <MaterialInput
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
                />
                <MaterialInput
                  id="password2"
                  class="input-group-outline mb-3"
                  :label="{ text: 'Confirm Password', class: 'form-label' }"
                  type="password"
                /> -->

                <div class="mb-3">
                    <div class="form-check form-check-inline" v-for="(code, index) in codeList" :key="index">
                        <input class="form-check-input" name="userClsf" :value="code.code" type="radio" v-model="userClsf" />
                        <label class="form-check-label">{{ code.codeName }}</label>
                    </div>
                </div>

                <div class="text-center">
                  <button
                    class="btn my-4 mb-2 bg-gradient-success w-100"
                    @click="register"
                    >Sign up</button
                  >

                  <!-- <MaterialButton
                    class="my-4 mb-2"
                    variant="gradient"
                    color="success"
                    fullWidth
                    >Sign up</MaterialButton
                  > -->
                </div>
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

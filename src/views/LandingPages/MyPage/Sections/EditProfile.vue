<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from 'vue-router'
//Vue Material Kit 2 components
import MaterialButton from "@/components/MaterialButton.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialTextArea from "@/components/MaterialTextArea.vue";

// image
import bgContact from "@/assets/img/examples/blog2.jpg";

// tooltip
import setTooltip from "@/assets/js/tooltip";

import http from "@/common/axios.js";

// store
import { useAppStore } from "@/stores";
import { useAuthStore } from "../../../../stores/authStore";
const store = useAppStore();
const { authStore, setLogout } = useAuthStore();

const router = useRouter()

const userName = ref(authStore.userName)
const userPassword = ref(authStore.userPassword)
const userPassword2 = ref('')
const userMessage = ref(authStore.userMessage)

const isUserNameFocus = ref(false)
const isUserPasswordFocus = ref(false)
const isUserPassword2Focus = ref(false)
const isUserMessageFocus = ref(false)

const isUserNameValid = ref(true)
const isUserPasswordValid = ref(true)
const isUserPassword2Valid = ref(false)
const isUserMessageValid = ref(true)

const isUserNameFocusAndValid = computed(() => isUserNameFocus.value && isUserNameValid.value) 
const isUserNameFocusAndInvalid = computed(() => isUserNameFocus.value && !isUserNameValid.value) 
const isUserPasswordFocusAndValid = computed(() => isUserPasswordFocus.value && isUserPasswordValid.value) 
const isUserPasswordFocusAndInvalid = computed(() => isUserPasswordFocus.value && !isUserPasswordValid.value) 
const isUserPassword2FocusAndValid = computed(() => isUserPassword2Focus.value && isUserPassword2Valid.value) 
const isUserPassword2FocusAndInvalid = computed(() => isUserPassword2Focus.value && !isUserPassword2Valid.value) 
const isUserMessageFocusAndValid = computed(() => isUserMessageFocus.value && isUserMessageValid.value) 
const isUserMessageFocusAndInvalid = computed(() => isUserMessageFocus.value && !isUserMessageValid.value) 

const validateUserName = () => {
  isUserNameValid.value = userName.value.length > 0 ? true : false;
  console.log(isUserNameValid.value);
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

const validateUserMessage = () => {
  isUserMessageValid.value = userMessage.value.length > 0 ? true : false;
  console.log(isUserMessageValid.value);
}

const updateUser = async() => {
  if (!isUserNameValid.value
    || !isUserPasswordValid.value
    || !isUserPassword2Valid.value
    || !isUserMessageValid.value
  ) return;

  let updateObj = {
    userName: userName.value,
    userEmail: authStore.userEmail,
    userPassword: userPassword.value,
    userMessage: userMessage.value,
  };

  console.log(updateObj);

  try {
    let { data } = await http.put("/users", updateObj);
    console.log("UsersUpdate: data : ");
    console.log(data.result);

    authStore.userName = updateObj.userName;
    authStore.userPassword = updateObj.userPassword;
    authStore.userMessage = updateObj.userMessage;
    alert('회원 정보 수정이 완료되었습니다.');
    // document.querySelector('#passconfirm').value = '';
    router.push("/");
    // let $this = this;
    // $alertify.alert("회원가입을 축하합니다. 로그인 페이지로 이동합니다", function () {
    //    $$router.push("/login");
    // });
  } catch (error) {
    console.log("UsersUpdate: error : ");
    console.log(error);
    // $alertify.error("서버에 문제가 발생했습니다.");
    alert('서버에 문제가 발생했습니다.')
  }
}

const deleteUser = async() => {
  try {
    let { data } = await http.delete("/users/" + authStore.userEmail);
    console.log("UsersDelete: data : ");
    console.log(data.result);

    if (data.result == "success") {
      alert("회원 탈퇴되었습니다.");
      setLogout();
      router.push("/");
    } else {
      alert('회원 탈퇴 중 오류가 발생했습니다.');
    }
  } catch (error) {
    alert('회원 탈퇴 중 오류가 발생했습니다.');
    console.log(error);
  }
}

onMounted(() => {
  setTooltip(store.bootstrap);
});
</script>
<template>
  <section class="py-lg-5">
    <div class="container">
      <div class="row">
        <div class="col">
          <div class="card box-shadow-xl overflow-hidden mb-5">
            <div class="row">
              <div
                class="col-lg-5 position-relative bg-cover px-0"
                :style="{ backgroundImage: `url(${bgContact})` }"
                loading="lazy"
              >
                <!-- <div
                  class="z-index-2 text-center d-flex h-100 w-100 d-flex m-auto justify-content-center"
                >
                  <div class="mask bg-gradient-dark opacity-8"></div>
                  <div
                    class="p-5 ps-sm-8 position-relative text-start my-auto z-index-2"
                  >
                    <h3 class="text-white">Contact Information</h3>
                    <p class="text-white opacity-8 mb-4">
                      Fill up the form and our Team will get back to you within
                      24 hours.
                    </p>
                    <div class="d-flex p-2 text-white">
                      <div>
                        <i class="fas fa-phone text-sm"></i>
                      </div>
                      <div class="ps-3">
                        <span class="text-sm opacity-8">(+40) 772 100 200</span>
                      </div>
                    </div>
                    <div class="d-flex p-2 text-white">
                      <div>
                        <i class="fas fa-envelope text-sm"></i>
                      </div>
                      <div class="ps-3">
                        <span class="text-sm opacity-8"
                          >hello@creative-tim.com</span
                        >
                      </div>
                    </div>
                    <div class="d-flex p-2 text-white">
                      <div>
                        <i class="fas fa-map-marker-alt text-sm"></i>
                      </div>
                      <div class="ps-3">
                        <span class="text-sm opacity-8"
                          >Dyonisie Wolf Bucharest, RO 010458</span
                        >
                      </div>
                    </div>
                    <div class="mt-4">
                      <MaterialButton
                        color="none"
                        size="lg"
                        class="btn-icon-only btn-link text-white mb-0"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        data-original-title="Log in with Facebook"
                      >
                        <i class="fab fa-facebook"></i>
                      </MaterialButton>
                      <MaterialButton
                        color="none"
                        size="lg"
                        class="btn-icon-only btn-link text-white mb-0"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        data-original-title="Log in with Twitter"
                      >
                        <i class="fab fa-twitter"></i>
                      </MaterialButton>
                      <MaterialButton
                        color="none"
                        size="lg"
                        class="btn-icon-only btn-link text-white mb-0"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        data-original-title="Log in with Dribbble"
                      >
                        <i class="fab fa-dribbble"></i>
                      </MaterialButton>
                      <MaterialButton
                        color="none"
                        size="lg"
                        class="btn-icon-only btn-link text-white mb-0"
                        data-toggle="tooltip"
                        data-placement="bottom"
                        data-original-title="Log in with Instagram"
                      >
                        <i class="fab fa-instagram"></i>
                      </MaterialButton>
                    </div>
                  </div>
                </div> -->
              </div>
              <div class="col-lg-7">
                <div class="p-3">
                  <div class="card-header px-4 py-sm-5 py-3">
                    <h2>Edit Profile</h2>
                    <!-- <p class="lead">We'd like to talk with you.</p> -->
                  </div>
                  <div class="card-body pt-1">
                    <div class="row">
                      <div class="col-md-12 pe-2 mb-3">
                        <div class="input-group input-group-static mb-4">
                          <label>My name</label>
                          <input
                            type="text"
                            class="form-control"
                            :class="{ 'is-valid': isUserNameFocusAndValid, 'is-invalid': isUserNameFocusAndInvalid }"
                            placeholder="Full Name"
                            v-model="userName"
                            @input="validateUserName"
                            @focus="isUserNameFocus = true"
                          />
                          <div class="valid-feedback">Valid.</div>
                          <div class="invalid-feedback">올바른 이름을 입력해 주세요.</div>
                        </div>
                        <!-- <MaterialInput
                          class="input-group-static mb-4"
                          label="My name"
                          type="text"
                          placeholder="Full Name"
                        /> -->
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <div class="input-group input-group-static mb-4">
                          <label>Password</label>
                          <input
                            type="password"
                            class="form-control"
                            :class="{ 'is-valid': isUserPasswordFocusAndValid, 'is-invalid': isUserPasswordFocusAndInvalid }"
                            placeholder="Password"
                            v-model="userPassword"
                            @input="validatePassword"
                            @focus="isUserPasswordFocus = true"
                          />
                          <div class="valid-feedback">Valid.</div>
                          <div class="invalid-feedback">1개 이상의 특수문자, 대소문자 및 숫자를 포함하고 8자리 이상이여야 합니다.</div>
                        </div>
                        <!-- <MaterialInput
                          class="input-group-static mb-4"
                          label="Password"
                          type="password"
                          placeholder="Password"
                        /> -->
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <div class="input-group input-group-static mb-4">
                          <label>Password Confirm</label>
                          <input
                            type="password"
                            id="passconfirm"
                            class="form-control"
                            :class="{ 'is-valid': isUserPassword2FocusAndValid, 'is-invalid': isUserPassword2FocusAndInvalid }"
                            placeholder="Password Confirm"
                            v-model="userPassword2"
                            @input="validatePassword2"
                            @focus="isUserPassword2Focus = true"
                          />
                          <div class="valid-feedback">Valid.</div>
                          <div class="invalid-feedback">비밀번호가 일치하지 않습니다.</div>
                        </div>
                        <!-- <MaterialInput
                          class="input-group-static mb-4"
                          label="Password Confirm"
                          type="password"
                          placeholder="Password Confirm"
                        /> -->
                      </div>
                      <div class="col-md-12 pe-2 mb-3">
                        <div class="input-group input-group-static mb-4">
                          <label for="message">Your message</label>
                          <textarea
                            name="message"
                            class="form-control"
                            id="Message"
                            placeholder="Message"
                            rows="6"
                            :class="{ 'is-valid': isUserMessageFocusAndValid, 'is-invalid': isUserMessageFocusAndInvalid }"
                            v-model="userMessage"
                            @input="validateUserMessage"
                            @focus="isUserMessageFocus = true"
                          />
                          <div class="valid-feedback">Valid.</div>
                          <div class="invalid-feedback">메세지는 비울 수 없습니다.</div>
                        </div>
                        <!-- <MaterialTextArea
                          class="input-group-static mb-4"
                          placeholder="Message"
                          :rows="6"
                          >Your message</MaterialTextArea
                        > -->
                      </div>
                    </div>
                    <div class="row">
                      
                      <div class="col-md-6 text-end ms-auto">
                        <button
                          class="btn w-auto me-2 bg-gradient-danger"
                          @click="deleteUser"
                          >Quit</button
                        >
                        <button
                          class="btn w-auto me-2 bg-gradient-success"
                          @click="updateUser"
                          >Save</button
                        >
                        <!-- <MaterialButton 
                          variant="gradient" 
                          color="danger" 
                          class="w-auto me-2"
                          >Quit</MaterialButton>
                        <MaterialButton
                          variant="gradient"
                          color="success"
                          type="submit"
                          class="w-auto me-2"
                          >Save</MaterialButton
                        > -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.input-group-static .form-control.is-valid, 
.input-group-static .form-control.is-invalid {
  border: none; /* 경계선 제거 */
  /* border-bottom: 2px solid; 밑줄 두께 설정 */
}

.input-group-static .form-control.is-valid {
  border-bottom-color: #28a745; /* valid 상태의 밑줄 색상 (녹색) */
}

.input-group-static .form-control.is-invalid {
  border-bottom-color: #dc3545; /* invalid 상태의 밑줄 색상 (빨강색) */
}

/* input이 focus 상태일 때 */
.input-group-static .form-control:focus.is-valid {
  box-shadow: none;
  border-bottom-color: #28a745; /* valid 상태의 focus 밑줄 색상 */
}

.input-group-static .form-control:focus.is-invalid {
  box-shadow: none;
  border-bottom-color: #dc3545; /* invalid 상태의 focus 밑줄 색상 */
}
</style>

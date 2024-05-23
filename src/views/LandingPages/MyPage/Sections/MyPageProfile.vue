<script setup>
import { ref, onMounted } from "vue";
import http from "@/common/axios.js";

//Vue Material Kit 2 components

// image

import { useAuthStore } from "../../../../stores/authStore";

// material-input
import setMaterialInput from "@/assets/js/material-input";

const { authStore, setProfileImage } = useAuthStore();

console.log(authStore);

onMounted(() => {
  setMaterialInput();

  // if(authStore.userProfileImage == null) {
  //   authStore.userProfileImage = notLoginUserProfileImage;
  // }
});

const changeImg = async(fileEvent) => {
  authStore.userProfileImage = '';

  const imgs = Array.from(fileEvent.target.files);

  imgs.forEach(file => {
    setProfileImage(URL.createObjectURL(file));
  });
  
  let formData = new FormData();

  // file upload
  let file = Array.from(imgs)[0];
  formData.append("file", file);
  console.log(file);

  let options = { 
    headers: { 'Content-Type': 'multipart/form-data' }
  }

  try{
  let {data} = await http.post('/users/img', formData, options);

  console.log("InsertUserImage: data : ");
  console.log(data);
  if (data.result == "login") {
      doLogout();
  }
  else if(data.result == "success"){
    alert('사진이 등록되었습니다.');
    console.log(file)
    console.log(authStore.userProfileImage)
    // router.go(0);
  }
  else {
    alert('사진 등록 중 오류가 발생했습니다.')
  }

  }catch(error){
    alert('사진 등록 중 오류가 발생했습니다.')
    console.log(error);
  }
}
</script>
<template>
  <section class="py-sm-7 py-5 position-relative">
    <div class="container">
      <div class="row">
        <div class="col-12 mx-auto">
          <div class="mt-n8 mt-md-n9 text-center">
            <div class="blur-shadow-avatar">
              <label for="file-input">
                <img
                  class="avatar avatar-xxl shadow-xl position-relative z-index-2"
                  :src="authStore.userProfileImage"
                  alt="Avatar"
                >
              </label>
              <input @change="changeImg" type="file" id="file-input" style="display: none;">
            </div>
          </div>
          <div class="row py-7">
            <div
              class="col-lg-7 col-md-7 z-index-2 position-relative px-md-2 px-sm-5 mx-auto"
            >
              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <h2 class="mb-0">{{ authStore.userName }}</h2>
                <div class="d-block">
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-auto">
                  <!-- <span class="h4 me-1">회원 등급 </span> -->
                  <span class="h5">{{ authStore.userRole=='020' ? '관리자' : '' }}</span>
                </div>
              </div>
              <p class="text-lg mb-0">
                {{ authStore.userMessage }}
                <br /><a
                  href="#updateUser"
                  class="text-success icon-move-right"
                  >Edit Profile
                  <i class="fas fa-arrow-right text-sm ms-1"></i>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

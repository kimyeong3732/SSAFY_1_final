<script setup>
import { onMounted } from "vue";

//Vue Material Kit 2 components
import MaterialAvatar from "@/components/MaterialAvatar.vue";
import MaterialButton from "@/components/MaterialButton.vue";

// image
import profilePic from "@/assets/img/bruce-mars.jpg";

import { useAuthStore } from "../../../../stores/authStore";

// material-input
import setMaterialInput from "@/assets/js/material-input";
onMounted(() => {
  setMaterialInput();
});

const { authStore } = useAuthStore();
</script>
<template>
  <section class="py-sm-7 py-5 position-relative">
    <div class="container">
      <div class="row">
        <div class="col-12 mx-auto">
          <div class="mt-n8 mt-md-n9 text-center">
            <div class="blur-shadow-avatar">
              <MaterialAvatar
                size="xxl"
                class="shadow-xl position-relative z-index-2"
                :image="authStore.userProfileImage"
                alt="Avatar"
              />
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
                  <!-- <MaterialButton
                    class="text-nowrap mb-0"
                    variant="outline"
                    color="success"
                    size="sm"
                    >Follow</MaterialButton
                  > -->
                </div>
              </div>
              <div class="row mb-4">
                <div class="col-auto">
                  <span class="h4 me-1">회원 등급 </span>
                  <span class="h5">{{ authStore.userRole=='010' ? '일반 회원' : '관리자' }}</span>
                </div>
                <!-- <div class="col-auto">
                  <span class="h6 me-1">3.5k</span>
                  <span>Followers</span>
                </div>
                <div class="col-auto">
                  <span class="h6 me-1">260</span>
                  <span>Following</span>
                </div> -->
              </div>
              <p class="text-lg mb-0">
                {{ authStore.useMessage }}test text
                <!-- <br /><a
                  href="javascript:;"
                  class="text-success icon-move-right"
                  >More about me
                  <i class="fas fa-arrow-right text-sm ms-1"></i>
                </a> -->
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

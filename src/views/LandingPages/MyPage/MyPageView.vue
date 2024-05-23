<script setup>
// example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";
import Header from "../../../examples/Header.vue";

// sections
import Footer from "./Sections/MyPageFooter.vue";
import Profile from "./Sections/MyPageProfile.vue";
import Posts from "./Sections/MyPageFriendship.vue";
import Contact from "./Sections/EditProfile.vue";

// image
import image from "@/assets/img/city-profile.jpg";

import AddFriendModal from "./Modals/AddFriendModal.vue";
import FriendRequestModal from "./Modals/FriendRequestModal.vue";
import { onMounted } from "vue";
import { Modal } from "bootstrap";

let addModal = null;
let requestModal = null;

onMounted(() => {
  addModal = new Modal(document.getElementById("addModal"));
  requestModal = new Modal(document.getElementById("requestModal"));
});

const showAdd = () => addModal.show();

const showRequest = () => requestModal.show();

</script>
<template>
  <DefaultNavbar transparent />
  <Header>
    <div
      class="page-header min-height-400"
      :style="{ backgroundImage: `url(${image})` }"
      loading="lazy"
    >
      <span class="mask bg-gradient-dark opacity-8"></span>
    </div>
  </Header>
  <div class="card card-body blur shadow-blur mx-3 mx-md-4 mt-n6 mb-4">
    <Profile />
    <Posts
      @call-parent-show-add="showAdd"
      @call-parent-show-request="showRequest"
    />
  </div>
  <AddFriendModal/>
  <FriendRequestModal/>
  <Contact id="updateUser"/>
  <Footer />
</template>

<script setup>
// example components
import TransparentBlogCard from "../../../../examples/cards/blogCards/TransparentBlogCard.vue";
import BackgroundBlogCard from "../../../../examples/cards/blogCards/BackgroundBlogCard.vue";

//Vue Material Kit 2 components
import post1 from "@/assets/img/examples/testimonial-6-2.jpg";
import post2 from "@/assets/img/examples/testimonial-6-3.jpg";
import post3 from "@/assets/img/examples/blog-9-4.jpg";
import post4 from "@/assets/img/examples/blog2.jpg";

import { useFriendStore } from "../../../../stores/friendStore";
import { onMounted } from "vue";

const { friendStore, getFriend } = useFriendStore();


onMounted(() => {
  getFriend();
  console.log(friendStore.friends)
});

const emit = defineEmits(['call-parent-show-add', 'call-parent-show-request']);

const showAdd = () => {
  emit('call-parent-show-add');
}

const showRequest = () => {
  emit('call-parent-show-request');
}
</script>
<template>
  <section class="py-3">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <h3 class="mb-5">Friends</h3>
        </div>
      </div>
      <div class="row">
        <div class="scrollable-row col-lg-9 col-md-12 col-12">
          <div class="col-lg-4 col-sm-6" v-for="(friend, index) in friendStore.friends" :key="index">
            <TransparentBlogCard
              :image="`http://localhost:8080/img/${friend.userProfileImage.fileUUID}`"
              :title=friend.userName
              :description=friend.userMessage
              :action="{color: 'danger', label: 'Unfriend', num: friend.userSeq}"
            />
          </div>
        </div>
        <div class="col-lg-3 col-md-12 col-12">
          <BackgroundBlogCard
            :image="post4"
            title="Friend Requests"
            description="Search users to send friend requests<br>Or manage friend requests"
            @call-parent-show-add="showAdd"
            @call-parent-show-request="showRequest"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.scrollable-row {
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
}

.scrollable-row::-webkit-scrollbar {
  height: 8px;
}

.scrollable-row::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollable-row::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.scrollable-row::-webkit-scrollbar-thumb:hover {
  background: #bbb;
}

.scrollable-row .col-lg-4 {
  display: inline-block;
  float: none;
  white-space: normal;
  margin-right: 15px; /* Add space between cards */
}

.scrollable-row .col-lg-4:last-child {
  margin-right: 0; /* Remove margin for the last card */
}
</style>
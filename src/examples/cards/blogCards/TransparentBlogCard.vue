<script setup>
import { useFriendStore } from '../../../stores/friendStore';

defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  action: {
    route: String,
    color: String,
    label: String,
    num: Number,
    default: () => ({
      color: "success",
      label: "Read more",
      num: 0,
    }),
  },
});

const { deleteRequest } = useFriendStore();

const deleteFriend = (num) => {
  deleteRequest(num);
}
</script>
<template>
  <div class="card card-plain">
    <div class="card-header p-0 position-relative">
      <a class="d-block blur-shadow-image">
        <img
          :src="image"
          :alt="title"
          class="fixed-size-img img-fluid shadow border-radius-lg"
          loading="lazy"
        />
      </a>
    </div>
    <div class="card-body px-0">
      <h5>
        <a :href="action.route" class="text-dark font-weight-bold">{{
          title
        }}</a>
      </h5>
      <p class="scrollable-text">
        {{ description }}
      </p>
      <a
        @click="deleteFriend(action.num)"
        class="text-sm icon-move-right"
        :class="`text-${action.color}`"
        >{{ action.label }}
        <i class="fas fa-arrow-right text-xs ms-1"></i>
      </a>
    </div>
  </div>
</template>

<style>
.fixed-size-img {
  width: 100%; /* Or a specific width, e.g., 200px */
  height: 200px; /* Or a specific height, e.g., 200px */
  object-fit: cover; /* To ensure the image covers the area */
}

.scrollable-text {
  height: 52px;
  overflow-y: auto;
}

.scrollable-text::-webkit-scrollbar {
  width: 8px;
}

.scrollable-text::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.scrollable-text::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.scrollable-text::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
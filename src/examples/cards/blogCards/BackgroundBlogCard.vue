<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    requierd: true,
  },
  description: {
    type: String,
    required: true,
  },
  action: {
    type: Object,
    color: String,
    default: () => ({
      color: "white",
    }),
  },
});

const emit = defineEmits(['call-parent-show-add', 'call-parent-show-request']);

const friendAdd = () => {
  emit('call-parent-show-add');
}

const friendRequest = () => {
  emit('call-parent-show-request');
}
</script>
<template>
  <div class="card card-blog card-background cursor-pointer">
    <div
      class="full-background"
      :style="{ backgroundImage: `url(${image})` }"
      loading="lazy"
    ></div>
    <div class="card-body">
      <div class="content-left text-start my-auto py-4">
        <h2 class="card-title text-white">{{ title }}</h2>
        <p class="card-description text-white" v-html="description">
        </p>
        <a
          class="text-sm icon-move-right"
          :class="`text-${action.color}`"
          @click="friendAdd"
          >Add friend
          <i class="fas fa-arrow-right text-xs ms-1"></i>
        </a>
        <br>
        <a
          class="text-sm icon-move-right"
          :class="`text-${action.color}`"
          @click="friendRequest"
          >Friend Requests
          <i class="fas fa-arrow-right text-xs ms-1"></i>
        </a>
      </div>
    </div>
  </div>
</template>

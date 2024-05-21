<template>
  <section class="pb-5 position-relative bg-gradient-dark mx-n3">
    <div class="container">
      <h3 class="text-white">Search Result</h3>
      <div class="row">
        <div class="col">
          <table class="table table-striped text-white">
            <thead>
              <tr>
                <th>대표이미지</th>
                <th>관광지명</th>
                <th>주소</th>
                <th>위도</th>
                <th>경도</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(area, index) in paginatedResults" :key="index" @click="moveCenter(area.latitude, area.longitude)">
                <td>
                  <img :src="area.firstimage" style="width: 150px; height: 70px;" @error="handleImageError(area)" />
                </td>
                <td>{{ area.title }}</td>
                <td>{{ area.addr1 }}</td>
                <td>{{ area.latitude }}</td>
                <td>{{ area.longitude }}</td>
              </tr>
            </tbody>
          </table>
          <!-- pagination -->
          <nav v-if="shouldRenderPagination" aria-label="Page navigation">
            <ul class="pagination justify-content-center">
              <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
                <a class="page-link"  @click="prevPage">Previous</a>
              </li>
              <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
                <a class="page-link"  @click="changePage(page)">{{ page }}</a>
              </li>
              <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
                <a class="page-link"  @click="nextPage">Next</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { defineEmits, defineProps, ref, computed } from 'vue';

const props = defineProps({
  searchResults: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['move-center']);

// pagination을 위한 변수
const itemsPerPage = 5; // 페이지 당 항목 수
const currentPage = ref(1); // 현재 페이지

// 전체 항목을 페이지로 분할하는 계산된 속성
const paginatedResults = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return props.searchResults.slice(startIndex, endIndex);
});

// 전체 페이지 수 계산
const totalPages = computed(() => Math.ceil(props.searchResults.length / itemsPerPage));

// 페이지 변경 함수
function changePage(page) {
  currentPage.value = page;
}

// 이전 페이지 함수
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

// 다음 페이지 함수
function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

// 이미지 에러 처리
function handleImageError(area) {
  area.firstimage = "../../src/assets/img/no_image.png";
}

// 관광지를 이동하는 함수
function moveCenter(latitude, longitude) {
  emit('move-center', latitude, longitude);
}

// 페이지네이션을 렌더링해야 하는지 여부 계산
const shouldRenderPagination = computed(() => props.searchResults.length > itemsPerPage);
</script>

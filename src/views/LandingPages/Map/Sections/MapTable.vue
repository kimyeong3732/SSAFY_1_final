<template>
  <section class="pb-5 position-relative bg-gradient-dark mx-n3">
    <div class="container">
      <h3 class="text-white">Search Result</h3>
      <div class="row">
        <div class="col">
          <table class="table table-striped text-white" >
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
              <!-- trips에 대한 데이터를 표시 -->
              <tr v-for="(area, index) in trips" :key="index" @click="moveCenter(area.latitude, area.longitude)">
                <td><img :src="area.firstimage" width="100px" /></td>
                <td>{{ area.title }}</td>
                <td>{{ area.addr1 }}</td>
                <td>{{ area.latitude }}</td>
                <td>{{ area.longitude }}</td>
              </tr>
            </tbody>
          </table>
          <!-- 검색 결과가 없는 경우에 대한 처리 -->
          <div v-if="searchResults.length === 0" class="text-white">검색 결과가 없습니다.</div>
				</div>
      </div>
    </div>
  </section>
</template>

<script setup>

</script>
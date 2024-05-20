<!-- MapMap.vue -->
<template>
  <div id="map" style="width:100%;height:500px;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  positions: Array
});

const map = ref(null);
const markers = ref([]);

function moveCenter(lat, lng) {
  if (map.value) {
    const locPosition = new kakao.maps.LatLng(lat, lng);
    map.value.setCenter(locPosition);
  }
}

function initMap() {
  const mapContainer = document.getElementById("map");
  const mapOption = {
    center: new kakao.maps.LatLng(37.500613, 127.036431),
    level: 5
  };

  map.value = new kakao.maps.Map(mapContainer, mapOption);

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      const locPosition = new kakao.maps.LatLng(lat, lon);

      const marker = new kakao.maps.Marker({
        map: map.value,
        position: locPosition
      });

      map.value.setCenter(locPosition);
    });
  } else {
    alert("현 위치를 가져올 수 없습니다.");
  }
}


function setMarkers(positions) {
  // clearMarkers 함수 호출
  clearMarkers();

  // positions 배열을 순회하면서 마커 생성
  positions.value.forEach(pos => {
    const marker = new kakao.maps.Marker({
      map: map.value, // Vue 컴포넌트 내에서 this.map을 사용하여 map에 접근
      position: new kakao.maps.LatLng(pos.lat, pos.lng)
    });
    markers.value.push(marker); // 생성한 마커를 markers 배열에 추가
  });

  // positions 배열이 비어있지 않다면, 첫 번째 위치로 중심 이동
  if (positions.value.length > 0) {
    moveCenter(positions.value[0].lat, positions.value[0].lng); // moveCenter 함수 호출
  }
}

function clearMarkers() {
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];
}

watch(props.positions, (newPositions) => {
  setMarkers(newPositions);
});

onMounted(() => {
  initMap();
});

defineExpose({ moveCenter, setMarkers });
</script>

<style scoped>
</style>

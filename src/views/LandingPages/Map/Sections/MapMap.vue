<!-- MapMap.vue -->
<template>
  <div id="map" style="width:100%;height:500px;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
// import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

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

      map.value.setCenter(locPosition);
    });
  } else {
    alert("현 위치를 가져올 수 없습니다.");
  }
}


function setMarkers(positions, imageUrl) {
  // clearMarkers 함수 호출
  // clearMarkers();
  var markerImageUrl = imageUrl, 
      markerImageSize = new kakao.maps.Size(40, 42), // 마커 이미지의 크기
      markerImageOptions = { 
          offset : new kakao.maps.Point(20, 42)// 마커 좌표에 일치시킬 이미지 안의 좌표
      };

  // 마커 이미지를 생성한다
  var markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions);

  // positions 배열을 순회하면서 마커 생성
  positions.value.forEach(pos => {
    const marker = new kakao.maps.Marker({
      map: map.value, // Vue 컴포넌트 내에서 this.map을 사용하여 map에 접근
      position: new kakao.maps.LatLng(pos.lat, pos.lng),
      image : markerImage, // 마커의 이미지
      clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생도록 설정합니다
    });

  // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
  var iwContent = '<div style="width: 300px; height: 100px; padding:5px;">' + 
                  '<h6>'+ pos.title + '</h6>'+
                  '<button id="btnRegister" type="button" style="border-radius: 4px;" @click="getList">즐겨찾기 등록</button>' +
                  '<button id="btnRegister" type="button" style="border-radius: 4px;" @click="getList">가본 곳 등록</button>' +
                  '</div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

  // 인포윈도우를 생성합니다
  var infowindow = new kakao.maps.InfoWindow({
      content : iwContent,
      removable : iwRemoveable
  });
  // 마커에 클릭이벤트를 등록합니다
  kakao.maps.event.addListener(marker, 'click', function() {
        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map.value, marker);  
  });

    markers.value.push(marker); // 생성한 마커를 markers 배열에 추가
  });

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

defineExpose({ moveCenter, setMarkers, clearMarkers, moveCenter });
</script>

<style scoped>
</style>

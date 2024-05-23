<!-- MapMap.vue -->
<template>
  <div id="map" style="width:100%;height:500px;"></div>
</template>

<script setup>
  import { onMounted, ref, watch } from 'vue';
  import http from "@/common/axios.js";

  // auth
  import {useAuthStore} from '@/stores/authStore'
  const {authStore} = useAuthStore();

  // router
  import { useRouter } from 'vue-router'
  const router = useRouter()


  const props = defineProps({
    positions: Array,
    favoritePositions: Array,  // 즐겨찾기 목록
    visitedPositions: Array     // 가본 곳 목록
  });

  const map = ref(null);
  const markers = ref([]);
  let infowindow = null;

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
    var markerImageUrl = imageUrl, 
        markerImageSize = new kakao.maps.Size(40, 42), // 마커 이미지의 크기
        markerImageOptions = { 
            offset : new kakao.maps.Point(20, 42)// 마커 좌표에 일치시킬 이미지 안의 좌표
        };

    // 마커 이미지를 생성한다
    var markerImage = new kakao.maps.MarkerImage(markerImageUrl, markerImageSize, markerImageOptions);

    const favoriteMarkerImageUrl = '../../src/assets/img/favorite.png'; // Favorite marker image URL
    const favoriteMarkerImage = new kakao.maps.MarkerImage(favoriteMarkerImageUrl, markerImageSize, markerImageOptions);

    const visitedMarkerImageUrl = '../../src/assets/img/visited.png'; // Favorite marker image URL
    const visitedMarkerImage = new kakao.maps.MarkerImage(visitedMarkerImageUrl, markerImageSize, markerImageOptions);

    // positions 배열을 순회하면서 마커 생성
    positions.value.forEach(pos => {
      const marker = new kakao.maps.Marker({
        map: map.value, // Vue 컴포넌트 내에서 this.map을 사용하여 map에 접근
        position: new kakao.maps.LatLng(pos.latitude, pos.longitude),
        image : markerImage, // 마커의 이미지
        clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생도록 설정합니다
      });
    
      markers.value[pos.attractionId] = marker;

      // 마커에 클릭이벤트를 등록합니다
      kakao.maps.event.addListener(marker, 'click', function() {

        // 인포윈도우가 열려있다면 닫음
        if(infowindow){
          infowindow.close();
        }

        const isFavorite = props.favoritePositions.some(fav => fav.attractionId === pos.attractionId);
        const isVisited = props.visitedPositions.some(vis => vis.attractionId === pos.attractionId);

        // 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
        var iwContent = `<div style="width: 300px; height: 100px; padding:5px;">
                          <h6>${pos.title}</h6>
                          ${!isFavorite ? '<button id="addFavorite" type="button" style="border-radius: 4px;">즐겨찾기 등록</button>' : ''}
                          ${isFavorite ? '<button id="deleteFavorite" type="button" style="border-radius: 4px;">즐겨찾기 삭제</button>' : ''}
                          ${!isVisited ? '<button id="addVisited" type="button" style="border-radius: 4px;">가본 곳 등록</button>' : ''}
                          ${isVisited ? '<button id="deleteVisited" type="button" style="border-radius: 4px;">가본곳 삭제</button>' : ''}
                        </div>`; // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
            

        // 인포윈도우를 생성합니다
        infowindow = new kakao.maps.InfoWindow({
          content : iwContent,
          removable : true
        });

        // 마커 위에 인포윈도우를 표시합니다
        infowindow.open(map.value, marker);  

        if (!isFavorite) {
          document.getElementById('addFavorite').addEventListener('click', function() {
            addFavoritePlace(pos, marker, favoriteMarkerImage);
          });
        }

        if (isFavorite) {
          document.getElementById('deleteFavorite').addEventListener('click', function() {
            deleteFavoritePlace(pos.attractionId);
          });
        }

        if (!isVisited) {
          document.getElementById('addVisited').addEventListener('click', function() {
            addVisitedPlace(pos, marker, visitedMarkerImage);
          });
        }

        if (isVisited) {
          document.getElementById('deleteVisited').addEventListener('click', function() {
            deleteVisitedPlace(pos.attractionId);
          });
        }
      });

        markers.value.push(marker); // 생성한 마커를 markers 배열에 추가
    });
  }


  function clearMarkers() {
    markers.value.forEach(marker => marker.setMap(null));
    markers.value = [];
  }

  function removeMarker(attractionId) {
    const marker = markers.value[attractionId];
    if (marker) {
      marker.setMap(null);
      delete markers.value[attractionId];
    }
  }

  const addFavoritePlace = async (pos, marker, favoriteMarkerImage) => {
    if (!authStore.isLogin){
      alert("로그인 후 사용해주세요");
      router.push("/pages/landing-pages/signin");
    }
    else{
      let info = {
        userSeq: authStore.userSeq,
        attractionId: pos.attractionId
      };

      try {
        let { data } = await http.post("/favorite", info); // JSON Request, { params : registerObj } X params 를 쓰면 get => query string
        console.log(data.result);

        // 즐겨찾기에 등록된 관광지 정보를 받아온다고 가정하고 해당 정보를 visitedPositions에 추가
        let favoritePlaceInfo = {
          firstimage: pos.firstimage,
          addr1: pos.addr1,
          latitude: pos.latitude,
          longitude: pos.longitude,
          title: pos.title,
          attractionId: pos.attractionId
        };

        // visitedPositions에 visitedPlaceInfo를 추가
        props.favoritePositions.push(favoritePlaceInfo);
        infowindow.close();

        marker.setImage(favoriteMarkerImage);

        alert('즐겨찾기에 등록되었습니다.');

      } catch (error) {
        console.log("UsersPage: error : ");
        console.log(error);
        alert('서버에 문제가 발생했습니다.')
      }
    }
  }

  const deleteFavoritePlace = async (attractionId, marker) => {
    if (!authStore.isLogin){
      alert("로그인 후 사용해주세요");
      router.push("/pages/landing-pages/signin");
    }

    else{
      let info = {
        userSeq: authStore.userSeq,
        attractionId: attractionId
      };

      try {
        console.log(info.userSeq);
        console.log(info.attractionId);
        
        let { response } = await http.delete("/favoriteDelete", {data: info}); // JSON Request, { params : registerObj } X params 를 쓰면 get => query string

        removeMarker(attractionId);
        infowindow.close();

        alert('즐겨찾기에서 삭제되었습니다.');

      } catch (error) {
        console.log("UsersPage: error : ");
        console.log(error);
        alert('서버에 문제가 발생했습니다.')
      }
    }
  }

  const addVisitedPlace = async (pos, marker, visitedMarkerImage) => {
    if (!authStore.isLogin){
      alert("로그인 후 사용해주세요");
      router.push("/pages/landing-pages/signin");
    } else {

      let info = {
        userSeq: authStore.userSeq,
        attractionId: pos.attractionId
      };

      try {
        let { data } = await http.post("/visited", info); // JSON Request, { params : registerObj } X params 를 쓰면 get => query string
        console.log(data);

        // 즐겨찾기에 등록된 관광지 정보를 받아온다고 가정하고 해당 정보를 visitedPositions에 추가
        let visitedPlaceInfo = {
          firstimage: pos.firstimage,
          addr1: pos.addr1,
          latitude: pos.latitude,
          longitude: pos.longitude,
          title: pos.title,
          attractionId: pos.attractionId
        };

        // visitedPositions에 visitedPlaceInfo를 추가
        props.visitedPositions.push(visitedPlaceInfo);
        infowindow.close();

        marker.setImage(visitedMarkerImage);


        alert('가본 곳에 등록되었습니다.');
        // router.push("/pages/landing-pages/signin");

      } catch (error) {
        console.log("UsersPage: error : ");
        console.log(error);
        alert('서버에 문제가 발생했습니다.')
      }
    }
  }

  const deleteVisitedPlace = async (attractionId, marker) => {
    if (!authStore.isLogin){
      alert("로그인 후 사용해주세요");
      router.push("/pages/landing-pages/signin");
    } else{

      let info = {
        userSeq: authStore.userSeq,
        attractionId: attractionId
      };

      try {
        console.log(info.userSeq);
        console.log(info.attractionId);
        
        let { response } = await http.delete("/visitedDelete", {data: info}); // JSON Request, { params : registerObj } X params 를 쓰면 get => query string

        removeMarker(attractionId);
        infowindow.close();

        alert('가본 곳에서 삭제되었습니다.');
        // router.push("/pages/landing-pages/signin");

      } catch (error) {
        console.log("UsersPage: error : ");
        console.log(error);
        alert('서버에 문제가 발생했습니다.')
      }
    }
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

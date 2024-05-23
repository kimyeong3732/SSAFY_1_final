<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import http from "@/common/axios.js";
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";
import bg0 from "@/assets/img/bg9.jpg";
import Typed from "typed.js";
import MapMap from "./Sections/MapMap.vue";
import MapTable from "./Sections/MapTable.vue";
import MapVisited from "./Sections/MapVisited.vue";
import MapFavorite from "./Sections/MapFavorite.vue";

import {useAuthStore} from '@/stores/authStore'

const {authStore} = useAuthStore();

const body = document.getElementsByTagName("body")[0];

const positions = ref([]);
const favoritePositions = ref([]);
const visitedPositions = ref([]);

const mapTableRef = ref(null);
const mapComponent = ref(null);
const current = {};

const trips = ref([]);
const favoriteList = ref([]);
const visitedList = ref([]);

onMounted(() => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  if (document.getElementById("typed")) {
    new Typed("#typed", {
      stringsElement: "#typed-strings",
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 200,
      startDelay: 500,
      loop: true,
    });
  }

  setCurrentPosition();

  if (authStore.isLogin) {
    getVisitedList();
    getFavoriteList();
  }
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});

function setCurrentPosition() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      current.lat = position.coords.latitude;
      current.lon = position.coords.longitude;
    });
  } else {
    alert("현 위치를 가져올 수 없습니다.");
  }
}

function updatePositions(newPositions) {
  positions.value = newPositions;
}

function moveCenter(latitude, longitude) {
  if (mapComponent.value && mapComponent.value.setCenter) {
    mapComponent.value.setCenter({ lat: latitude, lng: longitude });
  }
}

function setMarkers(positions, imageUrl) {
  if (mapComponent.value && mapComponent.value.setMarkers) {
    mapComponent.value.setMarkers(positions, imageUrl);
  }
}

function clearMarkers() {
  mapComponent.value.clearMarkers();
}

async function getList() {
  try {
    const sidoCode = document.querySelector("#sidoList").value;
    const attractionId = document.querySelector("#search-content-id").value;
    const word = document.querySelector("#search-keyword").value;
    const chkSort = document.querySelector("#flexCheckChecked").checked ? "true" : "false";
    const curLatitude = current.lat;
    const curLongitude = current.lon;

    let { data } = await http.get(`/attraction/search`, {
      params: {
        sidoCode,
        attractionId,
        word,
        chkSort,
        curLatitude,
        curLongitude
      }
    });
    console.log(data);
    
    trips.value = data;

    positions.value = data.map(item => ({
      lat: item.latitude,
      lng: item.longitude,
      title: item.title,
      attractionId: item.attractionId
    }));

    clearMarkers();

    if (positions.value.length > 0) {
      setMarkers(positions, '../../src/assets/img/search.png');
      // positions 배열이 비어있지 않다면, 첫 번째 위치로 중심 이동
      mapComponent.value.moveCenter(positions.value[0].lat, positions.value[0].lng); // moveCenter 함수 호출
      // console.log(positions.value[0].title);
    }
    if (favoritePositions.value.length > 0) {
      setMarkers(favoritePositions, '../../src/assets/img/favorite.png');
    }
    if (visitedPositions.value.length > 0) {
      setMarkers(visitedPositions, '../../src/assets/img/visited.png');
    }

  } catch (error) {
    console.error(error);
  }
}

async function getFavoriteList() {
  try {

    let { data } = await http.get("/favorite/" + authStore.userSeq);
    console.log(data);
    
    favoriteList.value = data;

    favoritePositions.value = data.map(item => ({
      lat: item.latitude,
      lng: item.longitude,
      title: item.title,
      attractionId: item.attractionId
    }));

    if (favoritePositions.value.length > 0) {
      setMarkers(favoritePositions, '../../src/assets/img/favorite.png');
    }
  } catch (error) {
    console.error(error);
  }
}

async function getVisitedList() {
  try {

    let { data } = await http.get("/visited/" + authStore.userSeq);
    console.log(data);
    
    visitedList.value = data;

    visitedPositions.value = data.map(item => ({
      lat: item.latitude,
      lng: item.longitude,
      title: item.title,
      attractionId: item.attractionId
    }));

    if (visitedPositions.value.length > 0) {
      setMarkers(visitedPositions, '../../src/assets/img/visited.png');
    }
  } catch (error) {
    console.error(error);
  }
}

</script>

<template>
  <DefaultNavbar
    :action="{
      route: 'javascript:;',
      label: 'Buy Now',
      color: 'btn-white',
    }"
    transparent
  />
  <header class="bg-gradient-dark">
    <div
      class="page-header min-vh-50"
      :style="{ backgroundImage: `url(${bg0})` }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center text-center">
          <h1 class="text-white">
            Where are we going in <span class="text-white" id="typed"></span>
          </h1>
          <div id="typed-strings">
            <h1>Seoul ?</h1>
            <h1>Incheon ?</h1>
            <h1>Daejeon ?</h1>
            <h1>Daegu ?</h1>
            <h1>Gwangju ?</h1>
            <h1>Busan ?</h1>
            <h1>Ulsan ?</h1>
            <h1>Sejong ?</h1>
            <h1>Gyeonggi ?</h1>
            <h1>Gangwon ?</h1>
            <h1>Chungcheong ?</h1>
            <h1>Gyeongsang ?</h1>
            <h1>Jeolla ?</h1>
            <h1>Jeju ?</h1>
          </div>
          <p class="lead mb-4 text-white opacity-8">
            Do your search and experience the amazing experience!!!
          </p>
          <div class="col-lg-8  mx-auto my-auto">
            <div class="row">
              <div class="col-3">
                <select id="sidoList" class="form-select text-white">
                  <option class="text-dark" value=''>시도</option>
                  <option class="text-dark" value='1'>서울</option>
                  <option class="text-dark" value='2'>인천</option>
                  <option class="text-dark" value='3'>대전</option>
                  <option class="text-dark" value='4'>대구</option>
                  <option class="text-dark" value='5'>광주</option>
                  <option class="text-dark" value='6'>부산</option>
                  <option class="text-dark" value='7'>울산</option>
                  <option class="text-dark" value='8'>세종</option>
                  <option class="text-dark" value='31'>경기</option>
                  <option class="text-dark" value='32'>강원</option>
                  <option class="text-dark" value='33'>충북</option>
                  <option class="text-dark" value='34'>충남</option>
                  <option class="text-dark" value='35'>경북</option>
                  <option class="text-dark" value='36'>경남</option>
                  <option class="text-dark" value='37'>전북</option>
                  <option class="text-dark" value='38'>전남</option>
                  <option class="text-dark" value='39'>제주</option>
                </select>
              </div>
              <div class="col-3">
                <select id="search-content-id" class="form-select me-2 text-white">
                  <option class="text-dark" value="0" selected>관광지 유형</option>
                  <option class="text-dark" value="12">관광지</option>
                  <option class="text-dark" value="14">문화시설</option>
                  <option class="text-dark" value="15">축제공연행사</option>
                  <option class="text-dark" value="25">여행코스</option>
                  <option class="text-dark" value="28">레포츠</option>
                  <option class="text-dark" value="32">숙박</option>
                  <option class="text-dark" value="38">쇼핑</option>
                  <option class="text-dark" value="39">음식점</option>
                </select>
              </div>
              <div class="col-3">
                <input id="search-keyword" class="form-control me-2 text-white" style="border: solid 1px; border-color: white;"
                  type="search" placeholder="검색어" aria-label="검색어" />
              </div>

              <div class="col-1">
                <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked" checked>
                <label class="form-check-label text-white" for="flexCheckChecked">
                  정렬
                </label>
              </div>

              <div class="col-2">
                <div class="d-grid gap-2">
                  <button id="btnSearch" type="button" class="btn bg-white text-dark" @click="getList">검색</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6">
    <MapMap ref="mapComponent" :positions="positions" :visitedPositions="visitedPositions" :favoritePositions="favoritePositions"/><br>
    <MapTable ref="mapTableRef" :search-results="trips" @update-positions="updatePositions" @move-center="moveCenter" />
    <template v-if="authStore.isLogin">
      <MapFavorite :favorite-list="favoriteList" />
      <MapVisited :visited-list="visitedList" />
    </template>
  </div>
  <DefaultFooter />
</template>

<style scoped>
.form-check-input {
  background-color: #fff;
  opacity: 0.5;
}
.form-check-input:checked[type=checkbox] {
  opacity: 1;
  background-image: linear-gradient(195deg, #fff 0%, #fff 100%);
}
</style>

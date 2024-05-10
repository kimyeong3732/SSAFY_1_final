<script setup>
import { onMounted, onUnmounted } from "vue";

//example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

//image
import bg0 from "@/assets/img/bg9.jpg";

//dep
import Typed from "typed.js";

//sections
import Information from "./Sections/AboutInformation.vue";
import AboutTeam from "./Sections/AboutTeam.vue";
import Featuring from "./Sections/AboutFeaturing.vue";
import Newsletter from "./Sections/AboutNewsletter.vue";

const body = document.getElementsByTagName("body")[0];
//hooks
onMounted(() => {
  body.classList.add("about-us");
  body.classList.add("bg-gray-200");

  if (document.getElementById("typed")) {
    // eslint-disable-next-line no-unused-vars
    var typed = new Typed("#typed", {
      stringsElement: "#typed-strings",
      typeSpeed: 90,
      backSpeed: 90,
      backDelay: 200,
      startDelay: 500,
      loop: true,
    });
  }
});

onUnmounted(() => {
  body.classList.remove("about-us");
  body.classList.remove("bg-gray-200");
});
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
      class="page-header min-vh-75"
      :style="{ backgroundImage: `url(${bg0})` }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center mx-auto my-auto">
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
              We’re constantly trying to express ourselves and actualize our
              dreams. If you have the opportunity to play this game
            </p>

            <div class="row">
							<div class="col-3">
								<!-- class="form-select" -->
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
									<button id="btnSearch" type="button" class="btn bg-white text-dark">검색</button>
								</div>
							</div>
						</div>
            
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6">
    <Information />
    <AboutTeam />
    <Featuring />
    <Newsletter />
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

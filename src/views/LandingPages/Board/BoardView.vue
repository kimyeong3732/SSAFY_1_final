<script setup>
import { ref, onMounted, onUnmounted } from "vue";

//example components
import DefaultNavbar from "../../../examples/navbars/NavbarDefault.vue";
import DefaultFooter from "../../../examples/footers/FooterDefault.vue";

// common
import http from "@/common/axios.js";

//image
import bg0 from "@/assets/img/bg9.jpg";

//dep
import Typed from "typed.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'bootstrap';

//sections
import BoardList from "./Sections/BoardList.vue";
import InsertModal from "./Modals/InsertModal.vue";
import DetailModal from "./Modals/DetailModal.vue";
import UpdateModal from "./Modals/UpdateModal.vue";
import PaginationUI from "./Sections/PaginationUI.vue";

// router
import { useRouter } from 'vue-router';

// store
import { useBoardStore } from '@/stores/boardStore';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();

const { boardStore, boardList, setBoardMovePage, setBoardDetail } = useBoardStore();
const { setLogout } = useAuthStore();

// data
let insertModal = null;
let detailModal = ref(null);
let updateModal = null;

const body = document.getElementsByTagName("body")[0];

// hooks
onMounted(() => {
  insertModal = new Modal(document.getElementById("insertModal"));
  detailModal = new Modal(document.getElementById("detailModal"));
  updateModal = new Modal(document.getElementById("updateModal"));
  
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

// 초기 작업
boardList();

// pagination
const movePage = (pageIndex) => {
    console.log("BoardMainVue : movePage : pageIndex : " + pageIndex);
    setBoardMovePage(pageIndex);
    boardList();
}

// insert
const showInsertModal = () => insertModal.show();
const closeAfterInsert = () => {
    insertModal.hide();
    boardList();
}

const showDetailModal = () => {
    detailModal.show();
}

const changeToUpdate = () => {
    detailModal.hide();
    updateModal.show();
}

const closeAfterUpdate = () => {
    updateModal.hide();
    boardList();
}

const changeToDelete = () => {
    detailModal.hide();

    if (confirm('이 글을 삭제하시겠습니까?')) {
        boardDelete();
    }
}

const boardDelete = async () => {
    try {
        let { data } = await http.delete("/boards/" + boardStore.boardId);
        console.log(data);

        if (data.result == "login") {
            doLogout();
        } else if (data.result == "success") {
            alert("글이 삭제되었습니다.");
            boardList();
        } else {
            alert('글 삭제 중 오류가 발생했습니다.');
        }
    } catch (error) {
        alert('글 삭제 중 오류가 발생했습니다.');
        console.log(error);
    }
}

// logout 처리 별도 method
const doLogout = () => {
    setLogout();
    router.push("/login");
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
      class="page-header min-vh-25"
      :style="{ backgroundImage: `url(${bg0})` }"
    >
      <span class="mask bg-gradient-dark opacity-6"></span>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 text-center mx-auto my-auto">
            <h1 class="text-white">Board</h1>
          </div>
        </div>
      </div>
    </div>
  </header>
  <div class="card card-body shadow-xl mx-3 mx-md-4 mt-n6">
    <div class="container mt-3">
      <div class="input-group mb-3">
        <!-- store 사용 -->
        <input v-model="boardStore.searchWord" @keydown.enter="boardList" type="text" class="form-control" />
        <button @click="boardList" class="btn btn-success" type="button">Search</button>
      </div>
      <BoardList @call-parent-show-detail="showDetailModal"></BoardList>
      <PaginationUI @call-parent="movePage"></PaginationUI>
      <button class="col-1 btn btn-primary" @click="showInsertModal">글쓰기</button>
    </div>
    
    <InsertModal @call-parent-insert="closeAfterInsert"></InsertModal>
    <DetailModal @call-parent-change-to-update="changeToUpdate" @call-parent-change-to-delete="changeToDelete"></DetailModal>
    <UpdateModal @call-parent-update="closeAfterUpdate"></UpdateModal>
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

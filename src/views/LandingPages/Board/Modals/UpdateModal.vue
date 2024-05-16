<template>
    <div class="modal" tabindex="-1" id="updateModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">글 수정</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <!-- v-model 을 store 와 직접 연결하기 보다 computed-get-set 을 사용(strict mode 에서는 오류 발생) -->
                        <!-- <input v-model="$store.state.board.title" type="text" class="form-control" placeholder="제목"> -->
                        <input v-model="boardStore.title" type="text" class="form-control" placeholder="제목" />
                    </div>
                    <div class="mb-3">
                        <!-- <div id="divEditorUpdate"></div> -->
                        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                    </div>
                    <!-- 기존 파일 내용 보여줌  -->
                    <!-- 새로운 첨부파일은 data-fileList 로 -->
                    <div v-if="boardStore.fileList.length > 0" class="mb-3">
                        첨부파일 :
                        <span>
                            <div v-for="(file, index) in boardStore.fileList" class="fileName" :key="index">{{ file.fileName }}</div>
                        </span>
                    </div>
                    <div class="form-check mb-3">
                        <input v-model="attachFile" class="form-check-input" type="checkbox" value="" id="chkFileUploadUpdate" />
                        <label class="form-check-label" for="chkFileUploadUpdate">파일 추가</label>
                    </div>
                    <div class="mb-3" v-show="attachFile" id="imgFileUploadUpdateWrapper">
                        <input @change="changeFile" type="file" id="inputFileUploadUpdate" multiple />
                        <div id="imgFileUploadUpdateThumbnail" class="thumbnail-wrapper">
                            <!-- vue way img 를 만들어서 append 하지 않고, v-for 로 처리 -->
                            <img v-for="(file, index) in fileList" v-bind:src="file" v-bind:key="index" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="boardUpdate" class="btn btn-sm btn-primary btn-outline" data-dismiss="modal" type="button">수정</button>
                </div>
                <!-- {{ editorData.value }} {{ boardStore.content }} {{ boardStore.title }} -->
            </div>
        </div>
    </div>
    
</template>
 
<script setup>
import { ref, onMounted } from 'vue'
import http from "@/common/axios.js";
 
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
// import VueAlertify from 'vue-alertify'; 
 
// router
import { useRouter } from 'vue-router'
const router = useRouter()
 
import {useBoardStore} from '@/stores/boardStore.js'
const {boardStore} = useBoardStore();
 
import {useAuthStore} from '@/stores/authStore'
const {setLogout} = useAuthStore()
 
const ckeditor = CKEditor.component
const editor = ClassicEditor
// 아래처럼 하면 안된다. editorData 가 empty 로 유지된다. 일단 공백으로 하고 onMounted 에서 bootstrap event 를 이용해서 show 될 때 store의 값으로 설정하도록
// const editorData = ref(boardStore.content)
const editorData = ref('')
// https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/configuration.html
const editorConfig = {}
 
const attachFile = ref(false)
const fileList = ref([]);
 
const initUI = () => {
    editorData.value = boardStore.content
 
    attachFile.value = false;
    fileList.value = [];
    document.querySelector("#inputFileUploadUpdate").value = '';
}
 
const changeFile = (fileEvent) =>{
    fileList.value = []; // thumbnail 초기화
     
    const fileArray = Array.from(fileEvent.target.files);
    fileArray.forEach( file => {
        fileList.value.push(URL.createObjectURL(file)); // push : array 에 항목 추가
    });
}
 
const boardUpdate = async () => {
    // post form data
    let formData = new FormData();
    formData.append("boardId", boardStore.boardId); // update 에 추가
    formData.append("title", boardStore.title);
    formData.append("content", editorData.value); // store X !!!!
 
    // file upload
    let attachFiles = document.querySelector("#inputFileUploadUpdate").files;
 
    if (attachFiles.length > 0) {
        const fileArray = Array.from(attachFiles);
        fileArray.forEach((file) => formData.append("file", file));
    }
 
    let options = {
        headers: { "Content-Type": "multipart/form-data" },
    };
 
    // not put, REST but FileUpload
    // 백엔드 transaction 테스트 용도 포함
    try {
        let { data } = await http.post("/boards/" + boardStore.boardId, formData, options);
        // let { data } = await http.post("/boards/tx/" + boardStore.boardId, formData, options);
 
        console.log("UpdateModalVue: data : ");
        console.log(data);
        if (data.result == "login") {
            doLogout();
        }else if(data.result == "success"){
            // $alertify.success("글이 수정되었습니다.");
            alert('글이 수정되었습니다.')
            closeModal();
        }else {
            alert('글 수정 중 오류가 발생했습니다.')
        }
    } catch (error) {
        alert('글 수정 중 오류가 발생했습니다.')
        console.log(error);
    }
}
 
const emit = defineEmits(['call-parent-update'])
const closeModal = () => emit('call-parent-update')
 
// logout 처리 별도 method
const doLogout = () => {
   setLogout()
   router.push("/login");
}
 
onMounted(() => {
       // bootstrap modal show event hook
    // UpdateModal 이 보일 때 초기화
    const thisModal = document.getElementById('updateModal')
    thisModal.addEventListener("show.bs.modal", function () {
       initUI();
    });   
})
 
</script>
 
<style scoped>
.modal:deep(.ck-editor__editable) {
    min-height: 300px !important;
}
 
.modal:deep(.thumbnail-wrapper) {
    margin-top: 5px;
}
 
.modal:deep(.thumbnail-wrapper img) {
    width: 100px !important;
    margin-right: 5px;
    max-width: 100%;
}
</style>
 
<template>
    <div class="modal" tabindex="-1" id="insertModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">글 쓰기</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
            
                    <div class="mb-3">
                        <input v-model="title" type="text" class="form-control" placeholder="제목">
                    </div>
                    <div class="mb-3">
                        <!-- <div id=divEditorInsert></div> -->
                        <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
                    </div>
                    <div class="form-check mb-3">
                        <input v-model="attachFile" class="form-check-input" type="checkbox" value="" id="chkFileUploadInsert">
                        <label class="form-check-label" for="chkFileUploadInsert">파일 추가</label>
                    </div>
                    <div class="mb-3" v-show="attachFile" id="imgFileUploadInsertWrapper">
                        <input @change="changeFile" type="file" id="inputFileUploadInsert" multiple>
                        <div id="imgFileUploadInsertThumbnail" class="thumbnail-wrapper">
                            <!-- vue way img 를 만들어서 append 하지 않고, v-for 로 처리 -->
                            <img v-for="(file, index) in fileList" v-bind:src="file" v-bind:key="index">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="boardInsert" class="btn btn-sm btn-primary btn-outline" data-dismiss="modal" type="button">등록</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import http from "@/common/axios.js";

import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

import {useAuthStore} from '@/stores/authStore.js'
const {setLogout} = useAuthStore()

// router
import { useRouter } from 'vue-router'
const router = useRouter()

const ckeditor = CKEditor.component
const editor = ClassicEditor
const editorData = ref('')
const editorConfig = {}

const title = ref('')
const attachFile = ref(false)
const fileList = ref([]);
const inputFile = ref('')

onMounted(() => {
    // console.log( document.querySelector("#inputFileUploadInsert") )
    initUI();
});

const initUI = () => {
    title.value = '';
    editorData.value = '';
    attachFile.value = false;
    fileList.value = [];
    document.querySelector("#inputFileUploadInsert").value = '';
}

const changeFile = (fileEvent) =>{
    fileList.value = []; // thumbnail 초기화
    
    const fileArray = Array.from(fileEvent.target.files);
    fileArray.forEach( file => {
        fileList.value.push(URL.createObjectURL(file)); // push : array 에 항목 추가
    });
}
        // 굳이 actions 에 있을 필요 없다. backend async 작업이지만, 그 결과로 store 를 변경하는 내용이 없다.
const boardInsert = async () => {
    let formData = new FormData();
    formData.append("title", title.value);
    formData.append("content", editorData.value);

    // file upload
    let attachFiles = document.querySelector("#inputFileUploadInsert").files;

    if( attachFiles.length > 0 ) {
        const fileArray = Array.from(attachFiles);
        fileArray.forEach( file => formData.append("file", file) )
    }

    let options = { 
        headers: { 'Content-Type': 'multipart/form-data' }
    }

    try{
    let {data} = await http.post('/boards', formData, options);

    console.log("InsertModalVue: data : ");
    console.log(data);
    if (data.result == "login") {
        doLogout();
    }else if(data.result == "success"){
        alert('글이 등록되었습니다.');
        closeModal();
    }else {
        alert('글 등록 중 오류가 발생했습니다.')
    }

    }catch(error){
        alert('글 등록 중 오류가 발생했습니다.')
        console.log(error);
    }
}

const emit = defineEmits(['call-parent-insert'])
const closeModal = () => emit('call-parent-insert')

// logout 처리 별도 method
const doLogout = () => {
    setLogout()
    router.push("/login");
}

onMounted(() => {
    // bootstrap modal show event hook
    // UpdateModal 이 보일 때 초기화
    const thisModal = document.getElementById('insertModal')
    thisModal.addEventListener("show.bs.modal", function () {
        initUI();
    });   
});

</script>

<style scoped>

.modal:deep(.ck-editor__editable) {
    min-height: 300px !important;
}

.modal:deep(.thumbnail-wrapper){
    margin-top: 5px;
}

.modal:deep(.thumbnail-wrapper img) {
    width: 100px !important;
    margin-right: 5px;
    max-width: 100%;
}
</style>
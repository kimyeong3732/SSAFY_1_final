<template>
    <div class="modal" tabindex="-1" id="addModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Friend</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
            
                    <div class="input-group mb-3">
                        <input v-model="str" type="text" class="form-control" @keydown.enter="searchUser" placeholder="Search Users">
                        <button @click="searchUser" class="btn btn-success" type="button">Search</button>
                    </div>
                    <div class="mb-3 table-add">
                      <table class="w-100">
                            <thead>
                                <tr>
                                    <th class="col-1">#</th>
                                    <th class="col-9">Name</th>
                                    <th class="col-2">Friend</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(user, index) in paginatedUsers" :key="index">
                                    <th>{{ (currentPage - 1) * pageSize + index + 1 }}</th>
                                    <td>{{ user.userName }}</td>
                                    <td><button @click="addBtn(user.userSeq)" class="btn btn-success">Add</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <p v-if="friendStore.users.length==0">No search results</p>
                    </div>
                    <Pagination
                        :current-page="currentPage"
                        :total-pages="totalPages"
                        @change-page="changePage"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Pagination from './FriendPagination.vue';

import { ref, computed, onMounted } from 'vue';

import { useFriendStore } from '../../../../stores/friendStore';

const { friendStore, resetUser, getUser, addRequest } = useFriendStore();

const str = ref('');

// Pagination variables
const pageSize = 5;
const currentPage = ref(1);

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return friendStore.users.slice(start, end);
});

const totalPages = computed(() => Math.ceil(friendStore.users.length / pageSize));

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

onMounted(() => {
  const thisModal = document.getElementById('addModal');
  thisModal.addEventListener("show.bs.modal", function () {
    initUI();
  });
});

const initUI = () => {
  str.value = '';
  resetUser();
}

const searchUser = () => {
  getUser(str.value);
  currentPage.value = 1;
}

const addBtn = (userSeq) => {
    console.log(userSeq);
    addRequest(userSeq, str.value);
}
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

.table-add {
    height: 318px;
    overflow: auto;
}

.btn.btn-success {
    background-color: #d1e7dd; /* 연두색 */
    border-color: #bbe4d6; /* 연두색 */
    color: #155724; /* 연두색 텍스트 */
}

.btn.btn-success:hover {
    background-color: #45a049; /* Darker Green */
    color: #fff;
}
</style>
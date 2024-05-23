<template>
    <div class="modal" tabindex="-1" id="requestModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Friend requests</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-3">
                        <ul class="nav nav-tabs">
                            <li class="nav-item" @click="activeTab = 'request'">
                                <a class="nav-link" :class="{ active: activeTab === 'request' }">My Request</a>
                            </li>
                            <li class="nav-item" @click="activeTab = 'notResponse'">
                                <a class="nav-link" :class="{ active: activeTab === 'notResponse' }">Not Response</a>
                            </li>
                            <li class="nav-item" @click="activeTab = 'rejected'">
                                <a class="nav-link" :class="{ active: activeTab === 'rejected' }">Rejected</a>
                            </li>
                        </ul>
                    </div>
                    <!-- My Request Table -->
                    <div v-if="activeTab === 'request'">
                        <div class="table-request">
                            <table class="w-100">
                                <thead>
                                    <tr>
                                        <th class="col-1">#</th>
                                        <th class="col-6">Name</th>
                                        <th class="col-5">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, index) in paginatedRequestUsers" :key="index">
                                        <td>{{ (requestCurrentPage - 1) * pageSize + index + 1 }}</td>
                                        <td>{{ user.userName }}</td>
                                        <td>
                                            <button class="btn btn-success" @click="acceptRequest(user.userSeq)">Accept</button>
                                            <button class="btn btn-danger" @click="rejectRequest(user.userSeq)">Reject</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-if="paginatedRequestUsers.length === 0">No requests</p>
                        </div>
                        <pagination
                            :current-page="requestCurrentPage"
                            :total-pages="requestTotalPages"
                            @change-page="changeRequestPage"
                        />
                    </div>
                    <!-- Not Response Table -->
                    <div v-if="activeTab === 'notResponse'">
                        <div class="table-request">
                            <table class="w-100">
                                <thead>
                                    <tr>
                                        <th class="col-1">#</th>
                                        <th class="col-9">Name</th>
                                        <th class="col-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, index) in paginatedNotResponseUsers" :key="index">
                                        <td>{{ (notResponseCurrentPage - 1) * pageSize + index + 1 }}</td>
                                        <td>{{ user.userName }}</td>
                                        <td>
                                            <button class="btn btn-danger" @click="cancelRequest(user.userSeq)">Cancel</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-if="paginatedNotResponseUsers.length === 0">No requests</p>
                        </div>
                        <pagination
                            :current-page="notResponseCurrentPage"
                            :total-pages="notResponseTotalPages"
                            @change-page="changeNotResponsePage"
                        />
                    </div>
                    <!-- Rejected Table -->
                    <div v-if="activeTab === 'rejected'">
                        <div class="table-request">
                            <table class="w-100">
                                <thead>
                                    <tr>
                                        <th class="col-1">#</th>
                                        <th class="col-9">Name</th>
                                        <th class="col-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(user, index) in paginatedRejectedUsers" :key="index">
                                        <td>{{ (rejectedCurrentPage - 1) * pageSize + index + 1 }}</td>
                                        <td>{{ user.userName }}</td>
                                        <td>
                                            <button class="btn btn-secondary" @click="cancelRequest(user.userSeq)">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <p v-if="paginatedRejectedUsers.length === 0">No requests</p>
                        </div>
                        <pagination
                            :current-page="rejectedCurrentPage"
                            :total-pages="rejectedTotalPages"
                            @change-page="changeRejectedPage"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Pagination from './FriendPagination.vue';

import { useFriendStore } from '../../../../stores/friendStore';

const activeTab = ref('request');
const { friendStore, getRequest, getNotReject, getReject, updateRequest, deleteRequest } = useFriendStore();
const pageSize = 5;

// Request tab pagination
const requestCurrentPage = ref(1);
const paginatedRequestUsers = computed(() => {
  const start = (requestCurrentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return friendStore.requests.slice(start, end);
});
const requestTotalPages = computed(() => Math.ceil(friendStore.requests.length / pageSize));
const changeRequestPage = (page) => {
  requestCurrentPage.value = page;
};

// Not Response tab pagination
const notResponseCurrentPage = ref(1);
const paginatedNotResponseUsers = computed(() => {
  const start = (notResponseCurrentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return friendStore.notrejects.slice(start, end);
});
const notResponseTotalPages = computed(() => Math.ceil(friendStore.notrejects.length / pageSize));
const changeNotResponsePage = (page) => {
  notResponseCurrentPage.value = page;
};

// Rejected tab pagination
const rejectedCurrentPage = ref(1);
const paginatedRejectedUsers = computed(() => {
  const start = (rejectedCurrentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return friendStore.rejects.slice(start, end);
});
const rejectedTotalPages = computed(() => Math.ceil(friendStore.rejects.length / pageSize));
const changeRejectedPage = (page) => {
  rejectedCurrentPage.value = page;
};

onMounted(() => {
  const thisModal = document.getElementById('requestModal');
  thisModal.addEventListener("show.bs.modal", function () {
    initUI();
  });
});

const initUI = () => {
    getRequest();
    getNotReject();
    getReject();

    activeTab.value = 'request';
    requestCurrentPage.value = 1;
    notResponseCurrentPage.value = 1;
    rejectedCurrentPage.value = 1;
}

const acceptRequest = (userSeq) => {
    updateRequest(userSeq, 1);
}

const rejectRequest = (userSeq) => {
    updateRequest(userSeq, 0);
}

const cancelRequest = (userSeq) => {
    deleteRequest(userSeq);
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

.table-request {
    height: 318px;
    overflow: auto;
}

/* Add styles for the nav-tabs */
.nav-tabs .nav-link {
    color: #7b809a;
    cursor: pointer; /* Change cursor on hover */
}

.nav-tabs .nav-link.active {
    color: #66d432;
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

.btn-danger {
    background-color: #f8d7da; /* 연한 붉은색 */
    border-color: #f5c6cb; /* 연한 붉은색 */
    color: #721c24; /* 연한 붉은색 텍스트 */
}

.btn.btn-danger:hover {
    background-color: #da190b; /* Darker Red */
}

.btn.btn-secondary {
    background-color: #e2e3e5; /* 연한 회색 */
    border-color: #d6d8db; /* 연한 회색 */
    color: #6c757d; /* 연한 회색 텍스트 */
}

.btn.btn-secondary:hover {
    background-color: #7b809a; /* Darker Red */
    color: #fff;
}
</style>
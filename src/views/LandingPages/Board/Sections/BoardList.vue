<template lang="">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th>#</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>작성일시</th>
                    <th>조회수</th>
                </tr>
            </thead>
            <tbody>
				<tr v-for="(board) in boardStore.list" @click="boardDetail(board.boardId)" v-bind:key="board.boardId">
					<td>{{ board.boardId }}</td>
					<td>{{ board.title }}</td>
					<td>{{ board.userName }}</td>
					<td>{{ util.makeDateStr(board.regDt.date, '.') }}</td>
					<td>{{ board.readCount }}</td>
				</tr>
			</tbody>
        </table>
</template>

<script setup>
import http from "@/common/axios.js";
import util from "@/common/util.js";
import {useBoardStore} from '@/stores/boardStore'
import {useAuthStore} from '@/stores/authStore'

const {boardStore, setBoardDetail } = useBoardStore();
const {authStore, setLogout} = useAuthStore();

// router
import { useRouter } from 'vue-router'
const router = useRouter()

const emit = defineEmits(['call-parent-show-detail'])
const boardDetail = async (boardId) => {
    try {
        let { data } = await http.get("/boards/" + boardId);

        if (data.result == "login") {
            doLogout();
        }else if(data.result == "success"){
            let { dto } = data;
            if( authStore.userRole == '020' ) {
                dto.sameUser = true;
            }
            setBoardDetail(dto);

            // props.detailModal.show();
            emit('call-parent-show-detail');
        }else{
            alert('글 조회 중 오류가 발생했습니다.')
        }
    } catch (error) {
        console.log("BoardMainVue: error : ");
        alert("로그인 후 사용해주세요");
        router.push("/pages/landing-pages/signin");
    }

}

const doLogout = () => {
    setLogout()
    router.push("/login");
}
</script>
<style lang="">
    
</style>
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router';
import { defineStore } from 'pinia'

import http from "@/common/axios.js";

// 여기 만들면 안된다.
// const router = useRouter()

export const useAttractionStore = defineStore('attractionStore', () => {
  const router = useRouter()
  const MapStore = reactive({
    // list
    list: [],
    limit: 10,
    offset: 0,
    searchWord: "",

    // pagination
    listRowCount: 10,
    pageLinkCount: 10,
    currentPageIndex: 1,
    totalListItemCount: 0,

    // get
    title: "",
    addr1: "",
    firstimage: "",
    latitude: "",
    longitude: "",
  })

  const setAttractionList = (list) => attractionStore.list = list
  const setTotalListItemCount = (count) => attractionStore.totalListItemCount = count
  const setAttractionMovePage = (pageIndex) => {
    attractionStore.offset = (pageIndex - 1) * attractionStore.listRowCount
    attractionStore.currentPageIndex = pageIndex
  }
  const setAttractionDetail = (payload) => {
    attractionStore.title = payload.title;
    attractionStore.addr1 = payload.addr1;
    attractionStore.firstimage = payload.firstimage;
    attractionStore.latitude = payload.latitude;
    attractionStore.longitude = payload.longitude;
  }

  // list
  const attractionList = async () => {
    let params = {
      limit: attractionStore.limit,
      offset: attractionStore.offset,
      searchWord: attractionStore.searchWord,
    };

    try {
      let { data } = await http.get("/attraction", { params }); // params: params shorthand property, let response 도 제거
      console.log("attractionStore: data : ");
      console.log(data);
      if (data.result == "login") {
        router.push("/login");
      } else if (data.result == "success") {
        setAttractionList(data.list);
        setTotalListItemCount(data.count);
      } else {
        alert('글 조회 중 오류가 발생했습니다.')
      }
    } catch (error) {
      console.error(error);
    }
  }
  // pagination
  const pageCount = computed(() => Math.ceil(attractionStore.totalListItemCount / attractionStore.listRowCount))
  const startPageIndex = computed(() => {
    if (attractionStore.currentPageIndex % attractionStore.pageLinkCount == 0) {
      //10, 20...맨마지막
      return (attractionStore.currentPageIndex / attractionStore.pageLinkCount - 1) * attractionStore.pageLinkCount + 1;
    } else {
      return Math.floor(attractionStore.currentPageIndex / attractionStore.pageLinkCount) * attractionStore.pageLinkCount + 1;
    }
  })

  const endPageIndex = computed(() => {
    let tempEndPageIndex = 0;
    if (attractionStore.currentPageIndex % attractionStore.pageLinkCount == 0) {
      //10, 20...맨마지막
      tempEndPageIndex = attractionStore.currentPageIndex;
    } else {
      tempEndPageIndex = Math.floor(attractionStore.currentPageIndex / attractionStore.pageLinkCount) * attractionStore.pageLinkCount + attractionStore.pageLinkCount;
    }
    // endPageIndex 가 전체 pageCount(페이지 전체 수) 보다 크면 페이지 전체 수로 보정 
    if (tempEndPageIndex > pageCount.value) tempEndPageIndex = pageCount.value
    return tempEndPageIndex;
  })


  const prev = computed(() => attractionStore.currentPageIndex <= attractionStore.pageLinkCount ? false : true)
  const next = computed(() => endPageIndex.value == pageCount.value ? false : true) // 위에서 더 큰 값은 보정했으므로 같은 지만 비교

  return {
    attractionStore,
    setAttractionList, setAttractionMovePage, setTotalListItemCount, setAttractionMovePage, setAttractionDetail, attractionList,
    pageCount, startPageIndex, endPageIndex, prev, next
  }
})


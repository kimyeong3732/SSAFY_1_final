import { reactive } from 'vue'
import { defineStore } from 'pinia'

import http from "@/common/axios.js";

export const useFriendStore = defineStore('friendStore', () => {
  const friendStore = reactive({
    friends: [],
    users: [],
    requests: [],
    rejects: [],
  })

  const getFriend = async() => {
    try {
      let { data } = await http.get("/friends");

      if (data.result == "success") {
        friendStore.friends = data.list;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getUser = async(str) => {
    let friendObj = {
        str: str,
    };

    try {
      let { data } = await http.get("/friends/user", friendObj);

      if (data.result == "success") {
        friendStore.users = data.list;
      }
    } catch (error) {
        console.error(error);
    }
  }

  const getRequest = async() => {
    try {
      let { data } = await http.get("/friends/request");

      if (data.result == "success") {
        friendStore.requests = data.list;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const getReject = async() => {
    try {
      let { data } = await http.get("/friends/reject");

      if (data.result == "success") {
        friendStore.rejects = data.list;
      }
    } catch (error) {
      console.error(error);
    }
  }

  const addRequest = async(friendSeq)=> {
    let friendObj = {
        friendSeq: friendSeq,
    };

    try {
      let { data } = await http.post("/friends", friendObj);

      console.log("Friend Add: data : ");
      console.log(data);
      console.log(data.result)
  
      if( data.result == "success" ){
        getRequest();
      }else if( data.result == "fail" ){
        alert('친구 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  const updateRequest = async(friendSeq, mode)=> {
    let friendObj = {
        mode: mode,
    };

    try {
      let { data } = await http.put("/friends/" + friendSeq, friendObj);

      console.log("Friend Update: data : ");
      console.log(data);
      console.log(data.result)
  
      if( data.result == "success" ){
        if(mode == 1) {
          getFriend();
        }
        else if(mode == 0) {
          getReject();
        }
        getRequest();
      }else if( data.result == "fail" ){
        if(mode == 1) {
          alert('친구 수락에 실패했습니다.');
        }
        else if(mode == 0) {
          alert('친구 거절에 실패했습니다.');
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  const deleteRequest = async(friendSeq)=> {
    try {
      let { data } = await http.delete("/friends/" + friendSeq);

      console.log("Friend Delete: data : ");
      console.log(data);
      console.log(data.result)
  
      if( data.result == "success" ){
        getFriend();
        getReject();
      }else if( data.result == "fail" ){
        alert('친구 / 친구 요청 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {
    friendStore,
    getFriend,
    getUser,
    getRequest,
    getReject,
    addRequest,
    updateRequest,
    deleteRequest
  }
})
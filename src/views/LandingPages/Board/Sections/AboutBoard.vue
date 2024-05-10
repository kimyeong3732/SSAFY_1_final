<template lang="">
    <div class="container mt-3">
        <div class="input-group mb-3 mt-3">
            <input id="inputSearchWord" type="text" class="form-control" placeholder="검색어">
            <button class="btn btn-success" type="button" id="btnSearchWord">Search</button>
        </div>
        
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
            <tbody id="boardTbody">
            </tbody>
        </table>
        
        <div id="paginationWrapper"></div>
        
        <button class="btn btn-primary" type="button" id="btnBoardInsertUI">글쓰기</button>
    </div>
</template>
<script>
window.onload = function(){
	        boardList();
	        // 글 등록 모달
	        document.querySelector("#btnBoardInsertUI").onclick = function(){
	            
	            document.querySelector("#titleInsert").value = "";
	            document.querySelector("#contentInsert").value = "";
	            
	            let modal = new bootstrap.Modal(document.querySelector("#boardInsertModal"));        
	            modal.show();
	        };
	        
	        // 글 등록
	        document.querySelector("#btnBoardInsert").onclick = function(){
	            
	            if( validateInsert() ){
	                boardInsert();
	            }
	        }
	        // 글 수정 모달
	        document.querySelector("#btnBoardUpdateUI").onclick = function(){
	            
	            var boardId = document.querySelector("#boardDetailModal").getAttribute("data-boardId");
	            document.querySelector("#boardUpdateModal").setAttribute("data-boardId", boardId);
	            
	            document.querySelector("#titleUpdate").value = document.querySelector("#titleDetail").innerHTML;
	            document.querySelector("#contentUpdate").value = document.querySelector("#contentDetail").innerHTML;
	            
	            let detailModal = new bootstrap.Modal( document.querySelector("#boardDetailModal") );
	            detailModal.hide();
	            let updatelModal = new bootstrap.Modal( document.querySelector("#boardUpdateModal") );
	            updatelModal.show();
	        };
	        
	        // 글 수정
	        document.querySelector("#btnBoardUpdate").onclick = function(){
	
	            if( validateUpdate() ){
	                boardUpdate();
	            }
	        };
	        
	        // 글 삭제
	        document.querySelector("#btnBoardDeleteUI").onclick = function(){
	             alertify.confirm('삭제 확인', '이 글을 삭제하시겠습니까?',
	                 function() {
	                    boardDelete();
	                 },
	                function(){
	                     console.log('cancel');
	                }
	            );
	        };
	    }
	    
	    async function boardList() {
	        let url = "/board";
	        let urlParams =
	            "?limit=" +
	            LIST_ROW_COUNT +
	            "&offset=" +
	            OFFSET
	        let fetchOptions = {
	            method: "GET",
	            headers: {
	                async: "true",
	            },
	        };

	        try {
	            let response = await fetch(url + urlParams, fetchOptions);
	            let data = await response.json();
	            if (data.result == "login") {
	                window.location.href = "/login"; // UserServlet doGet()
	            } else {
	                makeListHtml(data);
	            }
	        } catch (error) {
	            console.log(error);
	            alert("글 조회 과정에 문제가 생겼습니다.");
	        }
	    }
	    
	    function makeListHtml(list){
	        
	        let listHTML = ``;
	
	        list.forEach( el => {
	            let boardId = el.boardId;
	            let userName = el.userName;
	            let title = el.title;
	            let content = el.content;
	            let regDt = el.regDt;    // javascript of parsed from LocalDateTime
	            //console.log(regDt);
	            //let regDtStr = makeDateStr(regDt.date.year, regDt.date.month, regDt.date.day, '.');
	            
	            let readCount = el.readCount;        
	            
	            listHTML +=
	                `<tr style="cursor:pointer" data-boardId=${boardId}><td>${boardId}</td><td>${title}</td><td>${userName}</td>
	                    <td>${regDt}</td><td>${readCount}</td></tr>`;
	            
	        } );
	        
	        document.querySelector("#boardTbody").innerHTML = listHTML;
	        
	        
	        makeListHtmlEventHandler();
	        boardListTotalCnt();
	        
	    }
	    
	    function makeListHtmlEventHandler(){
        	document.querySelectorAll("#boardTbody tr").forEach( el => {
        		el.onclick = function(){
        			var boardId = this.getAttribute("data-boardId");	
        			boardDetail(boardId);
        		}
        	});
        }

        async function boardListTotalCnt(){
        	let url = '/board/boardListTotalCnt';

            let fetchOptions = {
            		method: "GET",
                  	headers: {
                	  async: "true"
                  	},
                };
            
        	try{
        		let response = await fetch(url, fetchOptions);
        		let data = await response.json();
                if( data.result == "login") {
                	window.location.href="/login";
                }else{
                	TOTAL_LIST_ITEM_COUNT = data.totalCnt;
                	makePaginationHtml(LIST_ROW_COUNT, PAGE_LINK_COUNT, CURRENT_PAGE_INDEX, TOTAL_LIST_ITEM_COUNT, "paginationWrapper" );
            	}
        	}catch(error){
        		console.log(error);
        		alert("글 전체 수 조회 과정에 문제가 생겼습니다.");
        	}
        }
	    
	    function movePage(pageIndex){
	    	OFFSET = (pageIndex - 1) * LIST_ROW_COUNT;
	    	CURRENT_PAGE_INDEX = pageIndex;
	    	boardList();
	    }
	
	    async function boardDetail(boardId){
	
	    	let url = `/board/` + boardId;
	
	        let fetchOptions = {
	        		method: "GET",
	              	headers: {
	            	  async: "true"
	              	},
	            }
	        
	    	try{
	    		let response = await fetch(url + urlParams, fetchOptions);
	    		let data = await response.json();		
	    		console.log(data);
	    		if( data.result == "login") {
	        	window.location.href="/login";
	        	} else{
	     			makeDetailHtml(data);
	     		}
	    	}catch( error ){
	    		console.error( error );
	    		alert("글 조회과정에 문제가 생겼습니다.");
	    	}
	    }
	    function makeDetailHtml(detail){
	        console.log(detail);
	        var boardId = detail.boardId;
	        var userSeq = detail.userSeq;
	        var userName = detail.userName;
	        var title = detail.title;
	        var content = detail.content;
	        var regDt = detail.regDt;
	
	        //var regDtStr = makeDateStr(regDt.date.year, regDt.date.month, regDt.date.day, '.') + ' ' + makeTimeStr(regDt.time.hour, regDt.time.minute, regDt.time.second, ':');
	        
	        var readCount = detail.readCount;
	        var sameUser = sessionStorage.getItem("userSeq") == userSeq
	        var fileList = detail.fileList;
	        
	        console.log(sameUser);
	        
	        
	        document.querySelector("#boardDetailModal").setAttribute("data-boardId", boardId);
	        document.querySelector("#boardIdDetail").innerHTML = "#" + boardId;
	        document.querySelector("#titleDetail").innerHTML = title;
	        document.querySelector("#contentDetail").innerHTML = content;
	        document.querySelector("#userNameDetail").innerHTML = userName;
	        document.querySelector("#regDtDetail").innerHTML = regDtStr;
	        document.querySelector("#readCountDetail").innerHTML = readCount;
	
	        if( sameUser ){
	            document.querySelector("#btnBoardUpdateUI").classList.remove("inline_block_hide");
	            document.querySelector("#btnBoardUpdateUI").classList.add("inline_block_show");
	            document.querySelector("#btnBoardDeleteUI").classList.remove("inline_block_hide");
	            document.querySelector("#btnBoardDeleteUI").classList.add("inline_block_show");   
	            console.log(sameUser);      
	        }else{
	            document.querySelector("#btnBoardUpdateUI").classList.remove("inline_block_show");
	            document.querySelector("#btnBoardUpdateUI").classList.add("inline_block_hide");
	            document.querySelector("#btnBoardDeleteUI").classList.remove("inline_block_show");
	            document.querySelector("#btnBoardDeleteUI").classList.add("inline_block_hide");    
	            console.log(sameUser);
	        }
	        
	        let modal = new bootstrap.Modal(document.querySelector("#boardDetailModal"));
	        modal.show();
	    }
	 // insert
	    function validateInsert(){
	        var isTitleInsertValid = false;
	        var isContentInsertValid = false;
	
	        var titleInsertValue = document.querySelector("#titleInsert").value;
	        if( titleInsertValue.length > 0 ){
	            isTitleInsertValid = true;
	        }
	        
	        var contentInsertValue = document.querySelector("#contentInsert").value;
	        if( contentInsertValue.length > 0 ){
	            isContentInsertValid = true;
	        }
	
	        if(    isTitleInsertValid && isContentInsertValid ){
	            return true;
	        }else{
	            return false;
	        }
	    }
	
	    async function boardInsert(){
	
	        let title = document.querySelector("#titleInsert").value;
	        let content = document.querySelector("#contentInsert").value;    
	        
	        let urlParams = new URLSearchParams({
	            title: title,
	            content: content,
	        });
	        
	        let fetchOptions = {
	            method: "POST",
	              headers: {
	                'async': 'true'
	                },
	            body: urlParams,
	        }
	        
	        let url = '/board/boardInsert';
	        
	        try{
	            let response = await fetch(url, fetchOptions );
	            let data = await response.json();
	            if( data.result == "login") {
	            window.location.href="/login";
	        }else if( data.result == "success" ){ // 백엔드 로그인 필터에서 session timeout 이 발생하면 내려주는 json 값
	                alert('글이 등록되었습니다.');
	                boardList();
	            }else{
	                alert('글 등록 과젱에 문제가 있습니다.')
	            }
	        }catch( error ){
	            console.error( error );
	            alert('글 등록 과젱에 문제가 있습니다.')
	        }
	    }
	 // update
	    function validateUpdate(){
	        var isTitleUpdateValid = false;
	        var isContentUpdateValid = false;
	
	        var titleUpdate = document.querySelector("#titleUpdate").value;
	        var titleUpdateLength = titleUpdate.length;
	        
	        if( titleUpdateLength > 0 ){
	            isTitleUpdateValid = true;
	        }
	        
	        var contentUpdateValue = document.querySelector("#contentUpdate").value;
	        var contentUpdateLength = contentUpdateValue.length;
	        
	        if( contentUpdateLength > 0 ){
	            isContentUpdateValid = true;
	        }
	
	        if(    isTitleUpdateValid && isContentUpdateValid ){
	            return true;
	        }else{
	            return false;
	        }
	    }
	
	    async function boardUpdate(){
	
	        let boardId = document.querySelector("#boardUpdateModal").getAttribute("data-boardId");
	        let title = document.querySelector("#titleUpdate").value;
	        let content = document.querySelector("#contentUpdate").value;    
	        
	        let urlParams = new URLSearchParams({
	            boardId: boardId,
	            title: title,
	            content: content,
	        });
	        
	        let fetchOptions = {
	            method: "POST",
	            headers: {
	                'async': 'true'
	                },
	            body: urlParams,
	        }
	        
	        let url = '/board/boardUpdate';
	        
	        try{
	            let response = await fetch(url, fetchOptions );
	            let data = await response.json();
	            if( data.result == "login") {
	           window.location.href="/login";
	            }else if( data.result == "success" ){
	                alert('글이 수정되었습니다.');
	                boardList();
	            }else{
	                alert('글 수정 과젱에 문제가 있습니다.');
	            }
	        }catch( error ){
	            console.error( error );
	            alert('글 수정 과젱에 문제가 있습니다.');
	        }
	    }
	
	    //delete
	    async function boardDelete(){
	        
	        let url = '/board/';
	        let urlParams = '?boardId=' + document.querySelector("#boardDetailModal").getAttribute("data-boardId");
	
	        let fetchOptions = {
	                method: 'GET',
	                  headers: {
	                  'async': 'true'
	                  },
	            }
	        
	        try{
	            let response = await fetch(url + urlParams);
	            let data = await response.json();
	            
	            if( data.result == "login") {
	                window.location.href="/login";
	        }else if(data.result == "success"){
	                alert("글이 삭제되었습니다.");
	                boardList();
	            }else{
	                alert("글 삭제 과정에 문제가 생겼습니다.");
	            }
	        }catch( error ){
	            console.error( error );
	            alert("글 삭제 과정에 문제가 생겼습니다.");
	        }    
	    }
</script>
<style lang="">
    
</style>
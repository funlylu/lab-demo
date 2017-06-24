//单页切换插件
var PageTransitions = (function() {
  	
  var warpper=document.getElementById("pt-panel"),
      nav = warpper.previousElementSibling;
  
   //--------------------
  //函数名：_navScrollEventHandler
  //功能描述：导航切换事件
  //参数:i:下一页面计数
  //-------------------------------
 var _navScrollEventHandler = function(currentPage,i){
     var nav = warpper.previousElementSibling,
         nItem =nav.querySelector(".nav-item.nav-item-"+i),
         cItem = nav.querySelector(".nav-item.active");
         
         cItem.className = cItem.className.replace(" active", '');
         nItem.className = nItem.className.replace(" active", '');
         nItem.className += " active";  
 };
    
  //--------------------
  //函数名：_changePage
  //功能描述：设置页面切换效果
  //参数:warpper:父级DOM对象，pageCurrent：当前活跃page，i:下一页面，anmation：当前页面动画class属性值
  //-------------------------------
  var _changePage=function(warpper,pageCurrent,i,anmation){
            
         //导航切换
         _navScrollEventHandler(pageCurrent,i);
            
        var  pageNext = warpper.querySelector(".pt-page.pt-page-"+i),
             npAnmation = anmation==="pt-page-moveToTop" ? "pt-page-moveFromBottom":"pt-page-moveFromTop";
            
            //先显示下一页面，不然动画切换会出现p白屏
            pageNext.className = pageNext.className.replace(" active", '');
            pageNext.className += " active";
            
            pageCurrent.className = pageCurrent.className.replace(" "+anmation, '');
            pageNext.className = pageNext.className.replace(" "+npAnmation, '');
            pageCurrent.className +=" "+anmation;
            pageNext.className +=" "+npAnmation;

            setTimeout(function(){
	             //移除动画效果class以及隐藏上一页
                 pageCurrent.className = pageCurrent.className.replace(" "+anmation, '');
                 pageNext.className = pageNext.className.replace(" "+npAnmation, '');
                 pageCurrent.className = pageCurrent.className.replace(" active", '');
                      
             },600);
         
	};
	
  //--------------------
  //函数名：_pageChangeType
  //功能描述：获取页面切换方式
  //参数:type：页面切换方式(0-上下切换,1-左右切换)
  //------------------------------- 	
    	//coding......
	
  //--------------------
  //函数名：_scrollEventHandler
  //功能描述：鼠标滚轮事件处理程序
  //参数:event:事件对象实例
  //-------------------------------
  var _scrollEventHandler = function(event){
		
		//取消事件冒泡
		EventUtil.stopPropagation(event);
		
		var e = EventUtil.getEvent(event),
		    delta = e.wheelDelta || -e.detail,// 用这个值的正负表示方向，其中e.detail火狐浏览器特有的与其它浏览器不兼容(正负号表示的方向与其它浏览器相反)
		    direct = delta>0 ? true:false;
		    
		//获取当前活跃的page
		var pageCurrent=warpper.querySelector(".pt-page.active"),
		     pageLen=warpper.childElementCount,
             classStr=pageCurrent.className.split(/\s/)[1],
		     i = classStr.split("-")[2];
		     
           if(direct){//向前滚动
				if(i==1) {return;}
				else{
					_changePage(warpper,pageCurrent,parseInt(i)-1,"pt-page-moveToBottom");
				}
			}else{//向后滚动
			  if(i==pageLen){ return;}
			  else{ 
			  	_changePage(warpper,pageCurrent,parseInt(i)+1,"pt-page-moveToTop");
			   }
		    }
	};
   //导航事件处理程序
    var _navEventHandler = function(event){
    	console.log("====_navEventHandler=====");
    	var e = EventUtil.getEvent(event),
    	    eTarget = EventUtil.getTarget(e);
    	//filter 
    	if(eTarget.className.indexOf("nav-item") < 0) return;
    	
    	console.log("====_navEventHandler 1=====");
    	
    	var pageCurrent = warpper.querySelector(".pt-page.active"),
    	    pageLen=warpper.childElementCount,
            pClassStr=pageCurrent.className.split(/\s/)[1],
		    pNum = pClassStr.split("-")[2],
    	    tClassStr=eTarget.className.split(/\s/)[1],
		    tNum = tClassStr.split("-")[2],
		    type = "pt-page-moveToTop";
    	 if(pNum==tNum)  return;
    	 else if(pNum>tNum){
    	 	type = "pt-page-moveToBottom"; 
    	 }
       
       //切换页面
       _changePage(warpper,pageCurrent,parseInt(tNum),type);
    	 
    };
  
  //页面初始化函数
  var init=function(){
  	 //添加页面滚轮事件监听程序
  	 EventUtil.addHander(warpper,"mousewheel",_scrollEventHandler);//ie chrome opera safair
	 EventUtil.addHander(warpper,"DOMMouseScroll",_scrollEventHandler);//火狐
	 EventUtil.addHander(nav,"click",_navEventHandler);
   };	
   
	return{
		init:function(){
			init();
		}
	}
})();

PageTransitions.init();


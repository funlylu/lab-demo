//单页切换插件
var PageTransitions = (function() {

    var warpper = document.getElementById("pt-panel"),
        nav = warpper.previousElementSibling,
        pageLen = warpper.querySelectorAll(".pt-page").length,
        showFooter = false,
        pageAnimate = null,
        isAnimateComplete = false,
        pageChageTimer = null;;


    function sleep(duration, func) {
        var timer = setTimeout(function() {
            func();
        }, duration);

        return timer;
    }


    //页面切换动画效果——文字逐行逐行显示
    var _animateText = function(nPage, cPage) {
        var section = nPage.querySelector(".animated-text"),
            pTitle = section.querySelectorAll(".p-title"),
            lenT = pTitle.length,
            lines = section.querySelectorAll(".p-text"),
            lenP = lines.length,
            timerArrT = [],
            timerArrL = [];

        //add
        for (var i = 0; i < lenT; i++) {
            (function() {
                var item = pTitle.item(i);
                item.classList.remove("shake");
                item.classList.remove("animated");
                timerArrT[i] = setTimeout(function() {
                    item.classList.add("shake");
                    item.classList.add("animated");
                    if (i === (lenT - 1) && lenT >= lenP) {
                        isAnimateComplete = true;
                    }
                }, 600);
            })(i);
        }

        for (var i = 0; i < lenP; i++) {
            (function(i) {
                var line = lines.item(i);
                line.classList.remove("fadeInDown");
                line.classList.remove("animated");
                timerArrL[i] = setTimeout(function() {
                    line.classList.add("fadeInDown");
                    line.classList.add("animated");
                    if (i === (lenP - 1) && lenT < lenP) {
                        isAnimateComplete = true;
                    }
                }, 600 * (i + 1));
            })(i);
        }

        return {
            remove: function() {
                // clear timer
                for (var i = timerArrT.length - 1; i >= 0; i--) {
                    clearTimeout(timerArrT[i]);
                }
                for (var i = timerArrL.length - 1; i >= 0; i--) {
                    clearTimeout(timerArrL[i]);
                }
                // cPage && cPage.classList.remove("active");
            }
        };
    };

    //--------------------
    //函数名：_navScrollEventHandler
    //功能描述：导航切换事件
    //参数:i:下一页面计数
    //-------------------------------
    var _navScrollEventHandler = function(currentPage, i) {
        var nav = warpper.previousElementSibling,
            nItem = nav.querySelector(".nav-item.nav-item-" + i),
            cItem = nav.querySelector(".nav-item.active");

        cItem.classList.remove("active");
        nItem.classList.toggle("active");
    };

    //--------------------
    //函数名：_changePage
    //功能描述：设置页面切换效果
    //参数:warpper:父级DOM对象，pageCurrent：当前活跃page，i:下一页面，anmation：当前页面动画class属性值
    //-------------------------------
    var _changePage = function(warpper, pageCurrent, i, anmation) {

        //导航切换
        _navScrollEventHandler(pageCurrent, i);

        var pageNext = warpper.querySelector(".pt-page.pt-page-" + i),
            npAnmation = anmation === "pt-page-moveToTop" ? "pt-page-moveFromBottom" : "pt-page-moveFromTop";


        //页面切换效果
        pageNext.classList.add("active"); //先显示下一页面，不然动画切换会出现白屏
        pageCurrent.classList.add(anmation);
        pageNext.classList.add(npAnmation);

        setTimeout(function() {
            //移除动画效果class以及隐藏上一页
            pageCurrent.classList.remove(anmation);
            pageNext.classList.remove(npAnmation);
            pageCurrent.classList.remove("active");
        }, 500);

        // 页面内的动画效果
        if (i == 1) { //如果是第一页，手机有一个向左的动画效果
            var phone = pageNext.querySelector(".phone-img");
            phone.className = phone.className.replace(" toLeft animated", '');
            setTimeout(function() {
                phone.className += " toLeft animated";
            }, 100);
        }
        //文字动画效果
        pageAnimate = _animateText(pageNext, pageCurrent);
    };

    //--------------------
    //函数名：_scrollEventHandler
    //功能描述：鼠标滚轮事件处理程序
    //参数:event:事件对象实例
    //-------------------------------
    var _scrollEventHandler = function(event) {

        //取消事件冒泡
        EventUtil.stopPropagation(event);
        var pageCurrent = warpper.querySelector(".pt-page.active");
        var classStr = pageCurrent.className.split(/\s/)[1],
            i = showFooter ? 5 : classStr.split("-")[2];
        var e = EventUtil.getEvent(event),
            direct = EventUtil.getWheelDelta(e) > 0 ? true : false;

        if (i <= 1 && direct) { isAnimateComplete = true; return; }
        console.log("isAnimateComplete:" + isAnimateComplete);
        if (!isAnimateComplete && !pageChageTimer) {
            pageAnimate && pageAnimate.remove(); // 停止上一个页面的动画
            pageChageTimer = sleep(500, handerFunc); //延迟切换页面
            console.log("延迟切换.......");
        } else if (!isAnimateComplete && pageChageTimer) {
            console.log("当前有一个定时切换器.......");
            return;
        } else {
            console.log("当前页面动画已经完成可以直接切换.......");
            handerFunc();
        }

        function handerFunc() {
            isAnimateComplete = false; //切换新的页面，动画标记设置未未完成
            clearTimeout(pageChageTimer);
            pageChageTimer = null;
            // 最后一页
            var footerObj = document.getElementById('footer'),
                pageContent = pageCurrent.querySelector(".page-content");

            if (direct) { //向前滚动
                if (i <= 1) {
                    return;
                } else {
                    if (i == 5) {
                        footerObj.style.transform = "none";
                        pageContent.style.transform = "none";
                        showFooter = false;
                        return;
                    }
                    console.log("page:" + i);
                    _changePage(warpper, pageCurrent, parseInt(i) - 1, "pt-page-moveToBottom");
                }
            } else { //向后滚动
                if (i >= pageLen) {
                    // 最后一页
                    console.log("最后一页:" + pageLen);
                    footerObj.style.transform = "translateY(-200px)";
                    pageContent.style.transform = "translateY(-200px)";
                    showFooter = true;
                    isAnimateComplete = true;
                    return;
                } else {
                    console.log("page:" + i);
                    _changePage(warpper, pageCurrent, parseInt(i) + 1, "pt-page-moveToTop");
                }
            }
        }

    };

    //导航事件处理程序
    var _navEventHandler = function(event) {
        var e = EventUtil.getEvent(event),
            eTarget = EventUtil.getTarget(e);
        //filter 
        if (eTarget.className.indexOf("nav-item") < 0) return;

        var pageCurrent = warpper.querySelector(".pt-page.active");
        console.log(pageCurrent);

        var pClassStr = pageCurrent.className.split(/\s/)[1],
            pNum = pClassStr.split("-")[2],
            tClassStr = eTarget.className.split(/\s/)[1],
            tNum = tClassStr.split("-")[2],
            type = "pt-page-moveToTop";
        if (pNum == tNum) return;
        else if (pNum > tNum) {
            type = "pt-page-moveToBottom";
        }
        //切换页面
        _changePage(warpper, pageCurrent, parseInt(tNum), type);
    };

    //页面初始化函数
    var init = function() {
        //初始化页面
        var page = warpper.querySelector(".pt-page-1");
        _animateText(page);
        //添加页面滚轮事件监听程序
        EventUtil.addHander(warpper, "mousewheel", _scrollEventHandler); //ie chrome opera safair
        EventUtil.addHander(warpper, "DOMMouseScroll", _scrollEventHandler); //火狐
        EventUtil.addHander(nav, "click", _navEventHandler);
    };

    return {
        init: function() {
            init();
        }
    }
})();

PageTransitions.init();
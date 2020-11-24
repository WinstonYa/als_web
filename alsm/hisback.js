$(function () {
    hisback();
});

function hisback() {
    if (window.history && window.history.pushState) {
        $(window).on('popstate', function () {
            //alert(0);
            window.history.pushState('forward', null, '');
            window.history.forward(1);
        });
    }

    if (window.history && window.history.pushState) {
        　　  $(window).on('popstate', function () {
            　　  window.history.pushState('forward', null, '#');
            　　  window.history.forward(1);
        　　  });
    　　  }
    　　  window.history.pushState('forward', null, '#'); //在IE中必须得有这两行
    　　  window.history.forward(1);

    //"pushState" in window.history && (
    //    window.history.pushState({
    //        title: document.title,
    //        url: location.href
    //    }, document.title, location.href),
    //    setTimeout(function () {
    //        window.addEventListener("popstate", function (a) {
    //            if (confirm("退出？")) {
    //                top.location = "/admin/login.aspx"
    //            }
    //            else {
    //                window.history.pushState('forward', null, '#');
    //                window.history.forward(1);
    //                //return false;
    //            }


    //        })
    //    }, 0)
    //); 

    //"pushState" in window.history && (
    //    window.history.pushState({
    //        title: document.title,
    //        url: location.href
    //    }, document.title, location.href),
    //    setTimeout(function () {
    //        window.addEventListener("popstate", function (a) {
    //            alert("ban");
    //            window.history.pushState('forward', null, '#');
    //            window.history.forward(1);


    //        })
    //    }, 0)
    //); 
}
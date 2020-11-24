/**
 * 作       者：StampGIS Team
 * 创建日期：2017年7月22日
 * 描        述：一级菜单：菜单功能方法
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2017年11月8日
 ******************************************/

var lastClickId = ""; //最后点击对象的id
var tagArr = []; //标签数组


/**
 * 初始化菜单
 */
function initMenu() {

    for (var i = 0; i < STAMP.menuConfig.menu.length; i++) {
        // tagArr.push(STAMP.menuConfig.menu[i].tag);
        var m1 = STAMP.menuConfig.menu[i];
        m1.tag = i + 1;
        if (m1.item !== undefined) {
            for (var j = 0; j < m1.item.length; j++) {
                var m2 = m1.item[j];
                m2.tag = m1.tag * 100 + j + 1;
            }
        }
    }

    var minTag = 1;
    var menuHtml = getMenusHtmlText();
    /* ssy modify menu */
    var ulWidth = STAMP.menuConfig.menu.length * 95;

    let offsetWidth = document.body.offsetWidth;


    if (offsetWidth<1387){
        $("#DB_ul").width('');
    }else {
        $("#DB_ul").width('');
    }



    $("#DB_ul").html(menuHtml);

    /* ssy imgMenu*/
    lastClickId = "PatrolMonitor";
    $("#" + lastClickId + " Img").attr("src", "images/top/activeIcons/" + lastClickId + ".png");
    /* ssy topMenu*/
    // lastClickId = $(".topLi[tagIndex=" + minTag + "]").attr("tagid");
    // $("#" + lastClickId + "topLi").addClass("selectedStyle");
    getTableObjectById(minTag);
    clickItem(lastClickId, $("#earthTools"))
}

/**
 * 获取菜单HTML
 */
function getMenusHtml() {
    var menuHtml = "";
    for (var i = STAMP.menuConfig.menu.length - 1; i >= 0; i--) {
        var item = STAMP.menuConfig.menu[i];
        menuHtml += '<li tagIndex="' + parseInt(item.tag) + '" id="' + item.id + 'topLi" class="topLi"><img id="' + item.id + 'Img" tagIndex="' + parseInt(item.tag) + '" class="topImg" src="' + item.src + '" alt="' + item.name + '" /></li>';
    }
    return menuHtml;
}

/**
 * 获取菜单HTML
 */
function getMenusHtmlText() {
    var menuHtml = "";



    for (var i = STAMP.menuConfig.menu.length - 1; i >= 0; i--) {
        var item = STAMP.menuConfig.menu[i];
        if(item.name.length > 10) {
            menuHtml += '<li tagIndex="' + parseInt(item.tag) + '" id="' + item.id + 'topLi" tagid="' + item.id + '" class="topLi"><h3 href="#" id="' + item.id + 'Img" tagIndex="' + parseInt(item.tag) + '" style="color:white">' + item.title + '</h3></li>';
        } else {
            menuHtml += '<li tagIndex="' + parseInt(item.tag) + '" id="' + item.id + 'topLi" tagid="' + item.id + '" class="topLi"><h2 href="#" id="' + item.id + 'Img" tagIndex="' + parseInt(item.tag) + '" style="color:white">' + item.title + '</h2></li>';
        }
    }
    return menuHtml;
}

//菜单禁用
function disableAll(isDisable) {
    $("#DB_navi").attr("disabled", isDisable);
    $(".topImg").attr("disabled", isDisable);
}

/**
 * 页面加载完成事件
 */
$(document).ready(function () {
    var DB_navi = document.getElementById("DB_navi"); //右侧一级菜单div
    var DB_ul = document.getElementById("DB_ul"); //右侧一级菜单ul
    $("#DB_navi").click(function (e) { //一级菜单点击事件
        if ($("#DB_navi").attr("disabled") == true || $("#DB_navi").attr("disabled") == "disabled") {
            return;
        }
        var ev = null;
        if (e) {
            ev = e.target;
        } else {
            ev = window.event.srcElement;
        }
        var id = ev.getAttribute("tagIndex");

        if (id == undefined) {
            return;
        }

        id = parseInt(id);

        if (!isNaN(id)) {
            var imgId = $(".topLi[tagIndex=" + id + "]").attr("tagid");
            /* ssy imgMenu*/
            // $("#" + lastClickId + " img").attr("src", "images/top/inactiveIcons/" + lastClickId + ".png");
            // lastClickId = imgId;
            // $("#" + imgId + " img").attr("src", "images/top/activeIcons/" + imgId + ".png");
            // top.getTableObjectById(id); //二级菜单根据一级菜单点击事件

            /* ssy textMenu*/
            $("#" + lastClickId + "topLi").removeClass("selectedStyle");
            lastClickId = imgId;
            $("#" + lastClickId + "topLi").addClass("selectedStyle");
            top.getTableObjectById(id); //二级菜单根据一级菜单点击事件
        } else {
            return;
        }

    });
});
function liHovered(e) { //一级菜单点击事件
    if ($("#DB_navi").attr("disabled") == true || $("#DB_navi").attr("disabled") == "disabled") {
        return;
    }
    var ev = null;
    if (e) {
        ev = e.target;
    } else {
        ev = window.event.srcElement;
    }
    var id = ev.getAttribute("tagIndex");

    if (id == undefined) {
        return;
    }

    id = parseInt(id);

    if (!isNaN(id)) {
        var imgId = $(".topLi[tagIndex=" + id + "]").attr("tagid");
        /* ssy imgMenu*/
        // $("#" + lastClickId + " img").attr("src", "images/top/inactiveIcons/" + lastClickId + ".png");
        // lastClickId = imgId;
        // $("#" + imgId + " img").attr("src", "images/top/activeIcons/" + imgId + ".png");
        // top.getTableObjectById(id); //二级菜单根据一级菜单点击事件

        /* ssy textMenu*/
        $("#" + lastClickId + "topLi").removeClass("selectedStyle");
        lastClickId = imgId;
        $("#" + lastClickId + "topLi").addClass("selectedStyle");
        top.getTableObjectById(id); //二级菜单根据一级菜单点击事件
    } else {
        return;
    }
}

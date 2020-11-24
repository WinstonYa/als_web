/**
 * 作       者：StampGIS Team
 * 创建日期：2017年7月22日
 * 描        述：左侧面板相关方法
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2017年11月8日
 ******************************************/
var topDialogId = 'PatrolMonitor'; //面板id
var dialogId = null; //面板id
var bLayerVisible = false; //图层管理关闭状态
var menuItem = null; //菜单项
var tableId = null; //面板id
//隐藏页面
$(function () {
    $("#toolDiv").click(function () {
        $('#selectHtml').hide();
        hideRouteDetails();
    })
})

//打开查询页面
function toggleSelectHtml(val) {
    if ($("#selectHtml").is(":hidden")) {
        $("#selectHtml").show();
        $("#selectHtml")[0].contentWindow.vm.showS = val;
    } else {
        $('#selectHtml').hide();
    }

}

//设置查询页面高度
function setSelectHtmlHeight(val) {
    var h = $(window).height();
    h = h - val;
    $("#selectHtml").css("height", h + "px");
}

function openRouteDetails() {
    $('#routeDetails').show();
}

function hideRouteDetails() {
    $('#routeDetails').hide();
    //清除地图上绘制的路线
    $(document).contents().find("#map2dv")[0].contentWindow.clearMeasure();
}

//打开路线页面
function toggleRouteDetails(routeType, passingPoint, row, relationId) {
    openRouteDetails();
    var vm= $("#routeDetails")[0].contentWindow.vm;

     vm.routeType = routeType;
    if (row != null) {
        vm.row = row;
        vm.row.syncTime =null;
        vm.row.makerId = null;
        vm.row.maker =null;
        vm.row.relationId =null;
        vm.row.isDraw =null;

        vm.handleType = "edit";
        vm.oldPassingPoint = row.passingPoint;
        if(passingPoint != null) {
            row.passingPoint = passingPoint;
        }
    } else {
      vm.row = {};
      vm.row.passingPoint = passingPoint;
      vm.row.relationId = relationId;
      vm.handleType = "add";
    }

}

//设置路线页面高度
function setRouteDetailsHeight(val) {
    var h = $(window).height();
    h = h - val;
    $("#routeDetails").css("height", h + "px");
}


//关闭对话框
function closeDialog() {
    if ($("#id_left_operator").css("display") != "none") {
        $("#id_left_operator").hide();
        $("#id_left_operator").dialog('close');
    }
    if (dialogId) {
        Tools.singleStyleCancel(dialogId);
        dialogId = null;
        clear2DBack();
    }
}

//关闭图层管理
$("#closeLayer").click(function () {
    bLayerVisible = false;
    setLayerShow(false); //缩进图层面板
    if (earthToolsDiv) {
        BalloonHtml.removeItemStle("LayerManager");
    }
});

/**
 * 设置左侧图层面板是否显示show:true显示，show:false不显示
 * @param {boolean} show [是否显示]
 */
function setLeftPanelShow(show) {
    if (show) {
        $("#mainEarth").css("margin-left", "302px");
    } else {
        $("#mainEarth").css("margin-left", "0px");
    }
}

//打开左侧面板
window.showDialog = function (src, clickId, _onClose) {
    closeTableDialog();
    if (clickId && clickId !== dialogId) {
        closeDialog();
        Tools.singleSelectedStyle(clickId); //点击菜单项的样式改变
        dialogId = clickId;
        if (dialogId === 'PatrolMonitor' || dialogId === 'VisitMonitor') {
            topDialogId = dialogId;
        }

        LayerManagement.clearHtmlBalloons(); //删除气泡
        var title = "";
        var titleImg = "";
        for (var i = 0; i < STAMP.menuConfig.menu.length; i++) {
            if (STAMP.menuConfig.menu[i].item !== undefined) {
                for (var j = 0; j < STAMP.menuConfig.menu[i].item.length; j++) {
                    if (STAMP.menuConfig.menu[i].item[j].id == clickId) {
                        title = STAMP.menuConfig.menu[i].item[j].title;
                        titleImg = STAMP.menuConfig.menu[i].item[j].src;
                        menuItem = STAMP.menuConfig.menu[i].item[j];
                    }
                }
            } else if (STAMP.menuConfig.menu[i].id == clickId) {
                title = STAMP.menuConfig.menu[i].functitle;
                titleImg = STAMP.menuConfig.menu[i].funcsrc;
                menuItem = STAMP.menuConfig.menu[i];
            }
        }
        if (clickId == "systemSettingNow") {
            title = "系统设置";
            titleImg = "images/tools/系统设置.png";
        }
        setLeftPanelShow(true);
        $("#id_left_operator").show();
        $("#id_left_operator").dialog({
            shadow: false,
            draggable: false,
            title: title,
            titleImg: titleImg,
            onClose: function () {
                $("#id_left_operator").hide();
                if ('destroyed' in $("#operator")[0].contentWindow) {
                    $("#operator")[0].contentWindow.destroyed();
                }
                $("#operator").attr("src", "");
                LayerManagement.clearHtmlBalloons();
                Tools.singleStyleCancel(dialogId);
                dialogId = null;
                if (!bLayerVisible) {
                    setLeftPanelShow(false);
                }
                if (typeof _onClose == "function") {
                    _onClose();
                }
            }
        }).panel({
            height: $(document).height() - 80 - 40,
            width: 300
        }).panel("move", {
            /* ssy +toolDiv.height 39px 80px 1px*/
            top: "119px",
            left: "0px"
        });

        $("#operator").attr("src", src);
    }
};

//关闭表格
function closeTableDialog() {
    if ($("#mainTable").css("display") != "none") {
        showMain();
        // $("#mainTable").dialog('close');
    }
    if (tableId) {
        Tools.singleStyleCancel(tableId);
        tableId = null;
        clear2DBack();
    }
}

//打开表格
window.showTableDialog = function (src, clickId, _onClose) {
    closeDialog();
    closeTableDialog();
    Tools.singleSelectedStyle(clickId); //点击菜单项的样式改变
    tableId = clickId;

    LayerManagement.clearHtmlBalloons(); //删除气泡

    showTable();
    $("#tableFrame").attr("src", src);
}

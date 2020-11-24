// 布局脚本
/*====================================
*基于JQuery 1.9.0主框架
*MxWeiXinPF管理界面
*作者：一些事情
====================================*/
//绑定需要浮动的表头
$(function () {
    $(".ltable tr:nth-child(odd)").addClass("odd_bg"); //隔行变色
    $("#floatHead").smartFloat();
    $(".rule-single-checkbox").ruleSingleCheckbox();
    $(".rule-multi-checkbox").ruleMultiCheckbox();
    $(".rule-multi-radio").ruleMultiRadio();
    $(".rule-single-select").ruleSingleSelect();
    $(".rule-multi-porp").ruleMultiPorp();
});
//全选取消按钮函数
function checkAll(chkobj) {
    if ($(chkobj).text() == "全选") {
        $(chkobj).children("span").text("取消");
        $(".checkall input:enabled").prop("checked", true);
    } else {
        $(chkobj).children("span").text("全选");
        $(".checkall input:enabled").prop("checked", false);
    }
}
//Tab控制函数
function tabs(tabObj) {
    var tabNum = $(tabObj).parent().index("li")
    //设置点击后的切换样式
    $(tabObj).parent().parent().find("li a").removeClass("selected");
    $(tabObj).addClass("selected");
    //根据参数决定显示内容
    $(".tab-content").hide();
    $(".tab-content").eq(tabNum).show();
}

function tabs2(tabObj) {
    var tabNum = $(tabObj).parent().index("li")
    //设置点击后的切换样式
    $(tabObj).parent().parent().find("li a").removeClass("selected");
    $(tabObj).addClass("selected");
    //根据参数决定显示内容
    $(".list-content").hide();
    $(".list-content").eq(tabNum).show();
}

//Tab控制函数
function tabsChangedIndex(index) {
    var tabObj = $(".content-tab-ul-wrap").find("li").eq(index);
    //设置点击后的切换样式
    $(tabObj).parent().find("li a").removeClass("selected");
    $(tabObj).find("li a").addClass("selected");
    //根据参数决定显示内容
    $(".tab-content").hide();
    $(".tab-content").eq(index).show();
}
//页面控制
function turnPage(pageIndex) {
    var hdpage = $("#hdpage");
    var btnpage = $("#lbtnPage");
    if (hdpage && btnpage) {
        hdpage.val(pageIndex)
        $("#lbtnPage")[0].click();
    }
}

//===========================工具类函数============================
//只允许输入数字
function checkNumber(e) {
    if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {  //FF
        if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || (e.which == 8) || (e.which == 46)))
            return false;
    } else {
        if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode == 8) || (event.keyCode == 46)))
        // event.returnValue = false;
            return false;
    }
}
//只允许输入浮点数
function checkNumberD(e) {
    if (isFirefox = navigator.userAgent.indexOf("Firefox") > 0) {  //FF
        if (!((e.which >= 48 && e.which <= 57) || (e.which >= 96 && e.which <= 105) || (e.which == 8) || (e.which == 46) || (e.which == 190)))
            return false;
    } else {
        if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || (event.keyCode == 8) || (event.keyCode == 46) || (event.keyCode == 190)))
        // event.returnValue = false;
            return false;
    }
}


//检查Float
function checkFloat(txtId) {
    var txt = $("#" + txtId).val();
    if (txt.length > 0) {
        if (parseFloat(txt)) {
            return true;
        }
        else
            return false;
    }
    return true;
}

//检查Int
function checkInt(txtId) {
    var txt = $("#" + txtId).val();
    if (txt.length > 0) {
        if (parseInt(txt)) {
            return true;
        }
        else
            return false;
    }
    return true;
}


//检查短信字数
function checktxt(obj, txtId) {
    var txtCount = $(obj).val().length;
    if (txtCount < 1) {
        return false;
    }
    var smsLength = Math.ceil(txtCount / 62);
    $("#" + txtId).html("您已输入<b>" + txtCount + "</b>个字符，将以<b>" + smsLength + "</b>条短信扣取费用。");
}
//四舍五入函数
function ForDight(Dight, How) {
    Dight = Math.round(Dight * Math.pow(10, How)) / Math.pow(10, How);
    return Dight;
}
//写Cookie
function addCookie(objName, objValue, objHours) {
    var str = objName + "=" + escape(objValue);
    if (objHours > 0) {//为0时不设定过期时间，浏览器关闭时cookie自动消失
        var date = new Date();
        var ms = objHours * 3600 * 1000;
        date.setTime(date.getTime() + ms);
        str += "; expires=" + date.toGMTString();
    }
    document.cookie = str;
}

//读Cookie
function getCookie(objName) {//获取指定名称的cookie的值
    var arrStr = document.cookie.split("; ");
    for (var i = 0; i < arrStr.length; i++) {
        var temp = arrStr[i].split("=");
        if (temp[0] == objName) return unescape(temp[1]);
    }
    return "";
}

//地图定位操作
function fixPositon(x, y) {
}


//========================基于lhgdialog插件========================
//可以自动关闭的提示，基于lhgdialog插件
function jsprint(msgtitle, url, msgcss, callback) {
    var iconurl = "";
    switch (msgcss) {
        case "Success":
            iconurl = "32X32/succ.png";
            break;
        case "Error":
            iconurl = "32X32/fail.png";
            break;
        default:
            iconurl = "32X32/hits.png";
            break;
    }

    //    var frame = null;
    //    frame = frames["leftFrame"];

    var frame = null;
    if (window.location.href.indexOf("main/index") >= 0 || window.location.href.indexOf("admin/indexmain") >= 0) {
        frame = frames["leftFrame"];
    }
    else
        frame = frames["mainframe"];
    $.dialog.tips(msgtitle, 2, iconurl);
    if (url == "back") {
        frames["leftFrame"].history.back(-1);
    } else if (url != "") {
        frames["leftFrame"].location.href = url;
    }
    //执行回调函数
    if (arguments.length == 4) {
        callback();
    }
}
function jsprint2(msgtitle, url, msgcss, callback) {
    var iconurl = "";
    switch (msgcss) {
        case "Success":
            iconurl = "32X32/succ.png";
            break;
        case "Error":
            iconurl = "32X32/fail.png";
            break;
        default:
            iconurl = "32X32/hits.png";
            break;
    }
    $.dialog.tips(msgtitle, 2, iconurl);
    if (url == "back") {
        document.history.back(-1);
    } else if (url != "") {
        document.location.href = url;
    }
    //执行回调函数
    if (arguments.length == 4) {
        callback();
    }
}
//弹出一个Dialog窗口
function jsdialog(msgtitle, msgcontent, url, msgcss, callback) {
    var iconurl = "";
    var argnum = arguments.length;
    switch (msgcss) {
        case "Success":
            iconurl = "success.gif";
            break;
        case "Error":
            iconurl = "error.gif";
            break;
        default:
            iconurl = "alert.gif";
            break;
    }
    var dialog = $.dialog({
        title: msgtitle,
        content: msgcontent,
        fixed: true,
        min: false,
        max: false,
        lock: true,
        icon: iconurl,
        ok: true,
        close: function () {
            if (url == "back") {
                history.back(-1);
            }
            else if (url == "back2") {
                window.parent.location.reload();
            }
            else if (url != "") {
                location.href = url;
            }
            //执行回调函数
            if (argnum == 5) {
                callback();
            }
        }
    });
}
//打开一个最大化的Dialog
function ShowMaxDialog(tit, url) {
    $.dialog({
        title: tit,
        content: 'url:' + url,
        min: false,
        max: false,
        lock: false
    }).max();
}
//执行回传函数
function ExePostBack(objId, objmsg) {
    if ($(".checkall input:checked").size() < 1) {
        $.dialog.alert('对不起，请选中您要操作的记录！');
        return false;
    }
    var msg = "删除记录后不可恢复，您确定吗？";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    $.dialog.confirm(msg, function () {
        __doPostBack(objId, '');
    });
    return false;
}

//单选
function ExeCheckOnePostBack(objId, objmsg) {
    if ($(".checkall input:checked").size() < 1) {
        $.dialog.alert('对不起，请选中您要操作的记录！');
        return false;
    }
    if ($(".checkall input:checked").size() > 1) {
        $.dialog.alert('对不起，只能单选！');
        return false;
    }

    var msg = "删除记录后不可恢复，您确定吗？";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    $.dialog.confirm(msg, function () {
        __doPostBack(objId, '');
    });
    return false;
}

//检查是否有选中再决定回传
function CheckPostBack(objId, objmsg) {
    var msg = "对不起，请选中您要操作的记录！";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    if ($(".checkall input:checked").size() < 1) {
        $.dialog.alert(msg);
        return false;
    }
    __doPostBack(objId, '');
    return false;
}
//执行回传无复选框确认函数
function ExeNoCheckPostBack(objId, objmsg) {

    var msg = "删除记录后不可恢复，您确定吗？";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    $.dialog.confirm(msg, function () {
        __doPostBack(objId, '');
    });
    return false;
}
//后加函数--提示是否删除
//执行无回传无复选框确认函数
function ExeiskPostBack(objId, objmsg) {

    var msg = "删除记录后不可恢复，您确定吗？";
    if (arguments.length == 2) {
        msg = objmsg;
    }
    if (confirm(msg) == true)
    //if ($.dialog.confirm(msg))
        return true;
    else
        return false;
}


//隐形提交后台
function ExeCustomPostBack(objId, objmsg) {
    __doPostBack(objId, '');
}


//======================以上基于lhgdialog插件======================

//========================基于Validform插件========================
//初始化验证表单
$.fn.initValidform = function () {
    var checkValidform = function (formObj) {
        $(formObj).Validform({
            tiptype: function (msg, o, cssctl) {
                /*msg：提示信息;
                o:{obj:*,type:*,curform:*}
                obj指向的是当前验证的表单元素（或表单对象）；
                type指示提示的状态，值为1、2、3、4， 1：正在检测/提交数据，2：通过验证，3：验证失败，4：提示ignore状态；
                curform为当前form对象;
                cssctl:内置的提示信息样式控制函数，该函数需传入两个参数：显示提示信息的对象 和 当前提示的状态（既形参o中的type）；*/
                //全部验证通过提交表单时o.obj为该表单对象;
                //debugger;
                if (!o.obj.is("form")) {

                    //页面上不存在提示信息的标签时，自动创建;
                    if (o.obj.parents("dd").find(".Validform_checktip").length == 0) {
                        o.obj.parents("dd").append("<span class='Validform_checktip' />");
                        o.obj.parents("dd").next().find(".Validform_checktip").remove();
                    }
                    var objtip = o.obj.parents("dd").find(".Validform_checktip");
                    cssctl(objtip, o.type);
                    objtip.text(msg);

                    //定位到相应的Tab页面
                    if (objtip.hasClass("Validform_wrong")) {
                        var errIndex = o.curform.find(".Validform_wrong").index(objtip);
                        if (errIndex == 0) {
                            var tabobj = o.obj.parents(".tab-content"); //显示当前的选项
                            var tabindex = $(".tab-content").index(tabobj); //显示当前选项索引
                            if (!$(".content-tab ul li").eq(tabindex).children("a").hasClass("selected")) {
                                $(".content-tab ul li a").removeClass("selected");
                                $(".content-tab ul li").eq(tabindex).children("a").addClass("selected");
                                $(".tab-content").hide();
                                tabobj.show();
                            }
                        }
                    }
                }
            },
            datatype: {//传入自定义datatype类型【方式二】;
                "regFloatOrNone": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return true;
                    else {
                        if (isNaN(parseFloat(gets)))
                            return "请输入实数！";
                        else
                            return true;
                    }
                },
                "regFloat": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return false;
                    else {
                        if (isNaN(parseFloat(gets)))
                            return "请输入实数！";
                        else
                            return true;
                    }
                },
                "regIntOrNone": function (gets, obj, curform, regxp) {
                    if (gets == "") {
                        return true;
                    }
                    else {
                        var reg1 = regxp["n"];
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入整数！";
                        }
                    }
                },
                "checkSFJS": function (gets, obj, curform, regxp) {
                    var ckid = obj.attr("for");
                    var ckobj = $("#" + ckid);
                    if (ckobj && ckobj[0].checked) {
                        if (gets.length == 0) {
                            return "请选择时间！";
                        }
                        else
                            return true;
                    }
                    else
                        return true;
                },
                "checkCyr": function (gets, obj, curform, regxp) {
                    var ckid = obj.attr("for");
                    var ckobj = $("#" + ckid);
                    if (ckobj && ckobj.find("li").length > 0) {
                        return true;
                    }
                    else {
                        return "请添加参与人！";
                    }
                },
                "compareDT": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return "时间不能为空！";

                    var pid = obj.attr("tagfor");
                    var pobj = $("#" + pid).val();

                    if (pobj == "") {
                        $("#" + pid).focus();
                        // return "开始时间不能为空！";
                        return "";
                    }
                    pobj = pobj.replace(/-/g, "/") + ":00";
                    gets = gets.replace(/-/g, "/") + ":00";
                    var dt1 = Date.parse(new Date(pobj));
                    var dt2 = Date.parse(new Date(gets));

                    if (dt1 >= dt2) {
                        return "截止时间必须大于开始时间！";
                    }
                    else {
                        return true;
                    }
                },

                "checkNoneSelector": function (gets, obj, curform, regxp) {
                    if (obj.is("select")) {
                        var count = obj.find("option").length;
                        if (count == 0) {
                            return true;
                        }
                        else {
                            var index = obj.get(0).selectedIndex;
                            if (index > 0)
                                return true;
                            else
                                return "请选择！";
                        }
                    }
                    return true;
                },
                "m1": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return true;
                    else {
                        var reg1 = regxp["m"];
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的手机号！";
                        }
                    }
                },
                "e1": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return true;
                    else {
                        var reg1 = regxp["e"];
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的email！";
                        }
                    }

                },
                "url1": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return true;
                    else {
                        var reg1 = regxp["url"];
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的网址！";
                        }
                    }
                },
                "p1": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return true;
                    else {
                        var reg1 = regxp["p"];
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的网址！";
                        }
                    }
                },
                "t1": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return true;
                    else {
                        var reg1 = new RegExp("([0-9]{3}-?[0-9]{8})|([0-9]{4}-?[0-9]{7,8})");
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的电话号码！";
                        }
                    }
                },
                "t": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return "请输入正确的电话号码！";
                    else {
                        var reg1 = new RegExp("([0-9]{3}-?[0-9]{8})|([0-9]{4}-?[0-9]{7,8})");
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的电话号码！";
                        }
                    }
                },
                "tm1": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return "请输入正确的电话号码！";
                    else {
                        var reg1 = new RegExp("([0-9]{3}-?[0-9]{8})|([0-9]{4}-?[0-9]{7,8})|(1(3|4|5|7|8)[0-9]{9})");
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的电话号码！";
                        }
                    }

                },
                "tm": function (gets, obj, curform, regxp) {
                    if (gets == "")
                        return true;
                    else {
                        var reg1 = new RegExp("([0-9]{3}-?[0-9]{8})|([0-9]{4}-?[0-9]{7,8})|(1(3|4|5|7|8)[0-9]{9})");
                        if (reg1.test(gets)) return true;
                        else {
                            return "请输入正确的电话号码！";
                        }
                    }

                },
                "no": function (gets, obj, curform, regxp) {
                    return true;
                },

                "cb1": function (gets, obj, curform, regxp) {
                    //多个checkbox 选中其一
                    var ckid = obj.attr("for");

                    var ckobj = $('span[tagfor="' + ckid + '"]>input[type=checkbox]');
                    var txtobj = $('input[name="text"][tagfor="' + ckid + '"]');
                    var flag = false;
                    for (var i = 0; i < ckobj.length; i++) {
                        var o = ckobj[i];
                        if (o && o.checked) {
                            flag = true;
                            break;
                        }
                    }
                    if (txtobj.length > 0) {
                        if (ckobj[ckobj.length - 1].checked && txtobj.val() == "") {
                            flag = false;
                        }
                    }

                    ckobj.each(function () {
                        if (flag)
                            $(this).parent().removeClass("Validform_error");
                        else
                            $(this).parent().removeClass("Validform_error").addClass("Validform_error");
                    });

                    return flag;

                },
                "cb2": function (gets, obj, curform, regxp) {
                    //多个checkbox 选中其一
                    var ckid = obj.attr("for");

                    var ckobj = $('span[tagfor="' + ckid + '"]>input[type=checkbox]');
                    var txtobj = $('input[name="text"][tagfor="' + ckid + '"]');
                    var flag = false;
                    for (var i = 0; i < ckobj.length; i++) {
                        var o = ckobj[i];
                        if (o && o.checked) {
                            flag = true;
                            break;
                        }
                    }
                    if (txtobj.length > 0) {
                        if (ckobj[0].checked && txtobj.val() == "") {
                            flag = false;
                        }
                    }

                    ckobj.each(function () {
                        if (flag)
                            $(this).parent().removeClass("Validform_error");
                        else
                            $(this).parent().removeClass("Validform_error").addClass("Validform_error");
                    });
                    return flag;
                }
            },

            showAllError: true
        });
    };
    return $(this).each(function () {
        checkValidform($(this));
    });
}
//======================以上基于Validform插件======================

//智能浮动层函数
$.fn.smartFloat = function () {
    var position = function (element) {
        var top = element.position().top;
        var pos = element.css("position");
        $(window).scroll(function () {
            var scrolls = $(this).scrollTop();
            if (scrolls > top) {
                if (window.XMLHttpRequest) {
                    element.css({
                        position: "fixed",
                        top: 0
                    });
                } else {
                    element.css({
                        top: scrolls
                    });
                }
            } else {
                element.css({
                    position: pos,
                    top: top
                });
            }
        });
    };
    return $(this).each(function () {
        position($(this));
    });
};

//复选框
$.fn.ruleSingleCheckbox = function () {
    var singleCheckbox = function (parentObj) {
        //查找复选框
        var checkObj = parentObj.children('input:checkbox').eq(0);
        if (checkObj.length == 0) {
            checkObj = parentObj.children().children('input:checkbox').eq(0);
        }
        parentObj.children().hide();
        //添加元素及样式
        var newObj = $('<a href="javascript:;">'
		+ '<i class="off">否</i>'
		+ '<i class="on">是</i>'
		+ '</a>').prependTo(parentObj);
        parentObj.addClass("single-checkbox");
        //判断是否选中
        if (checkObj.prop("checked") == true) {
            newObj.addClass("selected");
        }
        //检查控件是否启用
        if (checkObj.prop("disabled") == true) {
            newObj.css("cursor", "default");
            return;
        }
        //绑定事件
        $(newObj).click(function () {
            if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
                //checkObj.prop("checked", false);
            } else {
                $(this).addClass("selected");
                //checkObj.prop("checked", true);
            }
            checkObj.trigger("click"); //触发对应的checkbox的click事件
        });
    };
    return $(this).each(function () {
        singleCheckbox($(this));
    });
};

//多项复选框
$.fn.ruleMultiCheckbox = function () {
    var multiCheckbox = function (parentObj) {
        parentObj.addClass("multi-checkbox"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        parentObj.find(":checkbox").each(function () {
            var indexNum = parentObj.find(":checkbox").index(this); //当前索引
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                newObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                    //parentObj.find(':checkbox').eq(indexNum).prop("checked",false);
                } else {
                    $(this).addClass("selected");
                    //parentObj.find(':checkbox').eq(indexNum).prop("checked",true);
                }
                parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
                //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiCheckbox($(this));
    });
}

//多项选项PROP
$.fn.ruleMultiPorp = function () {
    var multiPorp = function (parentObj) {
        parentObj.addClass("multi-porp"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<ul></ul>').prependTo(parentObj); //前插入一个DIV
        parentObj.find(":checkbox").each(function () {
            var indexNum = parentObj.find(":checkbox").index(this); //当前索引
            var liObj = $('<li></li>').appendTo(divObj)
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a><i></i>').appendTo(liObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                liObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                if ($(this).parent().hasClass("selected")) {
                    $(this).parent().removeClass("selected");
                } else {
                    $(this).parent().addClass("selected");
                }
                parentObj.find(':checkbox').eq(indexNum).trigger("click"); //触发对应的checkbox的click事件
                //alert(parentObj.find(':checkbox').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiPorp($(this));
    });
}

//多项单选
$.fn.ruleMultiRadio = function () {
    var multiRadio = function (parentObj) {
        parentObj.addClass("multi-radio"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        parentObj.find('input[type="radio"]').each(function () {
            var indexNum = parentObj.find('input[type="radio"]').index(this); //当前索引
            var newObj = $('<a href="javascript:;">' + parentObj.find('label').eq(indexNum).text() + '</a>').appendTo(divObj); //查找对应Label创建选项
            if ($(this).prop("checked") == true) {
                newObj.addClass("selected"); //默认选中
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                newObj.css("cursor", "default");
                return;
            }
            //绑定事件
            $(newObj).click(function () {
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected");
                parentObj.find('input[type="radio"]').prop("checked", false);
                parentObj.find('input[type="radio"]').eq(indexNum).prop("checked", true);
                parentObj.find('input[type="radio"]').eq(indexNum).trigger("click"); //触发对应的radio的click事件
                //alert(parentObj.find('input[type="radio"]').eq(indexNum).prop("checked"));
            });
        });
    };
    return $(this).each(function () {
        multiRadio($(this));
    });
}

//单选下拉框
$.fn.ruleSingleSelect = function () {
    var singleSelect = function (parentObj) {
        parentObj.addClass("single-select"); //添加样式
        parentObj.children().hide(); //隐藏内容
        var divObj = $('<div class="boxwrap"></div>').prependTo(parentObj); //前插入一个DIV
        //创建元素
        var titObj = $('<a class="select-tit" href="javascript:;"><span></span><i></i></a>').appendTo(divObj);
        var itemObj = $('<div class="select-items"><ul></ul></div>').appendTo(divObj);
        var arrowObj = $('<i class="arrow"></i>').appendTo(divObj);
        var selectObj = parentObj.find("select").eq(0); //取得select对象
        //遍历option选项
        selectObj.find("option").each(function (i) {
            var indexNum = selectObj.find("option").index(this); //当前索引
            var liObj = $('<li title=' + $(this).text() + '>' + $(this).text() + '</li>').appendTo(itemObj.find("ul")); //创建LI
            if ($(this).prop("selected") == true) {
                liObj.addClass("selected");
                titObj.find("span").text($(this).text());

                titObj.attr({ "title": $(this).text() });
            }
            //检查控件是否启用
            if ($(this).prop("disabled") == true) {
                liObj.css("cursor", "default");
                return;
            }
            //绑定事件
            liObj.click(function () {
                $(this).siblings().removeClass("selected");
                $(this).addClass("selected"); //添加选中样式
                selectObj.find("option").prop("selected", false);
                selectObj.find("option").eq(indexNum).prop("selected", true); //赋值给对应的option
                titObj.find("span").text($(this).text()); //赋值选中值
                arrowObj.hide();
                itemObj.hide(); //隐藏下拉框
                selectObj.trigger("change"); //触发select的onchange事件
                //alert(selectObj.find("option:selected").text());
            });
        });
        //设置样式
        //titObj.css({ "width": titObj.innerWidth(), "overflow": "hidden" });
        //itemObj.children("ul").css({ "max-height": $(document).height() - titObj.offset().top - 62 });

        //检查控件是否启用
        if (selectObj.prop("disabled") == true) {
            titObj.css("cursor", "default");
            return;
        }
        //绑定单击事件
        titObj.click(function (e) {
            e.stopPropagation();
            if (itemObj.is(":hidden")) {
                //隐藏其它的下位框菜单
                $(".single-select .select-items").hide();
                $(".single-select .arrow").hide();
                //位于其它无素的上面
                arrowObj.css("z-index", "1");
                itemObj.css("z-index", "1");
                //显示下拉框
                arrowObj.show();
                itemObj.show();
            } else {
                //位于其它无素的上面
                arrowObj.css("z-index", "");
                itemObj.css("z-index", "");
                //隐藏下拉框
                arrowObj.hide();
                itemObj.hide();
            }
        });
        //绑定页面点击事件
        $(document).click(function (e) {
            selectObj.trigger("blur"); //触发select的onblure事件
            arrowObj.hide();
            itemObj.hide(); //隐藏下拉框
        });
    };
    return $(this).each(function () {
        singleSelect($(this));
    });
}

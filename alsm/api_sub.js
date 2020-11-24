function doApi(sucFunc, errFunc, comFunc, url, type, params, contentType, async) {
    $.ajax({
        url: url,
        data: params,
        type: type,
        async: async ? true : async,
        contentType: contentType,
        // async: true,
        beforeSend: function (request) {
            var token = localStorage.getItem('token');
            if (token) {
                request.setRequestHeader('Authorization', token);
            }
        },
        success: sucFunc,
        error: function (res) {
            if (res.responseText.substr(0, 30) === "AuthenticationEntryPoint检测到异常:") {
                localStorage.removeItem('token');
                window.location.href = 'Login.html';
            } else if (errFunc) {
                errFunc(res);
            }
        },
        complete: comFunc
    });
}

function doApiByJsonstr(sucFunc, errFunc, comFunc, url, type, params, async) {

    var jsonParams = null;
    if (params) {
        jsonParams = JSON.stringify(params);
    }
    doApi(sucFunc, errFunc, comFunc, url, type, jsonParams, 'application/json', async)
}

//（带文件）form表单提交
function doApiByFile(sucFunc, errFunc, comFunc, url, type, params, async) {

    $.ajax({
        url: url,
        type: type,
        // {contentType:false processData:false 固定写法}
        contentType: false,
        processData: false,//是否预处理数据:默认为true，默认情况下，发送的数据将被转换为对象，设为false不希望进行转换
        data: params,
        async: async ? true : async,
        beforeSend: function (request) {
            var token = localStorage.getItem('token');
            if (token) {
                request.setRequestHeader('Authorization', token);
            }
        },
        success: sucFunc,
        error: errFunc,
        complete: comFunc
    })
}


//截取时间
function getPartTime(val) {
    if (val != null) {
        val = val.substring(0, 10);
    }
    return val;
}


//设置高度
function setMyHeight(obj, val) {
    var h = $(window).height() - val;
    $(obj).css("height", h + "px");
}

//打开查询页面
function openSelect(val) {
    top.toggleSelectHtml(val);
    top.setSelectHtmlHeight(0);
}

//打开路线页面
function openRoute(routeType, passingPoint, row, relationId) {
    top.toggleRouteDetails(routeType, passingPoint, row, relationId);
    top.showTrace(row.passingPoint, undefined, undefined, false);
    top.setRouteDetailsHeight(0);
}

//处理获得的点位存入途经点
function getPassingPoint(val) {
    if (val) {
        var passingPoint = "";
        for (var i = 0, len = val.length; i < len; i++) {
            var tmp = val[i];
            passingPoint += "," + tmp[0] + "," + tmp[1] + ";";
        }
        return passingPoint;
    }
    return null;
}


//获得压缩图片的路径
function getThumbnail(val) {
    if (val != null) {
        var index = val.lastIndexOf(".");
        if (index != -1) {
            val = val.substring(0, index) + "_min.jpg";
        }
    }
    return val;
}

//获得压缩视频的路径
function getCompressVideo(val) {
    if (val != null) {
        var index = val.lastIndexOf(".");
        if (index != -1) {
            val = val.substring(0, index) + "_min.mp4";
        }
    }
    return val;
}

//替换文件url的ip
function urlChangeIp(url, prefix) {
    if (url != null) {
        var i = url.indexOf("/file/");
        if (i != -1) {
            return prefix + url.substring(i);
        }
    }
    return null;
}

//判断url对应的文件是否存在
function isExistUrl(yourFileURL) {
    try {
        var xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();//其他浏览器
        } else if (window.ActiveXObject) {
            try {
                xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");//旧版IE
            } catch (e) {
            }
            try {
                xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");//新版IE
            } catch (e) {
            }
            if (!xmlhttp) {
                window.alert("不能创建XMLHttpRequest对象");
            }
        }

        xmlhttp.open("HEAD", yourFileURL, false);
        xmlhttp.send();
        if (xmlhttp.readyState == 4) {
            if (xmlhttp.status == 200) {
                return true;
            }
        }
    } catch (e) {
        console.info(e);
    }
    return false;
}

//格式化时间
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

//按默认格式或给定格式，格式化时间
function formatTimeToStr(times, pattern) {
    var d = new Date(times).Format("yyyy-MM-dd hh:mm:ss");
    if (pattern) {
        d = new Date(times).Format(pattern);
    }
    return d.toLocaleString();
}

function getIETime(dateStr) {
    dateStr = dateStr.replace("-", "/");
    return Date.parse(dateStr);
}

//将时分秒设为00:00:00
function setStartTime(valStr) {
    if (valStr == null || valStr == "") {
        return null;
    }
    valStr = getIETime(valStr);
    var val = new Date(valStr);
    val.setHours(0);
    val.setMinutes(0);
    val.setSeconds(0);
    return formatTimeToStr(val);
}

//将时分秒设为23:59:59
function setEndTime(valStr) {
    if (valStr == null || valStr == "") {
        return null;
    }
    valStr = getIETime(valStr);
    var val = new Date(valStr);
    val.setHours(23);
    val.setMinutes(59);
    val.setSeconds(59);
    return formatTimeToStr(val);
}


// 身份证号码验证
var checkProv = function (val) {
    var pattern = /^[1-9][0-9]/;
    var provs = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门"
    };
    if (pattern.test(val)) {
        if (provs[val]) {
            return true;
        }
    }
    return false;
}
var checkDate = function (val) {
    var pattern = /^(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)$/;
    if (pattern.test(val)) {
        var year = val.substring(0, 4);
        var month = val.substring(4, 6);
        var date = val.substring(6, 8);
        var date2 = new Date(year + "-" + month + "-" + date);
        if (date2 && date2.getMonth() == (parseInt(month) - 1)) {
            return true;
        }
    }
    return false;
}
var checkCode = function (val) {
    var p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    var code = val.substring(17);
    if (p.test(val)) {
        var sum = 0;
        for (var i = 0; i < 17; i++) {
            sum += val[i] * factor[i];
        }
        if (parity[sum % 11] == code.toUpperCase()) {
            return true;
        }
    }
    return false;
}

function checkIdNumber(val) {
    if (checkCode(val)) {
        var date = val.substring(6, 14);
        if (checkDate(date)) {
            if (checkProv(val.substring(0, 2))) {
                return true;
            }
        }
    }
    return false;
}

// 手机号码验证
function checkPhoneNumber(num) {
    var reg = new RegExp(/^[1]([3-9])[0-9]{9}$/)
    if (!reg.test(num)) {
        return false;
    }
    return true
}


// 民警、堡垒户树内容复制接口 ------------------------------------------------------------------
function copyTree(srcObj, desObj) {// 复制数据的点位和状态
    if (Array.isArray(srcObj) && Array.isArray(desObj)) {
        var preIndex = 0;
        // 添加，更新
        for (var i = 0; i < srcObj.length; i++) {
            var isFind = false;
            var index = 0;
            for (var j = 0; j < desObj.length; j++) {
                index = j;
                if (srcObj[i].id === desObj[j].id) {
                    copyTree(srcObj[i], desObj[j]);
                    isFind = true;
                    break;
                }
            }
            if (!isFind) {
                if (preIndex < desObj.length) {
                    desObj.splice(preIndex, 0, srcObj[i])
                } else {
                    desObj.push(srcObj[i]);
                }
            }
            preIndex = index + 1;
        }
        // 删除
        for (var j = 0; j < desObj.length; j++) {
            var isFind = false;
            for (var i = 0; i < srcObj.length; i++) {
                if (srcObj[i].id === desObj[j].id) {
                    isFind = true;
                    break;
                }
            }
            if (!isFind) {
                desObj.splice(j--, 1)
            }
            preIndex = index + 1;
        }
    } else if (srcObj.children && desObj.children) {
        copyObj(srcObj, desObj);
        copyTree(srcObj.children, desObj.children);
    } else {
        copyObj(srcObj, desObj);
    }
}

function copyObj(srcObj, desObj) {
    for (var key in srcObj) {
        if (srcObj.hasOwnProperty(key)) {
            if ('children' !== key) {
                desObj[key] = srcObj[key];
            }
        }
    }
}

function calculateNum(obj) {
    if (!obj) {
        return;
    }
    if (Array.isArray(obj)) {
        for (var i = 0; i < obj.length; i++) {
            this.calculateNum(obj[i].children);
            obj[i].onlineNum = sumOnlinePerson(obj[i]);
            obj[i].allNum = sumAllPerson(obj[i]);
            if (obj[i].name && obj[i].onlineNum) {
                obj[i].name = obj[i].name + '  (' + obj[i].onlineNum + '/' + obj[i].allNum + ')';
            }
            //   console.log(obj[i].name, obj[i].onlineNum);
        }
    }
}

function sumAllPerson(val) {
    return nodeRecursion(val, 0, true);
}

function sumOnlinePerson(val) {
    return nodeRecursion(val, 0, false);
}

function nodeRecursion(val, sum, isAll) {
    if (val.children === undefined) {
        return sum;
    }
    if (val.type == '派出所') {
        for (var i = 0; i < val.children.length; i++) {
            if (isAll || val.children[i].status == '在线') {
                sum++;
            }
        }
        return sum;
    }
    for (var i = 0; i < val.children.length; i++) {
        sum = sum + nodeRecursion(val.children[i], 0, isAll);
    }
    return sum;

}

// ----------------------------------------------------------------------------------------

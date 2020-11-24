function dropBefore(node, targetNode, treeId) { return true; } //拖动前
function outputBefore(paras) { return paras; } //导出excel前发生
function validateBefore(datas) { return true; } //验证前
function validateAfter(datas) { return true; } //验证完后

function successAfter(data, func) { return true; } //调用服务成功返回后

function treeNodeClickBefore(node, treeId, isLoad) { return true; } //树结点单点击前
function treeNodeClickAfter(node) { return true; } //树结点单点击后
function treeDataLoadAfter(treeId, row) { return true; } //树数据获取后装载后
function treeNodeLoadAfter(treeId, row) { return true; } //树结点装载后
function treeInitAfter(treeId, row) { return true; } //树初使化后
function setTreeNode(node, treeId, isLoad) { return node; } //树结点单点击前

//var serverJson = {isJsonp:true, url:'http://localhost:50471/plat.aspx',serverUrl: 'http://localhost:8080/platProj/'}
var serverJson = {url:'http://ttyu.net/pp/plat.aspx',serverUrl: 'http://ttyu.net:8080/patrol/'}//http://localhost:8080/ttyuPatrol
//用户信息
var user = { userID: 0, userName: '没登录', headImage: '',projectID: 1,deptID: null };
var vm;
var apps = [], appTree;

function getServerUrl() {
    return serverJson.serverUrl;
}

function setAppHeight() { //APP/set 页面计算高度
    var client = document.documentElement.clientHeight || document.body.clientHeight;
    var middleDesign = $(".middle-design");
    if (middleDesign.length > 0) {
        var offM = middleDesign.offset().top;
        var mHeight = client - offM;
        middleDesign.height(mHeight - 3);

        var middleTab = $(".middle-tab");
        var middleTitle = $(".middle-title");
        var titleH = middleTitle.height();
        middleTab.height(mHeight - titleH);

        var right = $(".right");
        var left = $(".left");
        var offL = left.offset().top;
        var lHeight = client - offL;
        right.height(lHeight); //右侧高度
        left.height(lHeight); //左侧高度

        var treeHeight = $(".tree-height");
        treeHeight.height(lHeight * 0.4 - 41);

        var rightSpanDivH = $(".right-spanDiv");
        rightSpanDivH.height(lHeight * 0.6 - 41);
    }
}
(function ($) {
    init(); //return;
    ttyu.user.init();
    pageWidth("page");
    //height('ttyu-hight');
   
    $.fn.extend({
        send: function (row) {
            var that = $(this);
            row.data=getRowData(that,false);
            ttyu.sql.saveValidate(row,that);
        }
    });

    $.fn.load = function (row,fun) {
        var that = $(this);
        if (that.length == 0) {
            alert(that.selector + " 不存在！"); return;
        }
        if(row.data!=null&&row.data.id!=null){
            row.id=row.data.id;row.where=row.data.where;
            row.paras=row.data;ttyu.json.del(row.paras,"id");
        };//以值保存参数值
        row.el=that.selector;row.noLoad=false;
        var type = row.type;
        if (type == null) {
            var tagName = that[0].tagName.toLowerCase();
            if (tagName == "input" && that[0].type == "file") {
                row.url = serverJson.serverUrl + "?do=upload&isNewFile=false";
                that.ssi_uploader(row); return;
            }           
            if (tagName == "ul")
                type = "tree";
            if (tagName == "select")
                type = "select";
        }
        row.type=type;
        switch (type) {
            case 'fileOne':case 'files':case 'images':case 'imageOne': case 'file':ttyu.file.init(row,fun); break;
            case 'tree':
                $(this.selector).attr('index',apps.length);
                var el = apps.find('el', (row.el).replace('#',''));
                if (el != null) {
                    remove(apps, 'el', (row.el).replace('#',''));
                }
                apps.push(row); 
                ttyu.tree.init(row,fun);
                return;
        }
        $(this.selector).attr('index',apps.length);//生成一个标准的行
        if(row.el==null) return;
        var el = apps.find('el', (row.el).replace('#',''));
        if (el != null) {
            remove(apps, 'el', (row.el).replace('#',''));
        }
        apps.push(row);
    };
})(jQuery);

function clientTable(name) {
    var clientTable = $("."+name); //固定表格高度  并 溢出 出现滚动条
    if (clientTable.length > 0) {
        var client = document.documentElement.clientHeight || document.body.clientHeight;
        clientTable.each(function () {
            var offtop = $(this).offset().top;
            var height = client - offtop - 10;
            $(this).css({
                "height": height,
                "overflow": "auto"
            })
        })
    }
}
function width(className) {
    var oWidth = document.documentElement.clientWidth;
    var oModalWrap = $("." + className); // document.getElementsByClassName(className);
    for (var i = 0; i < oModalWrap.length; i++) {
        $(oModalWrap[i]).width(oWidth - 40 + "px");
    }
}
function pageWidth(className) {
    if (isNaN($(".ztree-wrap"))) return; //空值{...}
    var oWidth = $(".ztree-wrap").width();
    $("." + className).css("left", oWidth + 5 + "px");
}
function height(className, num) {
    var oHeight = document.documentElement.clientHeight;
    var oModalWrap = $("." + className);//  document.getElementsByClassName(className);
    if(oModalWrap.length==0) return;
    var oModalWrapOff = oModalWrap.offset().top;
    if (num != null) {
        for (var i = 0; i < oModalWrap.length; i++) {
            $(oModalWrap[i]).height(oHeight - 13 - oModalWrapOff + num + "px");
        }
    } else {
        for (var i = 0; i < oModalWrap.length; i++) {
            $(oModalWrap[i]).height(oHeight - 13 - oModalWrapOff+ "px");
        }
    }
}

function init() {
    //初始化时加载类
    ttyu = {        
        isArray: function (object) {
            return object && typeof object == 'object' && Array == object.constructor;
        },
        isNull: function (obj) { //判字符是否为空
            if (obj == null || typeof (obj) == "null" || obj == "" || obj == null || obj.length == 0) return true;
            return false;
        },
        getRootUrl: function () {
            var curWwwPath = window.document.location.href;
            var pathName = window.document.location.pathname;
            var pos = curWwwPath.indexOf(pathName);
            var localhostPaht = curWwwPath.substring(0, pos);
            var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            //if (projectName == "/plat") projectName = "";
            return localhostPaht + projectName;
        },
        wordOutput: function (fileName, sqlRow, sqlRows) {//导出word模板
            var paras = "docFile=" + fileName + "&sqlRow=" + sqlRow + "&sqlRows=" + sqlRows;
            ttyu.server.service('wordOutput', paras, function (url) {
                window.location = url;
            });
        }, //是否为ie浏览器
        isIE: function () { var ie = navigator.appName == "Microsoft Internet Explorer"||navigator.appName == "Netscape" ? true : false; return ie; },
        verIE: function () {//ie浏览器的版本
            var b_version = navigator.appVersion; var version = b_version.split(";");
            if (version.length > 1) return version[1].replace(/[ ]/g, "");
            else version
        },
        set: function (key, value) { localStorage.setItem(key, value); }, //保存本地的数据
        get: function (key) { return localStorage.getItem(key); }, //获取本地保存的键值
        getUrlKeyValue: function (key) {//获使url的键值 //ttyu.web.3.0.1.js中的函数  -- 赵长山 -- 2019-05-30
            var url = document.location.search.trimEnd("?").trimStart("?");
            return url.getUrlValue(key);
        },
        getKey: function (key) {//获使url的键值 //ttyu.web.3.0.1.js中的函数  -- 赵长山 -- 2019-05-30
            return ttyu.getUrlKeyValue(key);
        },
        goUrl: function (url, isNew) {//跳转到url
            if (url == "" || url == null) {
                history.go(-1);
                return;
            }
            if (!isNew || isNew == null)
                window.location = url;
            else
                window.open(url);
        },
        getRandomNum: function GetRandomNum(Min, Max) {//随机数(
            var Range = Max - Min;
            var Rand = Math.random();
            return (Min + Math.round(Rand * Range));
        },
        guid: function () {//获取36位唯一码
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = ""; //"-"
            var uuid = s.join("");
            return uuid;
        },
        //数据分组,生成唯一的不重复的分组数据
        groupJson: function groupJson(data, groupName) {
            var curr = [];
            for (i = 0; i < data.length; i++) {
                var d1 = data[i][groupName];
                var isHas = false;
                for (j = 0; j < curr.length; j++) {
                    var d2 = curr[j][groupName];
                    if (d1 == d2) {
                        isHas = true; break;
                    }
                }
                var group0 = "{\"" + groupName + "\":\"" + d1 + "\"}";
                group0 = eval('(' + group0 + ')');
                if (!isHas) curr.push(group0);
                if (curr.length == 0) curr.push(group0);
            }
            return curr;
        },       
        iFrameHeight: function (iframe1) {//设置iFrame高，使其自适应
            var val = parent.document.getElementById(iframe1);
            var bHeight = val.contentWindow.document.body.scrollHeight;
            var dHeight = val.contentWindow.document.documentElement.scrollHeight;
            var height = Math.max(bHeight, dHeight);
            val.height = height;
        },
        loadSelect: function (me, rows) {//装载下拉列表控件
            if (me != null) {
                if (isJqueryObject(me)) me = me[0];
                me.options.length = 0;
                for (var i = 0, len = me.options.length; i < len; i++) {
                    me.options[0] = null;
                }
                var selectIndex = -1;
                $.each(rows, function (n, row) {//清空
                    var name = row.NAME; var id = row.ID; //oracle大写
                    if(name==null){
                        name = row.name; id = row.id; //oracle大写
                    }
                    var option = document.createElement("option");
                    option.text = name;
                    if (id != null)
                        option.value = id;
                    if (row.select != null && row.select == true) {
                        selectIndex = n; option.selected = true;
                    }
                    me.add(option);
                });
                if (selectIndex > -1)
                    me.options[selectIndex.selected] = true;
            }
        },
        clear: function (obj) {//清空控件
            var meO = $(obj);
            if (meO == null) {
                if (curr.edit == null) meO = curr.find.me;
                else meO = curr.edit.me;
            }
            var inputs = $(meO).find("input,textarea,select,div")//[error]
            $.each(inputs, function (n, value) {//清空
                switch (value.tagName) {
                    case "DIV":
                        if ($(value).attr('contenteditable') == "true") $(value).text(''); break;
                    case "TEXTAREA":
                    case "INPUT":
                        if (value.value == "…" || value.type == "button" || value.type == "hidden" || this.disabled)
                            return;
                        if (value.type == "file")
                            $(".ssi-imgToUpload").attr("src", "");
                        else
                            value.value = "";
                        break;
                }
            });
        }
    };

    ttyu.page = {
        loadMask: function () {//页面装载面罩
            var div = "<div id='mask1' style='position:absolute;top:0;width:100%;left:0;height:100%; filter: alpha(opacity=100);opacity: 1.0;overflow: hidden;background:url(../../app/image/mainwait.gif) center center White no-repeat;;z-index:9999'></div>";
            if (!ttyu.isExist('mask1'))
                $(div).appendTo("body");
        },
        loadSelect: function () {//装载下拉列表
            $.each($("select[row]"), function (n, me) {
                var row = $(me).attr('row'); //{tableName:'sys_user_users',field:'ID,NAME',where:'compId=[getCompId]'}
                row = ttyu.doFunc(row); row = eval('(' + row + ')');
                ttyu.page.loadSelectByKeys(me, row);
            });
        },
        loadSelectByKeys: function (me, row, func) {//装载下拉列表
            var first = row.first;
            if (row.data != null) {
                ttyu.loadSelect(me, row.data); return;
            }
        },
        loadOpenWindow: function () {//装载弹出窗口
            loadOpenWindow();
        },
        loadFile: function () {//装载选择
            loadFile();
        }
    };
    ttyu.form = {
        clear: function (isFind) {return;
            if (isFind) ttyu.clear(appFind);
            else ttyu.clear($(appForm.el));
        }, //清数据
        nodisabled: function (that) {
            var me;
            if (curr.edit != null && curr.edit.me) me = curr.edit.me;
            if (that != null) me = that;
            var inputs = $(me).find("input,textarea,select,file,button");
            inputs.attr('disabled', null); //inputs.attr('readonly', null);
        },
        disabled: function (that) {
            var me;if (that != null) me = that;
            var inputs = $(me).find("input,textarea,select,file,button");
            inputs.attr('disabled', 'disabled'); //inputs.attr('readonly', 'readonly');
        },
        validate: function (data,that) {
            return ttyu.validate.validates(data,that);
        },
        find: function (findUI,fun) {//按条件查找        
            //var findUI =appFind;
            if (findUI.length ==0) return "";
            var datas = getRowData(findUI);
            var where = "1=1";
            $.each(datas, function (n, row) {//清空
                if (row.value != "" && row.value != "全选" && row.value != "全部" && row.value != "请选择") {
                    var a = row.name + " like '%" + row.value.trim() + "%'";
                    if ((row.value == "true" || row.value == "false" || row.value == true || row.value == false) && row.value != 0 && row.value != 1) {
                        a = row.name + "=" + row.value;
                    }
                    if (!isNaN(row.value)) {//是否是非数字值,是数字且是select时
                        var b = $(findUI).find('[name=' + row.name + ']');
                        if (b.length == 1 && b[0].tagName == 'SELECT')
                            a = row.name + "=" + row.value;
                    }
                    if (row.value.contains('-')) {
                        var v = row.value.split('-');
                        if (v.length != 3)//2018-01-02
                            if (!isNaN(v[0]))//是否是非数字值
                                a = row.name + ">=" + v[0] + " and " + row.name + "<=" + v[1];
                    }
                    if (row.name.startWith("from_"))
                        a = row.name.replace("from_", "") + ">='" + row.value + "'";
                    if (row.name.startWith("to_"))
                        a = row.name.replace("to_", "") + "<='" + row.value + "'";
                    where += " and " + a;
                }
            });
            return where;
        }
    };
    ttyu.table = {
        init: function (row,fun) {//增加
            newTable(row);
        },         
        excelOutput: function () {//
            if(appTable==null) return;
            var id=appTable.el;var table=$(id);
            var title = table.parent().parent().parent().find('.t-title');
            if (title.length > 1)
                title = $(title[1]);
            title = title.find('span').text();
            var table = appTable.me[0];
            var tr1 = appTable.item;
            // paras = outputBefore(paras, data);
            var dataJSON = ttyu.sql.initData();
            dataJSON.action = 'excelOutput';
            dataJSON.where = appTable.server.where;
            dataJSON.paras = { fileName: null, title: title, table: table.outerHTML, widths: null, isUIDatas: false };
            if (table.outerHTML.contains('合计:')) dataJSON.paras.isUIDatas = true;
            outputBefore(dataJSON);
            ttyu.server.doServer(dataJSON, function (value) {
                    var url = serverJson.fileUrl.trimEnd("/") + "/excel/" + value;
                    window.location = url;
                }
            );
        },
        total: function (table, cells, values) {//表格统计求和
            if (table == null) table = appTable.me; var cells = [];
            var tds = appTable.item.find('td'); var fields = ''; var names = [];
            $.each(tds, function (n, me) {
                var td = $(me);
                var total = td.attr('total');
                if (total != null) {
                    if (total == 'sum') {
                        var name = td.attr('name'); names.push(name);
                        name = 'sum(' + name + ') as ' + name; // name = parseFloat(name).toFixed(2);
                        fields += name + ','; //
                        cells.push(n);
                    }
                }
            });
            fields = fields.trimEnd(',');
            if (appTable.sql == null || fields == '') return;
            var oleFields = appTable.sql.toLowerCase().getBetween('select ', ' from'); //if (oleFields == '') oleFields = '*';
            var tr = table.find("tr");
            var tdLen = tr[0].children.length;
            var colspan = cells[0];
            var str = "<tr class='total'><td colspan='" + colspan + "' style='padding-left:18px'>合计:</td>";
            for (var k = 0; k < tdLen - colspan; k++) {
                str += "<td></td>";
            }
            str += "</tr>"; var trTotal = $(str);
            table.find('tbody').append(trTotal); var tds = trTotal.children();
            var sql = curr.table.sql.toLowerCase().replace(oleFields, fields); //
            var where = ttyu.page.where;
            if (where != "") sql = sql.replace(" where ", " where " + where + " and ");
            if (!totalBefore(table, tds, cells, names, sql)) return;//统计时有重复数据(即原sql中有DISTINCT)要去重，要单独立写接口
            ttyu.sql.getRowBySql(sql, function (row) {
                for (var k = 0; k < cells.length; k++) {
                    var tdnum = cells[k] - cells[0] + 1; var name = names[k];
                    if (row[name] != null)
                        tds.eq(tdnum).text(row[name].toFixed(2));
                }
            });
        }
    };

    ttyu.tree = {
        getFirstPageNode: function (id) {//得到树的第一个页面结点
            var node = appTree.ztree.getNodes()[0];
            return ttyu.tree.getEndPageNode(node);
        },
        getEndPageNode: function (node) {//得到树的第一个页面结点
            if (node.children != null && node.children.length > 0) {
                node = node.children[0];
                if (node.isParent) {
                    node = node.children[0];
                    if (node.isParent) {
                        node = node.children[0];
                    }
                }
            }
            return node;
        },
        getNodes: function (id) {
            var treeObj = $.fn.zTree.getZTreeObj(id); var pnodes = treeObj.getNodes();
            var nodes = [];
            $(pnodes).each(function () {
                nodes.push(this); //
                $(this.children).each(function () {
                    nodes.push(this);
                })
            })
            return nodes;
        },
        selectedNodes: function (id) {
            var treeObj = $.fn.zTree.getZTreeObj(id);
            var selectedNodes = treeObj.getCheckedNodes();
            var ids = ""; var names = "";
            $.each(selectedNodes, function (n, me) {
                var id = me.id;
                if (id != 0 && !me.isParent) {
                    ids += id + ","; names += me.name + ",";
                }
            });
            ids = ids.trimEnd(','); names = names.trimEnd(',');
            return { ids: ids, names: names };
        },
        getNodes: function (id) {
            var treeObj = $.fn.zTree.getZTreeObj(id); var pnodes = treeObj.getNodes();
            var nodes = [];
            $(pnodes).each(function () {
                nodes.push(this); //
                $(this.children).each(function () {
                    nodes.push(this);
                })
            })
            return nodes;
        },
        showIco: function (id, showIco) {
            var zTree = $.fn.zTree.getZTreeObj(id);
            var setting1 = zTree.setting;
            setting1.view.showIcon = showIco;
            $.fn.zTree.init($("#" + id), setting1, zTree.getNodes());
        },
        showLine: function (id, showLine) {
            var zTree = $.fn.zTree.getZTreeObj(id);
            var setting1 = zTree.setting;
            setting1.view.showLine = showLine;
            $.fn.zTree.init($("#" + id), setting1, zTree.getNodes());
        },
        candrag: function (id, drag) {
            var zTree = $.fn.zTree.getZTreeObj(id);
            var setting1 = zTree.setting;
            setting1.edit.drag = drag;
            $.fn.zTree.init($("#" + id), setting1, zTree.getNodes());
        },
        nodeIcon: function (id, type) {
            //$("#" + id).find('.ico_open').css("background-image", "url('" + icon + "')");//_ico_docu  ico_open
            var spanIcos = $("#" + id).find('span[treenode_ico]');
            var v = type;
            if (type != 'pIcon' && type != '') v = type + '_';
            if (type == 'pIcon01' || type == 'pIcon02' || type == 'pIcon') {
                if (type == 'pIcon') v = '';
                $("#" + id).find('span[class$=ico_open]').attr('class', 'button ' + v + 'ico_open');
            }
            else $("#" + id).find('span[class$=ico_docu]').attr('class', 'button ' + v + 'ico_docu');

        },
        setType: function (id, type) {
            var zTree = $.fn.zTree.getZTreeObj(id);
            var setting1 = zTree.setting;
            var type1 = "checkbox";
            var ischk = true;
            if (type == "radio") type1 = "radio";
            if (type == "") ischk = false;
            setting1.check.chkStyle = type1;
            setting1.check.enable = ischk;
            $.fn.zTree.init($("#" + id), setting1, zTree.getNodes());
        },
        init: function (row,fun) { //初使化参数
            try {
                row.el=row.el.getAfter('#');this.appTree=row;
                var datas=row.data;
                if(row.data!=null){//不调用接口
                    if(row.id!=null){
                        var attr1=row.attr;row.attr=null;
                        datas = ttyu.server.doServer(row); //屏蔽后台取原型设计中左上角树  -- 赵长山 -- 2019-04-03
                        //datas = [{"ID":1138,"ProjectID":80,"ParentID":0,"Name":"新页面","Url":null,"IsEnable":true,"OrderIndex":10,"Template":"web","IsPage":true,"bodyHtml":"<button id=\"t_0\" class=\"t-btn\" style=\"text-align: left; width: 70px; height: 30px; z-index: 1; opacity: 1; left: 210px; top: 78px; font-size: 12px; font-family: 宋体; border-radius: 0px; letter-spacing: 0px;\">按钮</button><span id=\"t_1\" class=\"t-span\" style=\"width: 80px; height: 40px; opacity: 1; left: 410px; top: 152px; font-size: 12px; font-family: 宋体; border-radius: 0px; letter-spacing: 0px; text-align: left;\">标签</span>","nodes":"[{\"id\":\"t_0\",\"data\":null,\"th\":null,\"td\":null,\"parent\":\"design\",\"tree\":null,\"table\":null,\"tab\":null,\"name\":\"按钮(按钮)\",\"code\":null,\"type\":\"button\",\"attrShow\":{\"inputType\":false,\"showAttr\":false,\"textType\":true,\"borderType\":true,\"d3Type\":true,\"selectType\":false,\"tableType\":false,\"extType\":false,\"treeType\":false,\"tabType\":false},\"attr\":{\"inputType\":\"text\",\"display\":true,\"opacity\":1,\"z_index\":10,\"rotate\":\"0\",\"scaleX\":null,\"scaleY\":null,\"skewX\":null,\"skewY\":null,\"rotateX\":null,\"rotateY\":null,\"rotateZ\":null,\"common\":\"\",\"border_radius\":0,\"font_size\":12,\"font_family\":\"宋体\",\"value\":\"按钮\",\"font_weight\":false,\"font_style\":false,\"line_through\":false,\"overline\":false,\"white_space\":false,\"letter_spacing\":0,\"text_align\":\"left\",\"type\":null,\"title\":null,\"color\":null,\"background\":null,\"code\":null,\"width\":\"70px\",\"height\":\"30px\",\"left\":\"210px\",\"top\":\"78px\",\"font-size\":\"12px\",\"font-family\":\"宋体\",\"border-width\":\"undefinedpx\",\"border-radius\":\"0px\",\"letter-spacing\":\"0px\",\"text-align\":\"left\"},\"api\":null,\"isNew\":false},{\"id\":\"t_1\",\"data\":null,\"th\":null,\"td\":null,\"parent\":\"design\",\"tree\":null,\"table\":null,\"tab\":null,\"name\":\"标签(标签)\",\"code\":\"<span class='t-span' style='width:80px;height: 40px' id=\\\"t_1\\\">标签</span>\",\"type\":\"span\",\"attrShow\":{\"inputType\":false,\"showAttr\":false,\"textType\":true,\"borderType\":true,\"d3Type\":true,\"selectType\":false,\"tableType\":false,\"extType\":false,\"treeType\":false,\"tabType\":false},\"attr\":{\"inputType\":\"text\",\"display\":true,\"opacity\":1,\"z_index\":10,\"rotate\":\"0\",\"scaleX\":null,\"scaleY\":null,\"skewX\":null,\"skewY\":null,\"rotateX\":null,\"rotateY\":null,\"rotateZ\":null,\"common\":\"\",\"border_radius\":0,\"font_size\":12,\"font_family\":\"宋体\",\"value\":\"标签\",\"font_weight\":false,\"font_style\":false,\"line_through\":false,\"overline\":false,\"white_space\":false,\"letter_spacing\":0,\"text_align\":\"left\",\"type\":null,\"title\":null,\"color\":null,\"background\":null,\"code\":null,\"width\":\"80px\",\"height\":\"40px\",\"left\":\"410px\",\"top\":\"152px\",\"font-size\":\"12px\",\"font-family\":\"宋体\",\"border-width\":\"undefinedpx\",\"border-radius\":\"0px\",\"letter-spacing\":\"0px\",\"text-align\":\"left\"},\"api\":null,\"isNew\":false}]","ico":"glyphicon-star","icoColor":"red","UserID":69,"CreateTime":"2018-12-06","BeginTime":"2018-12-06","EndTime":"2018-12-06","IsFinish":false,"command":"","js":null,"attr":null},{"ID":1142,"ProjectID":80,"ParentID":1138,"Name":"新页面aa1","Url":null,"IsEnable":true,"OrderIndex":10,"Template":"web","IsPage":true,"bodyHtml":"<button class=\"t-btn\" id=\"t_1\" style=\"border-radius: 0px; left: 544px; top: 80.98px; width: 70px; height: 30px; text-align: left; letter-spacing: 0px; font-family: 宋体; font-size: 12px; z-index: 1; opacity: 1;\">按钮</button><button class=\"t-btn\" id=\"t_2\" style=\"border-radius: 0px; left: 297px; top: 57px; width: 431px; height: 313px; text-align: center; letter-spacing: 0px; font-family: 宋体; font-size: 12px; z-index: 1; opacity: 1;\">按钮</button><input class=\"t-input\" id=\"t_4\" style=\"border-radius: 0px; left: 57px; top: 153px; width: 140px; height: 35px; text-align: left; letter-spacing: 0px; font-family: 宋体; font-size: 12px; opacity: 1;\" type=\"text\" placeholder=\"aaaaa单行输入aaaaa\">","nodes":"[{\"id\":\"t_1\",\"data\":null,\"th\":null,\"td\":null,\"parent\":\"design\",\"tree\":null,\"table\":null,\"tab\":null,\"name\":\"按钮(按钮)\",\"code\":\"<button class='t-btn' style='text-align:center;width:70px;height:30px;background:#6392e4;z-index:1' id=\\\"t_1\\\">按钮</button>\",\"type\":\"button\",\"attrShow\":{\"inputType\":false,\"showAttr\":false,\"textType\":true,\"borderType\":true,\"d3Type\":true,\"selectType\":false,\"tableType\":false,\"extType\":false,\"treeType\":false,\"tabType\":false},\"attr\":{\"inputType\":\"text\",\"display\":true,\"opacity\":1,\"z_index\":10,\"rotate\":\"0\",\"scaleX\":null,\"scaleY\":null,\"skewX\":null,\"skewY\":null,\"rotateX\":null,\"rotateY\":null,\"rotateZ\":null,\"common\":\"\",\"border_radius\":0,\"font_size\":12,\"font_family\":\"宋体\",\"value\":\"按钮\",\"font_weight\":false,\"font_style\":false,\"line_through\":false,\"overline\":false,\"white_space\":false,\"letter_spacing\":0,\"text_align\":\"left\",\"type\":null,\"title\":null,\"color\":null,\"background\":null,\"code\":null,\"width\":\"70px\",\"height\":\"30px\",\"left\":\"544px\",\"top\":\"81px\",\"font-size\":\"12px\",\"font-family\":\"宋体\",\"border-width\":\"undefinedpx\",\"border-radius\":\"0px\",\"letter-spacing\":\"0px\",\"text-align\":\"left\"},\"api\":null,\"isNew\":false},{\"id\":\"t_2\",\"data\":null,\"th\":null,\"td\":null,\"parent\":\"design\",\"tree\":null,\"table\":null,\"tab\":null,\"name\":\"按钮(按钮)\",\"code\":\"<button class='t-btn' style='text-align:center;width:70px;height:30px;background:#6392e4;z-index:1' id=\\\"t_2\\\">按钮</button>\",\"type\":\"button\",\"attrShow\":{\"inputType\":false,\"showAttr\":false,\"textType\":true,\"borderType\":true,\"d3Type\":true,\"selectType\":false,\"tableType\":false,\"extType\":false,\"treeType\":false,\"tabType\":false},\"attr\":{\"inputType\":\"text\",\"display\":true,\"opacity\":1,\"z_index\":10,\"rotate\":\"0\",\"scaleX\":null,\"scaleY\":null,\"skewX\":null,\"skewY\":null,\"rotateX\":null,\"rotateY\":null,\"rotateZ\":null,\"common\":\"\",\"border_radius\":0,\"font_size\":12,\"font_family\":\"宋体\",\"value\":\"按钮\",\"font_weight\":false,\"font_style\":false,\"line_through\":false,\"overline\":false,\"white_space\":false,\"letter_spacing\":0,\"text_align\":\"center\",\"type\":null,\"title\":null,\"color\":null,\"background\":null,\"code\":null,\"width\":\"431px\",\"height\":\"313px\",\"left\":\"297px\",\"top\":\"57px\",\"font-size\":\"12px\",\"font-family\":\"宋体\",\"border-width\":\"undefinedpx\",\"border-radius\":\"0px\",\"letter-spacing\":\"0px\",\"text-align\":\"center\"},\"api\":null,\"isNew\":false},{\"id\":\"t_4\",\"data\":null,\"th\":null,\"td\":null,\"parent\":\"design\",\"tree\":null,\"table\":null,\"tab\":null,\"name\":\"单行输入框\",\"code\":\"<input type='text' class='t-input' placeholder='单行输入' style='width: 140px;height: 35px' id=\\\"t_4\\\">\",\"type\":\"input\",\"attrShow\":{\"inputType\":false,\"showAttr\":false,\"textType\":true,\"borderType\":true,\"d3Type\":true,\"selectType\":false,\"tableType\":false,\"extType\":false,\"treeType\":false,\"tabType\":false},\"attr\":{\"inputType\":\"text\",\"display\":true,\"opacity\":1,\"z_index\":10,\"rotate\":\"0\",\"scaleX\":null,\"scaleY\":null,\"skewX\":null,\"skewY\":null,\"rotateX\":null,\"rotateY\":null,\"rotateZ\":null,\"common\":\"\",\"border_radius\":0,\"font_size\":12,\"font_family\":\"宋体\",\"value\":\"aaaaa单行输入aaaaa\",\"font_weight\":false,\"font_style\":false,\"line_through\":false,\"overline\":false,\"white_space\":false,\"letter_spacing\":0,\"text_align\":\"left\",\"type\":null,\"title\":null,\"color\":null,\"background\":null,\"code\":null,\"width\":\"140px\",\"height\":\"35px\",\"left\":\"57px\",\"top\":\"153px\",\"font-size\":\"12px\",\"font-family\":\"宋体\",\"border-width\":\"undefinedpx\",\"border-radius\":\"0px\",\"letter-spacing\":\"0px\",\"text-align\":\"left\"},\"api\":null,\"isNew\":false}]","ico":"glyphicon-star","icoColor":"red","UserID":69,"CreateTime":"2018-12-24","BeginTime":"2018-12-24","EndTime":"2018-12-24","IsFinish":false,"command":"","js":null,"attr":null},{"ID":1168,"ProjectID":80,"ParentID":0,"Name":"新目录","Url":null,"IsEnable":true,"OrderIndex":10,"Template":"web","IsPage":false,"bodyHtml":null,"nodes":null,"ico":"glyphicon-star","icoColor":"red","UserID":69,"CreateTime":"2019-04-03","BeginTime":"2019-04-03","EndTime":"2019-04-03","IsFinish":false,"command":"","js":null,"attr":null},{"ID":1169,"ProjectID":80,"ParentID":1168,"Name":"新页面","Url":null,"IsEnable":true,"OrderIndex":10,"Template":"web","IsPage":true,"bodyHtml":null,"nodes":null,"ico":"glyphicon-star","icoColor":"red","UserID":69,"CreateTime":"2019-04-03","BeginTime":"2019-04-03","EndTime":"2019-04-03","IsFinish":false,"command":"","js":null,"attr":null}];

                        //从后台取出的节点node的isNew修改为true，以便创建一个vue对象 -- 赵长山 -- 2019-04-12
                        var reg=new RegExp("isNew\\\":false","g");
                        for(var i=0;i<datas.length;i++){
                            if(datas[i].nodes!=null)datas[i].nodes=datas[i].nodes.replace(reg,"isNew\":true");
                        }

                        row.attr=attr1;
                    }
                    if(fun!=null) eval(datas=fun(datas));  row.data=datas;
                }else row.data=[];
                if (row.attr == null) row.attr = { idKey: "id", pIdKey: "pId", name: "name", rootID: 0, rootName: "所有结点", drag: false };
                var data=row.data;var me=$("#"+row.el);setPage(row,me);
                if (row.noLoad != null && row.noLoad) return;
                
                if (row.attr.isRoot == null || row.attr.isRoot) {
                    var root = {};
                    root[row.attr.idKey] = 0; root[row.attr.pIdKey] = -1; root[row.attr.name] = row.attr.rootName;
                    if(typeof(data)!="string")
                        data.unshift(root);
                }
                if (data == null) data = [];
                row.data = data;
                ttyu.tree.loadData(me, data,row);
                setTreeHeight(row.el);
            }
            catch (e) {
                alert(e.message);
                return null;
            }
        },
        loadDatas: function (row) {
            $.fn.zTree.init(me, ttyu.tree.getSetting(row), row.source.data);
            var ztree = $.fn.zTree.getZTreeObj(row.id);
            var node = ztree.getNodes()[0]; // appTree.node; // ztree.getNodeByParam(appTree.attr.idKey, 0, null); //应该是首个结点appTree.data[0].id
            if (node != null && node.children != null) {
                var subNode = node.children[0];
                if (subNode.isParent)
                    node = subNode;
            }
            if (node != null && !node.isParent) node = node.getParentNode();
            ztree.expandNode(node, true, true, true);
        },
        loadData: function (me, nodes, row) {
            if (!treeDataLoadAfter(row.el, nodes, row)) return;
            try {
                var s = ttyu.tree.getSetting(row.attr);
                $.fn.zTree.init(me, s, nodes);
                row.ztree = $.fn.zTree.getZTreeObj(row.el);
                if (row.attr.expandNode != null) {
                    var node = row.ztree.getNodes()[row.attr.expandNode];
                    if(node!=null)
                        row.ztree.expandNode(node, true, true, true);
                }

                if (!treeInitAfter(me, row)) return;
                var node;
                if (row.attr.clickNode != null) {
                    node = row.ztree.getNodes()[row.attr.clickNode];
                    if(node==null)node= row.ztree.getNodes()[0].children[row.attr.clickNode];
                }else{
                    node = row.ztree.getNodes()[0];// node = ttyu.tree.getEndPageNode(node);
                    if(node==null) return;
                    node = setTreeNode(node, row.el, false);
//                    if (node.getParentNode() != null)
//                        row.ztree.expandNode(node.getParentNode(), true, true, true);
                    //else row.ztree.expandNode(node, true, true, true);
                }
                row.data = nodes; appTree = row; row.node = node;
                if (!treeNodeLoadAfter(me, row.ztree, row)) return;
                if( row.attr.clickNode==null)return;
                this.tree_click(row.el, node, false); row.ztree.selectNode(node);
            } catch (e) {
                alert(e);
            }
        },
        removes: function (id) {
            var nodes=findAll(appTree.data,appTree.attr.idKey,id);
            $.each(nodes, function (n, me) {
                ttyu.tree.remove(this[appTree.attr.idKey]);
            });
        },
        remove: function (id) {
            //if (appTree.me == null) return;
            var node = appTree.ztree.getNodeByParam(appTree.attr.idKey, id, null);
            if (node != null)
                appTree.ztree.removeNode(node);
        },
        update: function (nodes) {
            var pnode = appTree.node;if(pnode==null)return;
            var id = pnode[appTree.attr.idKey];
            if(appTree.ztree.getNodeByParam(appTree.attr.idKey, id, null)==null)
                pnode =appTree.ztree.getNodeByParam(appTree.attr.idKey, 0, null)
            $.each(nodes, function (n, me) {
                var id = me[appTree.attr.idKey]; var name = me[appTree.attr.name];
                var node =appTree.ztree.getNodeByParam(appTree.attr.idKey, id, null);
                if (node == null || id == "0") {
                    var newNode = {}; // { id: id, name: name, pId: pnode.id };
//                    newNode[appTree.attr.idKey] = me[appTree.attr.idKey]; //.ID;
//                    newNode[appTree.attr.name] = me[appTree.attr.name];
                    newNode=me;if(me.idd!=null)newNode.id=me.idd;//idd表示是新结点的id
                    appTree.ztree.addNodes(pnode, newNode);
                    appTree.data.push(me);//是否这时插入结点
                    var newId=(newNode.ParentID!=-1)?newNode.ParentID:newNode.id;//找到当前节点的父节点id  -- 赵长山 -- 2019-05-16
                    newNode =appTree.ztree.getNodeByParam('id',newId, null);//找到当前节点的父节点id  -- 赵长山 -- 2019-05-16
                    appTree.node = newNode; appTree.nodeId = newId; // appTree.ztree.selectNode(newNode);
                }
                else {
                    node[appTree.attr.name] = name; //node.name = name;
                    appTree.ztree.updateNode(node);
                }
            });
        },
        getSetting: function (attr) {
            if (attr.drag == null) attr.drag = false;
            if (attr.other == null) attr.other = null;
            if (attr.rootID == null) attr.rootID = 0;
            var setting = {
                edit: {
                    drag: {
                        prev: true, inner: true, next: true, isMove: true, isCopy: true
                    },
                    enable: attr.drag, showRemoveBtn: false, showRenameBtn: false
                },
                view: { dblClickExpand: true, showLine: true, selectedMulti: false },
                data: {
                    key: {
                        name: attr.name
                    },
                    simpleData: { enable: true, idKey: attr.idKey, pIdKey: attr.pIdKey, name: attr.name, other: attr.other, rootPId: attr.rootID }
                },
                check: { enable: attr.check },
                callback: {
                    onDrop: this.ztreeOnDrop,
                    onClick: function (e, treeId, treeNode) {
                        ttyu.tree.tree_click(treeId, treeNode, true);
                    }
                },
            };
            if (attr.pIdKey == "ID") { setting.view.showLine = false; setting.view.showIcon = false; }
            return setting;
        },
        ztreeOnDrop: function (event, treeId, treeNodes, targetNode, moveType) {
            var appTree=findOne(apps,'el',treeId);
            if (!dropBefore(treeNodes[0], targetNode,treeId)) return;
            if (targetNode == null) return;
            var fromID = treeNodes[0][appTree.attr.idKey];
            var toID = targetNode[appTree.attr.idKey];
            var paras = 'fromID=' + fromID + "&toID=" + toID + "&tableName=";
           // ttyu.sql.doAction('dragNode', paras);
        },
        tree_click: function (treeId, node, isLoad) {
            appTree=findOne(apps,'el',treeId);if(appTree==null||appTree.ztree==null) return;
            appTree.node=node; appTree.ztree.expandNode(node, true, true, true);
            if (treeId == 'treeSelect') {
                if (appTree.fields != null) {
                    $.each(appTree.fields, function (from, to) {
                         vm.row[this.value]=node.id; vm.row[this.name]=node.name;
                         var me = $(document).find('[id=' + this.name + ']');
//                        if (to != null && me.length != 0) {
                            me.val(node.name); // me.val(node[to.toUpperCase()]);
//                        }
                    });
                }
                if (!treeNodeClickBefore(node, treeId, isLoad)) return;
                $('#treeSelect').parents(".modal").hide();
                return;
            }
            if (node == null) return;
            var treeId = node.tId.getBefore("_"); //确定是哪棵树
            var row;
            if (row != null) {
                row.nodeId = node[row.attr.idKey]; row.node = node;
                appTree = row;
                if (appTree.ztree != null)
                    appTree.ztree.expandNode(node, true, true, true);
            }
            var treekeys = row;
            if (!treeNodeClickBefore(node, treeId, isLoad)) return;
            var level = node.level;
            var levels = $.grep(apps, function (row) {////同一数据源 是否存在
                var where=row.level==level&&row.page==appTree.page&&row.type!='tree';
                return where; //筛选
            });
            // var levels=ttyu.json.findAll(apps,'level='+level+"&& page="+appTree.page+"&&type!='tree'");
            var id=appTree.attr.idKey;var pId=appTree.attr.pIdKey;
            if ($(levels).length > 0) {
                $(levels).each(function () {//隐藏所有级别的元素
                    if (this.type =="form") {
                        var row = ttyu.json.find(appTree.data, id,node[id]);
                        this.vm.row=row;
                    }else{
                        if(this.tableField!=null){
                            this.vm.rows=ttyu.json.toJson(node[this.tableField]);
                        }else{
                            var subRows = ttyu.json.finds(appTree.data, pId, node[id]);
                            this.vm.rows=subRows;
                        }
                    }
                })
            }
            else {
                var dataSource=true;
                var rows=ttyu.json.finds(apps,'dataSource',"#"+treeId);
                if (rows.length ==0){ dataSource=false;
                    rows = $.grep(apps, function (row) {//是否存在
                        return row.itemKey !=null; //不为空的外键
                    });
                }
                if (rows.length > 0) {
                    $(rows).each(function () {
                        if (this.type =="form") {
                            var row = ttyu.json.find(appTree.data, id,node[id]);
                            this.vm.row=row;
                        }else{
                            if(this.tableField!=null){
                                this.vm.rows=ttyu.json.toJson(node[this.tableField]);
                            }else{
                                if(this.tableField!=null){
                                    this.vm.loadData(ttyu.json.toJson(node[this.tableField]));
                                    //this.vm.rows=ttyu.json.toJson(node[this.tableField]);
                                }else{
                                    var subRows = ttyu.json.finds(appTree.data, pId, node[id]);
                                    this.vm.loadData(subRows);
                                    //this.vm.rows=subRows;
                                }
                            }
                        }
                    })
                }
            }
            treeNodeClickAfter(node, treeId, isLoad);
            // clientTable();
        }
    };
    ttyu.tab = {
        init: function (row) { //初使化参数
            if (row.me == null || $.isEmptyObject(row.me)) row.me = { className: "tabs" };
            var me = ttyu.getObj(row.me.id, row.me.name, row.me.className);
            if (row.selectIndex == null) row.selectIndex = 0;
            if (row.type == null) row.type = "sibling";
            $(me).children().click(function () {//多选项卡页面 选择当前选项卡
                if (this.tagName != "FORM") {
                    $(this).addClass(row.selectClass).siblings().removeClass(row.selectClass);
                    var index = $(me).children().index(this);
                    if (row.type == "sibling") {
                        $(me).siblings().hide();
                        $($(me).siblings()[index]).show(500);
                    } else {//row.type == "sub"
                        $(me).find('form').hide();
                        $($(me).find('form')[index]).show(500);
                        $(this).find(":first").removeClass(row.selectClass);
                    }
                }
            });
            $($(me).children()[row.selectIndex]).click();
        },
        load: function (id,tab) { //初使化参数
            var me=$("#"+id);me.tabs();
            ttyu.tab.setType(me, tab.type); ttyu.tab.mouseover(me, tab.mouseover); ttyu.tab.sortable(me, tab.sortable);
        },
        setType: function (ui,type) { //初使化参数
            ui.find('.tabs-spacer').remove(); //
            switch (type) {
                case "底部标签页": ui.addClass('tabs-bottom');
                    // 修改 class
                    ui.find('ul').after('<div class="tabs-spacer"></div>'); //
                    $(".tabs-bottom .ui-tabs-nav, .tabs-bottom .ui-tabs-nav > *")
                        .removeClass("ui-corner-all ui-corner-top").addClass("ui-corner-bottom");
                    // 移动导航到底部
                    $(".tabs-bottom .ui-tabs-nav").appendTo(".tabs-bottom");
                    break;
                case "垂直标签页":
                    ui.tabs().addClass("ui-tabs-vertical ui-helper-clearfix");
                    ui.find('li').removeClass("ui-corner-top").addClass("ui-corner-left");
                    break;
                case "顶部标签页": ui.tabs().removeClass("tabs-bottom").removeClass("ui-tabs-vertical ui-helper-clearfix");
                    ui.find('li').removeClass("ui-corner-bottom").removeClass("ui-corner-left");
                    break;
            }
        },
        mouseover: function (ui,isYes) { //初使化参数
            if(!isYes) return;
            ui.tabs({event: "mouseover"});
        },
        sortable: function (ui,isYes) { //初使化参数
            if(!isYes) return;
            var tabs = ui.tabs();
            tabs.find(".ui-tabs-nav").sortable({
                axis: "x",
                stop: function () {
                    tabs.tabs("refresh");
                }
            });
        }
    };
    ttyu.server = {
        uuid: null, uploads: 'uploads',
        getUrl: function (paras) {//获取服务地址及参数串.如http://
            var serverUrl = getServerUrl();
            if (serverUrl == null) return;
            if (ttyu.isNull(paras)) return serverUrl;
            var url = serverUrl + "?" + paras;
            url = updateUrl(url);
            return url;
        },
        successData: function (url, dataJSON, dataType, func) {//成功获取数据后
            var value = dataJSON; //已经是对象
            
            if (!value.state||!value.error) {
                if (!successAfter(value.data, func)) return null;
                if (func != null) {
                    var funObj = eval(func); //转化成对象
                    funObj(value.data); //执行方法funName
                } else return value.data;
            }
            else {
                var errorInfo = value.errorInfo;
                alert(errorInfo);
                return false;
            }
        },  
        doApiText: function(dataJSON,func) {//跨域调用远程服务url,执行func           
            dataJSON.projectId =1;          
            dataJSON.userId = user.userID;dataJSON.compId =1;             
            dataJSON = JSON.stringify(dataJSON);
            $.ajax({
                type: 'GET',
                contentType: 'application/text',
                url: serverJson.url,
                data: { "datas": dataJSON },
                dataType: 'text',
                success: function (datas) {
                    if(typeof(datas)=="string")datas=ttyu.json.toJson(datas);
                    ttyu.server.successData("", datas, "text", func); 
                },
                error: function (req, status, err) {
                    alert(xmlHttpRequest.responseText + textStatus);
                }
            });           
        },     
        doApiNet: function(dataJSON,func) {//跨域调用远程服务url,执行func           
            dataJSON.projectId =1;          
            dataJSON.userId = user.userID;dataJSON.compId =1;             
            dataJSON = JSON.stringify(dataJSON);
            $.ajax({
                url: serverJson.url, type: "post", dataType: "jsonp",jsonp: "callback",async:false,
                data: { "datas": dataJSON },
                success: function (datas) {
                    if(typeof(datas)=="string")datas=ttyu.json.toJson(datas);
                    ttyu.server.successData("", datas, "text", func);                   
                },
                error: function (xmlHttpRequest, textStatus, errorThrown) {
                    alert(xmlHttpRequest.responseText + textStatus);
                }
            });
        },
         doApi: function (name,dataJSON, func) {//执行Action
            var url=getServerUrl()+"doPrj/?"+name;
            var para=dataJSON;
            if (para==null) para={};
            para.projectId =user.projectID;          
            para.userId = user.userID;
            //para.compId = user.compID;                
            $.ajax({
                url:url,data: { "data":  JSON.stringify(para)},
                type:"post", async:false,               
                success:function(data){
                    if (typeof (data) == "string") datas = eval('(' + data + ')');
                    aa = ttyu.server.successData(url, datas, "text", func);                   
                },
                error:function(data){
                    console.log(data);
                }
            });
        },
        doSysApi: function (name,dataJSON, func) {//执行Action
            var url=getServerUrl()+name;
            var para=dataJSON;//{sqls: sqls, value: value};
            if (para==null) para={};
            para.projectId =1;   
            var aa;
            $.ajax({
                url:url,data: { "data":  JSON.stringify(para)},
                type:"post", async:false,
                success:function(data){
                    if (typeof (data) == "string") datas = eval('(' + data + ')');
                    aa = ttyu.server.successData(url, datas, "text", func);
                    return aa;
                },
                error:function(data){
                    console.log(data);
                }
            });
        }
    };
    ttyu.date = {
        getNextMonth: function (yyyy, mm, day, format) {//求当前日期的下个月的自然月日期2018/03/31->2018/04/29
            var date = new Date(yyyy, mm, day);
            if (format == null) format = "/";
            //date.setMonth(date.getMonth() + (num * 1), 1);
            //读取日期自动会减一，所以要加一
            var mo = date.getMonth() + 1; //下月
            //小月
            if (mo == 4 || mo == 6 || mo == 9 || mo == 11) {
                if (day > 30) {
                    day = 30
                }
            }
            //2月
            else if (mo == 2) {
                if (isLeapYear(date.getFullYear())) {
                    if (day > 29) {
                        day = 29
                    } else {
                        day = 28
                    }
                }
                if (day > 28) {
                    day = 28
                }
            }
            //大月
            else {
                if (day > 31) {
                    day = 31
                }
            }
            retureValue = date.format('yyyy' + format + 'MM' + format + day);
            return retureValue; //2018/04/30
        },
        isLeapYear: function (year) {//判断是否闰年
            if (((Year % 4) == 0) && ((Year % 100) != 0) || ((Year % 400) == 0)) {
                return (true);
            } else { return (false); }
        },
        /// <summary>
        /// 格式化显示日期时间
        /// </summary>er
        /// <param name="x">待显示的日期时间，例如new Date()</param>
        /// <param name="y">需要显示的格式，例如yyyy-MM-dd hh:mm:ss</param>
        date2str: function (x, y) {
            var z = { M: x.getMonth() + 1, d: x.getDate(), h: x.getHours(), m: x.getMinutes(), s: x.getSeconds() };
            y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) { return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2) });
            return y.replace(/(y+)/g, function (v) { return x.getFullYear().toString().slice(-v.length) });
        },
        curentTime: function () {
            var now = new Date();
            var year = now.getFullYear();       //年
            var month = now.getMonth() + 1;     //月
            var day = now.getDate();            //日

            var hh = now.getHours();            //时
            var mm = now.getMinutes();          //分
            var ss = now.getSeconds();           //秒

            var clock = year + "-";
            if (month < 10)
                clock += "0";
            clock += month + "-";
            if (day < 10)
                clock += "0";
            clock += day + " ";
            if (hh < 10)
                clock += "0";
            clock += hh + ":";
            if (mm < 10) clock += '0';
            clock += mm + ":";
            if (ss < 10) clock += '0';
            clock += ss;
            return (clock);
        },
        getDateTime: function () { //获取日期时间 2010年12月23日 10:53;
            var date = new Date();
            var dateNum = date.getTime();
            return ttyu.date.getLocalTime(dateNum);
        },
        getDateWeek: function () {
            var date = getDateTime();
            var x = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
            var d = new Date();
            var s = date.getBefore(" ");
            s += " " + x[d.getDay()];
            return s;
        },
        timeDate: function () {
            var date = new Date();
            var dateNum = date.getTime();
            return dateNum;
        },
        timeStamp: function (dateStr) { //dateStr格式为“2014-05-08 00:22:11”
            var newstr = dateStr.replace(/-/g, '/');
            var date = new Date(newstr);
            var time_str = date.getTime().toString();
            time_str = time_str.substr(0, 10);
            return parseInt(time_str);
        },
        getLocalTime: function (strDate) { //时间戳转为 2010年12月23日 10:53  alert(getLocalTime(1293072805));
            strDate = strDate + '';
            var myDate = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                    function (a) {
                        return parseInt(a, 10) - 1;
                    }).match(/\d+/g) + ')');
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var day = myDate.getDate();
            var date = year + '年' + month + '月' + day + '日';

            var hours = myDate.getHours();
            var minutes = myDate.getMinutes();
            var second = myDate.getSeconds();
            var time = hours + ':' + minutes + ':' + second;
            return date + " " + time;
        },
        formatDate: function (strDate, split1, split2, type) {
            var t = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
                    function (a) {
                        return parseInt(a, 10) - 1;
                    }).match(/\d+/g) + ')');
            //alert(t);
            year = t.getFullYear();

            month = t.getMonth() + 1;
            dt = t.getDate();
            hour = t.getHours();
            minute = t.getMinutes();
            second = t.getSeconds();
            stamp = '';
            if (hour <= 3) {
                stamp = " 凌晨";
            } else if ((hour > 3) && (hour <= 7)) {
                stamp = " 清晨";
            } else if ((hour > 7) && (hour <= 11)) {
                stamp = " 上午";
            } else if ((hour > 11) && (hour <= 17)) {
                stamp = " 下午";
            } else if ((hour > 17) && (hour <= 24)) {
                stamp = " 晚上";
            }
            ((month < 10) ? (month = "0" + month) : (month)) && ((dt < 10) ? (dt = "0" + dt) : (dt)) && ((hour < 10) ? (hour = "0" + hour) : (hour)) && ((minute < 10) ? (minute = "0" + minute) : (minute)) && ((second < 10) ? (second = "0" + second) : (second));
            switch (true) {
                case (type === "all"):
                    return year + split1 + month + split1 + dt + stamp + hour + split2 + minute + split2 + second;
                    break;
                case (type === "day"):
                    return dt;
                    break;
                case (type === "hour"):
                    return hour;
                    break;
            }
        }
    };
    ttyu.json = {
        del: function (row, key) {//
            delete row[key];
        },
        setValue: function (datas, key, value) {//
            datas.forEach(function (row) {
                row[key]=value;
            });
        },
        isExist: function (datas, key, value) {//是否存在
            var item=findOne(datas, key, value);
            if(item==null) return false;
            return true;
        },
        find: function (datas, key, value) {//查找一个
            return findOne(datas, key, value);
        },
        finds: function (datas, key, value) {//查找多个
            return finds(datas, key, value);
        },
//        findAll: function (datas, where) {//查找多个
//            var i=0;//for(var k in where){a:1,b:2}
//            var nodes = $.grep(datas, function (row) {////同一数据源 是否存在
//                var a=row[a]=1&&row[b]=2;
//                return where; //筛选
//            });
//            return nodes;
//        },
        remove: function (datas, key, value) {//delete
            if(datas==null) return null;
            return remove(datas, key, value);
        },
//        remove: function (datas, index) {//delete
//            if(datas==null) return null;//
//            //var item=datas[index];//arr.splice($.inArray('c',arr),1);
//            datas.splice(index,1);
//            return datas;         
//        },
        clone: function (node) {//克隆
            return JSON.parse(JSON.stringify(node));
        },
        toString: function (node) {//对象转换成字符串
            return JSON.stringify(node);
        },
        toJson: function (nodeString) {//字符串转换成对象
            if (typeof (nodeString) == "object") return nodeString;
            var datas=[];
            if(nodeString!="")
                datas = eval('(' + nodeString + ')');
            return datas;//JSON.parse(nodeString);
        }
    };
    ttyu.user = {
        init: function () {//获取用户信息
            var result = this.getUser();
            if (result == null) return;
            user.userID = result.userID;
            user.userName = result.userName;
            user.headImage = result.HeadImage;
            user.isAdmin = result.isAdmin;
            //user.compID = result.compID;
            if(result.projectID==null)result.projectID=result.CurrProjectID;
            user.projectID = result.projectID;
            user.deptID = result.deptID;
            user.roleID = result.roleID;//user.projectName = result.projectName;
        },
        saveUser: function (result) {//保存用户
            //var projectName=this.getUser().projectName;
            //result.projectName=projectName;
			
            var value = JSON.stringify(result);//ttyu.set("projectId",result.CurrProjectID);  
			
            //ttyu.set("user_" + result.CurrProjectID, value);
            ttyu.set("user_", value);
            this.init();
        },
        getUser: function () {//得到用户
           // var projectId=localStorage.getItem("projectId");
           // var datas = localStorage.getItem("user_" +projectId);
     //       var datas = localStorage.getItem("user_");
			var datasStr="{\"userID\": \"1\",\"userName\": \"admin\",\"HeadImage\":\"dfsfs\",\"isAmin\": \"yes\",\"projectID\": \"1\",\"CurrProjectID\": \"2\",\"deptID\": \"1\",\"roleID\": \"1\"}";

            if (datasStr == null) return null;
            var datas = eval('(' + datasStr + ')');
            return datas;
        },
        getUserId: function () {//获取登录人的id
            var user = ttyu.user.getUser()
            if (user == null) return 0;
            var id = user.userID;
            if (id == null) id = -1; return id;
        },
        getCompId: function () { if (ttyu.user.getUser() == null) return null; return ttyu.user.getUser().compID; }, //获取登录人的公司id
        getProjectId: function () { if (ttyu.user.getUser() == null) return null; return ttyu.user.getUser().projectID; }, //获取登录人的当前项目id
        getUserName: function () { if (ttyu.user.getUser() == null) return null; return ttyu.user.getUser().userName; }, //获取登录人的姓名
        getUserImage: function () { if (ttyu.user.getUser() == null) return null; return ttyu.user.getUser().picName; } //获取登录人的照片
    };
    ttyu.file = {
        saveImage: function (isModifyName) {//追加文件
            if(isModifyName==null)isModifyName=true;
            var file = $('file');
            var row = findOne(apps, 'el', file.attr('id'));
//            var base64=$(row.me).find('.imageOne').css('background-image');
//            var base64 = base64.getBetween('url("', ")");
            var ttyuFiles =[];// [{ filed: row.el, fileName: row.value, isModifyName:isModifyName, fileData: base64}];
           // if(row.type=="images"){//多个文件
                $.each(file.find('.imageOne'), function (index, value) {
                    var name=$(this).attr('name');
                    if(name!=""){
                        var base64=$(this).css('background-image');
                        var base64 = base64.getBetween('url("', ")");
                        var json = { filed: row.el, fileName: name, isModifyName:isModifyName, fileData: base64};
                        if(base64.indexOf('http://')>=0)json.isModifyName=false;
                        ttyuFiles.push(json);
                    }
                });                
            //}
            vm.row.ttyuFiles = ttyuFiles;
        },
        addFile: function (row, fileName, noDel) {//追加文件
            var that = row.me;
            var div = "<div name='?name' class='imageOne' style='background-image:url(?url)'><div onclick='ttyu.file.close(this)' class='imageClose'>X</div><input type='file' onchange='ttyu.file.selectFileAfter(this)' accept='*'/></div>";
           
            var src = serverJson.serverUrl +'files/'+ fileName;
            if (fileName.trim() == "") div = div.replace("style='background-image:url(?url)'", '');
            div = div.replace('?url', src);
            var isMul = row.type == 'images' || row.type == 'files';
            if (!isMul) { //不是多文件去掉X
                div = div.replace("<div onclick='ttyu.file.close(this)' class='imageClose'>X</div>", '');
            }
            if (fileName == "" && !noDel) { //不是多文件去掉X
                div = div.replace("<div onclick='ttyu.file.close(this)' class='imageClose'>X</div>", '');
            }
            if (row.allowed != null) {//accept="image/gif, image/x-ms-bmp, image/bmp" application/msexcel  application/msword  application/pdf
                var accepts = ""; var type = "image/";
                if (row.type == "fileOne" || row.type == "files") type = "application/";
                $.each(row.allowed, function (index, value) {
                    accepts += type + value + ",";
                });
                div = div.replace("*", accepts.trimEnd(',')); div = div.replace("?name", fileName);
            }
            //that.html('');
            that.append($(div)); // $(div).attr('name', fileName);
            //var imageClose = $(div).find('.imageClose');
        },
        init: function (row) {
            row.me=$(row.el);row.el=row.el.replace("#","");
            var fileKey = { id:row.el, formData: null, row: row };
           // if(appForm==null) return;
            var value=row.value;//appForm.vm.row[fileKey.id];
            ttyu.file.loadFilesByValue(row.me,value,row);
        },
        loadFilesByValue: function (that, value,row) {//ssi
            try {
                var tag = that[0].tagName; that.html('');
                if (value != "") {
                    $.each(value.split(','), function (n, value) {
                        ttyu.file.addFile(row, value, tag);
                    });
                }
                var isMul = isMul = row.type == 'images' || row.type == 'files';
                if (isMul || value == "") { //多文件
                    ttyu.file.addFile(row, '', false);
                }
            } catch (e) { }
        },
        appendExcelForm: function (me, index) {//追加excel表单
            appendExcelFormBefore(me, index);
            var divFormFile = "<form enctype='multipart/form-data' method=post><input name='fileName' type='file' onchange='ttyu.file.selectFileAfter(this)' style='display:none;width:80px; ' accept='application/msexcel'/></form>";
            this.tableId = $(me).attr('tableId');

            $(divFormFile).appendTo(me);
            var options = {
                beforeSubmit: ttyu.file.beforeSubmit,  //提交前处理
                success: ttyu.file.successAfter,  //处理完成  //beforeSubmit: showRequest,  //提交前处理
                resetForm: true,
                tableId: this.tableId,
                dataType: 'json'
            };

            $(me).find('form').submit(function () {
                $(this).ajaxSubmit(options);
                return false;
            });
        },
        selectFileAfter: function (me) {
            //var a= $(me).parent().css('background-image');
            var that = $(me); //文件选择器
            if (window.FileReader) { //判断是否支持FileReader
                var reader = new FileReader();
            } else {
                alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！"); return;
            }

            var file = me.files[0]; //获取文件信息
            //                    var imageType = /^image\//;//
            //                    if (!imageType.test(file.type)) {//是否是图片
            //                        alert("请选择正确的图片！");return;
            //                    }

            var oSize = file.size / 1024 / 1024;
            var row =findOne(apps,'el',that.parent().parent().attr('id'));
            row.value=file.name;
            var tagName = that.parent().parent()[0].tagName;
            var divOne = that.parent(); //图片
            if (oSize > row.maxFileSize) {
                alert("文件不能大于" + row.maxFileSize + "M，请重新选择"); return;
            } else {
                //读取完成
                reader.onload = function (e) {
                    var imgData = e.target.result; //图片路径设置为读取的图片
                    divOne.css("background-image", 'url(' + imgData + ')');
                    if (tagName == "FILE") {
                        divOne.attr('name', file.name)
                    }
                };
                reader.readAsDataURL(file);
            }
            if (tagName == "FILE") {
                var n = divOne.attr("name");
                if (n == null || n == '' && row.type != 'imageOne' && row.type != 'fileOne') {
                    that.before("<div onclick='ttyu.file.close(this)' class='imageClose'>X</div>");
                    if(n == '')
                        row.name="";
                    ttyu.file.addFile(row, row.name, false);
                } //最后一个是加+
            }
        },
        close: function (that) {//
            that = $(that); var div = that.parent();div.remove();
        },
        loadBrowseFiles: function (fileListId, fileUrls) {//装载Browse文件系列
            ttyu.file.loadFiles(fileListId, fileUrls, 'browse');
            $('.imageItem .formImage').click(function () {//单击时显示文件
                var img = this.style.backgroundImage.getBetween("url(", ")");
                window.open(img);
            });
        },
        loadFilesByValue1: function (value) {//ssi
            if (value == null) return;
            var files = [];
            $.each(value.split(','), function (n, me) {
                var ext = me.getAfterLast('.').ltrim('.'); var filename = me.getBefore("__") + ext;
                var file = { filename: filename, ext: ext, filenameSave: me };
                files.push(file);
            });
            ttyu.file.loadFiles(files);
        },
        loadFiles: function (files) {//ssi
            $.each(files, function (n, me) {
                var filename = me.filename; var ext = me.ext; var src = ttyu.page.rootUrl + "/uploads/" + me.filenameSave;
                content = '<div class="document-item" href="test.mov" filetype="txt"><span class="fileCorner"></span></div>';
                switch (ext) {
                    case "txt": break;
                    default: content = '<img class="ssi-imgToUpload" src="' + src + '"/>'; break;
                }
                var index = n;
                var tableHtml = '<table class="ssi-imgToUploadTable ssi-pending">' +
                    '<tr v-for="(row, index)  in rows" :id="row.ID"><td class="ssi-upImgTd">' + content + '</td></tr>' +
                    '<tr v-for="(row, index)  in rows" :id="row.ID"><td><div id="ssi-uploadProgress' + index + '" class="ssi-hidden ssi-uploadProgress"></div></td></tr>' +
                    '<tr v-for="(row, index)  in rows" :id="row.ID"><td><button data-delete="' + index + '" class=" ssi-button error ssi-removeBtn"><span class="trash10 trash"></span></button></td></tr>' +
                    '<tr v-for="(row, index)  in rows" :id="row.ID"><td>' + filename + '</td></tr></table>'
                $("#ssi-previewBox").append(tableHtml);
            });
        }
    };
    ttyu.drag = {
        allowDrop: function (event) {
            event.preventDefault();
        },
        initDraggables: function (mes, dragstart, dragend, tag) {
            $(mes).each(function () {
                ttyu.drag.setDraggable(this, dragstart, dragend, tag);
            })
        },
        initDraggable: function (me, dragstart, dragend, tag) {
            me = getDomObject(me);
            if (me == null) return;
            me.draggable = true; //每个li都设置可拖拽属性
            me.ondragstart = function (e) {
                ttyu.drag.data = $(e.target); ttyu.drag.tag = tag;
                if (dragstart != null && dragstart != null) {
                    eval(dragstart(e)); //
                }
            }
            me.ondragend = function () {
                if (dragend != null && dragend != null) {
                    eval(dragend); //
                }
            }
        },
        initBox: function (me, dragEnd, dragenter, dragleave, dragover) {
            var box = getDomObject(me);
            if (box == null) return;
            box.ondragenter = function (e) {
                if (!ttyu.isNull(dragenter)) {
                    var funObj = eval(dragenter); //
                    funObj(e);
                }
            }
            box.ondragover = function (e) {
                e.preventDefault(); //阻止默认事件，否则不会触发ondrop事件
                if (!ttyu.isNull(dragover)) {
                    eval(dragover); //
                    //var funObj = eval(dragover); //转化成对象
                    //funObj(msg); //执行方法funName
                }
            }
            box.ondragleave = function (e) {
                if (!ttyu.isNull(dragleave)) {
                    var funObj = eval(dragleave); //
                    funObj(e);
                }
            }
            box.ondrop = function (e) {
                if (dragEnd != null) {
                    var funObj = eval(dragEnd(e)); //
                    funObj(e);
                }
            }
        }
    };
    ///////////////////////即时通讯 /////////////////////////
    ttyu.msg = {
        ws: null, //
        msg: null, //
        init: function (ip, getMsg) {//初使化
            //var ip = "ws://101.201.113.138:6001";
            if (ip.indexOf("ws://") < 0)
                ip = "ws://" + ip;
            ws = new WebSocket(ip);
            ws.onopen = function (e) {
                ws.send('{<' + ip + '>}');
            };
            ws.onmessage = function (e) {
                var msg = e.data;
                var funObj = eval(getMsg); //转化成对象
                funObj(msg); //执行方法funName
            };
            ws.onerror = function (e) {
                msg = e.data;
            };
            ws.onclose = function (e) {
            };
        },
        quit: function () {
            if (ws) {
                ws.close();
                ws = null;
            }
        },
        getMsg: function () {
            return msg;
        },
        send: function (value) {
            if (value == "" || value == null) {
                alert("消息内容不能为空"); return;
            }
            ws.send(value);
        }
    };
    ///////////////////////bootstrap模式窗口/////////////////////////
    ttyu.modal = {
        classType: "modal-cir",          
        openModal: function (row) {//
            var title = row.title
            if (title == "" || title == null) title = "选择内容";
            $('#myModal  .modal-title').text(title);
            var width = 300; var height = 400;
            if (!ttyu.isNull(row.width)) width = row.width;
            if (!ttyu.isNull(row.height)) height = row.height;
            $(".modal-dialog").width(width + 'px'); $(".modal-content").width(width + 'px');
            $(".modal-dialog").height(height + 'px'); $(".modal-content").height(height + 'px');
            if(row.type!=null){
            var divs = this.getRows(row.type, row.datas);
               $("#modalRows").html(divs);
            }
            $('#myModal').modal();
            $("." + this.classType).click(function () {
                var v = $(this).text();
                var nameObj = $('[name=' + row.name);
                if (nameObj[0].tagName == "INPUT")
                    nameObj.val(v);
                else nameObj.text(v);
                $('#myModal').modal('hide')
            })
        },
        close: function (me) {//
            $('#myModal').modal('hide');
        },
        hide: function (that) {//
            $(that).parents('.modal').hide()
        },
        getRows: function (type, values) {//得到行数据
            this.classType = 'modal-cir';
            switch (type) {
                case "cir": break; //圆形
                case "rect": this.classType = 'modal-rect'; break; //长方形
                case "square": this.classType = 'modal-square'; break; //正方形
            }
            var div = "<div class='col-lg-2 col-md-3 col-sm-3 col-xs-3'><h3 class='classType'>count</h3></div>";
            div = div.replace("classType", this.classType);

            var divs = "";
            $.each(values, function (n, me) {
                var div1 = div;
                div = div.replace("count", me);
                divs += div;
                div = div1;
            });
            return divs;
        }
    };                                                        //ttyu.modal end
    ttyu.validate = {
        tip: "",
        validate: function (name, objValue, errors,jsons,json,obj) {//名称，值，及错误信息是否有效
            if (errors == null) return true; //没有定义error
            var a = errors.split('|'); //多组
            var isYes = true, isContinue = true;           
            var title = errors.getBefore("?");         
            $.each(a, function (n, me) {
                if (me.indexOf("?") <= 0) me = title + "?" + me;
                if (me.indexOf("IsOnly") >= 0) {//唯一
                    isContinue = false; isYes = false;
                    var b = me.getAfter(":");
                    b = b.split(',');                    
                    if (json.id == 0) {
                       if (ttyu.json.isExist(jsons,name,objValue)) { alert("接口名称已经存在!"); $("#name").focus(); return; }
                    }
                    else {
                        var nodes = ttyu.json.finds(vue.apis,name,objValue);
                        if (nodes != null && nodes.length > 1) {
                             alert(title + "【" + objValue + "】已经存在！"); isYes = false;
                             if (obj.length == 1) $(obj).focus(); return false;
                        }
                    }                  
                }     
                if (me.indexOf("isCheckCode") >= 0) {//验证码错误
                    isContinue = false; isYes = false;
                    var a = ttyu.isCheckCode(objValue);
                    if (a == null) {
                        obj.focus(); isYes = false; return false;
                    }
                    else { isContinue = false; isYes = true; }
                }

                if (me.indexOf("checked") >= 0) {//
                    isContinue = false; isYes = false;
                    if (!obj[0].checked) {
                        alert(me.getBefore("?"));
                        isYes = false; return false;
                    }
                    else { isContinue = false; isYes = true; }
                }
                if (isContinue) {
                    var reg = ttyu.validate.getReg(me);
                    var reg = new RegExp(reg);

                    if (!reg.test(objValue)) {
                        var errorInfo = ttyu.validate.tip;
                        alert(errorInfo); //显示错误
                        isYes = false;
                        if (!$(obj).is('disabled'))
                            $(obj).focus();
                        return false;
                    }
                }
            });     
            return isYes;
        },
        validate1: function (obj) {
            var objValue = getObjValue(obj);
            return validate(obj.attr("name"), objValue, obj.attr("error"));
        },
//        validates: function (datas,that,idValue) {//只是一行验证  
//            if (!validateBefore(datas,that,idValue)) return false; //不继续执行
//            var isYes = true; this.idValue = idValue;
//            var p=that;if(p==null)p=$(appForm.el);
//            for(var item in datas){
//                var name = item; var value =datas[item]; var error =p.find('[name='+name+']').attr('error');// row.error; //
//                if (error!=null&&!ttyu.validate.validate(name, value, error)) {
//                    isYes = false; datas = null;
//                    return false;
//                }
//            }
//            return isYes;
//        },
        validates: function (jsons,json,that,idValue) {//只是一行验证  
            if (!validateBefore(jsons,json,that,idValue)) return false; //不继续执行
            var isYes = true; this.idValue = idValue;
            var p=that;if(p==null)p=$(appForm.el);
            var inputs=$(that).find('input');
            $(inputs).each(function () {
                var error =$(this).attr("error");
                if(error!="") {
                    var name ="";// $(this).attr("v-model").getAfter('.'); 
                    var value =$(this).val();
                    if (!ttyu.validate.validate(name, value, error,jsons,json,$(this))) {
                        isYes = false; datas = null;
                        return false;
                    }
              }
            })
            
            //
        //    $(that).find('input[error="checkbox"]:not(:disabled)');
//            var $('*[error="username"]')
//            p.find('error')//有错误属性的元素
//            for(var item in datas){
//                var name = item; var value =datas[item]; var error =p.find('[name='+name+']').attr('error');// row.error; //
//                if (error!=null&&!ttyu.validate.validate(name, value, error)) {
//                    isYes = false; datas = null;
//                    return false;
//                }
//            }
            return isYes;
        },
        getReg: function (error) {// reg="LenMax:100"
            var reg = "";
            var aa = error.split("?"); // error.split("|");确定密码?NoNull|NoEqual:PSD,密码
            var tip0 = aa[0];
            var funName = aa[1];
            if (funName.contains(":")) funName = funName.getBefore(":")
            switch (funName) {
                case "IsMail": //邮箱地址
                    reg = "^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$"
                    this.tip = "邮箱地址非法，正确的邮箱地址如:ttyu@ttyu.net"
                    break;
                case "IsChina":
                    reg = "^[\u4e00-\u9fa5]+$"; //
                    this.tip = "只允许中文字符"
                    break;
                case "IsTel":
                    reg = "^\\d{3}-\\d{8}$|^\\d{4}-\\d{7}$"
                    this.tip = "电话号码非法，正确的号码如:010-87888822"
                    break;
                case "NoEqual": //不等于
                    if (aa.length > 1) {
                        this.tip = aa[1].getAfter(",");
                        var a = aa[1].getBetween(":", ",");
                        var v = $("input[name='" + a + "']").val();
                        reg = "^" + v + "$";
                    }
                    break;
                case "NoCan":
                    if (aa.length > 1) {
                        this.tip = aa[1];
                        var a = tip.split(',')[0];
                        var b = tip.split(',')[1];
                        reg = "^(?!" + b + "$).+$";
                        this.tip = a + "不能为【" + b + "】";
                    }
                    break;
                case "NoNull":
                    if (tip0.indexOf("不能为空") < 0)
                        this.tip = tip0 + "不能为空";
                    reg = "[^0]";
                    break;
                case "IsMobile":
                    var reg = "^0{0,1}(13[0-9]|15[3-9]|15[0-2]|18[0-9])[0-9]{8}$";
                    this.tip = "手机号码为11位数字，如: 13146662511"
                    break;
                case "IsIDCard":
                    var reg = /^((13[0-9]{1})|159|153)+\d{8}$/; //var mobile1=/^(13+\d{9})|(159+\d{8})|(153+\d{8})$/;
                    this.tip = "身份证号码23位数字码，如: 433201197212261099 或 433201197212261099"
                    break;
                case "IsIP":
                    var reg = "^(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])$"
                    this.tip = "IP地址，如: 192.168.1.100"
                    break;
                case "IsInt":
                    var reg = "^(-){0,1}\\d+$"
                    this.tip = "请输入整型数字，如: 45 或 888"
                    break;
                case "IsNumber":
                    var reg = "^\\d+$";
                    this.tip = "请输入数字型数据，如: 111"
                    break;
                case "IsLengthStr":
                    var reg = "[^\x00-\xff]"
                    this.tip = "字符串的长度是不是在限定数之间 一个中文为两个字符，如: 13146662511 或 13946662511"
                    break;
                case "IsPostCode":
                    var reg = "^\\d{6}$"
                    this.tip = "邮政编码 6个数字，如: 100000 或 437100"
                    break;
                case "IsNormalChar":
                    var reg = "[\\w\\d_]+"
                    this.tip = "正常字符 字母，数字，下划线的组合，但不包括如【~ @ ! $ # % ...】等，如: liyu 或 13946662511"
                    break;
                case "IsQQ":
                    var reg = /^[1-9][0-9]{4,}$/;
                    this.tip = "非法的QQ号！正确的如:39062477 或 4500983"
                    break;
                case "IsAlpha": //^(?!\d).*?(?<!\d)$
                    var reg = "^[a-zA-Z]+$"
                    this.tip = tip0 + "只允许是字符"
                    break;
                case "IsAlphanumber": //^(?!\d).*?(?<!\d)$
                    var reg = "^[a-zA-Z0-9]+$"
                    this.tip = "只有字母或数字或_，如: 13146662511 或 13946662511"
                    break;
                case "IsAlphanumber0_":
                    var reg = "^[a-zA-Z0-9]+$"
                    this.tip = "只有字母或数字或_，如: 13146662511 或 13946662511"
                    break;
                //                case "IsOnly":
                //                    reg = "[^0]"
                //                    this.tip = "数据唯一，不能重复！"
                //                    break;
                case "LenMax":
                    var aa = aa[1].split(',');
                    var len = aa[0];
                    this.tip = "数据长度不能超过【" + len + "位】";
                    if (aa.length > 1)
                        this.tip = "【" + aa[1] + "】的" + tip;
                    var reg = "^\\w{0," + len + "}$"
                    break;
                case "LenMin":
                    var len = aa[1];
                    var reg = "^\\w{" + len + ",99999}$"
                    this.tip = "数据长度不能少于【" + len + "位】";
                    break;
                case "Len": //一定长度的字符或者数字数据如a12 ，不能是. \ 等特别字符,
                    var len = aa[1];
                    var reg = "^\\w{" + len + "}$"
                    this.tip = "数据长度只能是【" + len + "位】";
                    break;
                case "Number": //一定长度的数字类型
                    var len = aa[1];
                    var reg = "^\\d{" + len + "}$"
                    this.tip = "只能输入【" + len + "】位的数字类型.";
                    break;
                case "NumberBetween": //一定范围内的数字类型
                    aa = aa[1].split(',');
                    var lenFrom = aa[0];
                    var lenTo = aa[1];
                    var reg = "^\\d{" + lenFrom + "," + lenTo + "}$";
                    if (aa.length > 2)
                        this.tip = aa[2] + "只能是" + lenFrom + "到" + lenTo + "位的数字类型";
                    else
                        this.tip = "只能输入【" + lenFrom + "到" + lenTo + "位的数字类型";
                    break;
                default: //自写正则表达式
                    var reg = aa[0];
                    if (aa.length > 1)
                        this.tip = aa[1];
                    else
                        this.tip = "非法的数据.";
                    break;
            }
            return reg;
        }
    };   
    //ttyu.page.rootUrl = ttyu.getRootUrl(); ttyu.page.rootUrl = ttyu.page.rootUrl.replace('/sample', '');
}
//日期格式化 date.format('yyyy/MM/dd);
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    }
    if (/(y+)/.test(format))
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

////////////数组开始/////////////////////
Array.prototype.find = function (key,value) {
    return findOne(this,key,value);
}
Array.prototype.finds = function (key,value) {
    return ttyu.json.finds(this,key,value);
}
Array.prototype.del = function (key,value) {
    ttyu.json.remove(this,key,value);
}
////////////string 开始/////////////////////
String.prototype.isMatch = function (reg) {//是否匹配
    var reg = new RegExp(reg);
    return reg.test(this);
}

String.prototype.toJson = function () {
    nodeString=this;
    var datas=[];
    if(nodeString!="")
        datas = eval('(' + nodeString + ')');
    return datas;//JSON.parse(nodeString);
    // return ttyu.json.toJson(this);
}
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function () {
    var that = this;
    if (/^(rgb|RGB)/.test(that)) {
        var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
        var strHex = "#";
        for (var i = 0; i < aColor.length; i++) {
            var hex = Number(aColor[i]).toString(16);
            if (hex === "0") {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = that;
        }
        return strHex;
    } else if (reg.test(that)) {
        var aNum = that.replace(/#/, "").split("");
        if (aNum.length === 6) {
            return that;
        } else if (aNum.length === 3) {
            var numHex = "#";
            for (var i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return that;
    }
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function () {
    var sColor = this.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return "rgb(" + sColorChange.join(",") + ")";
    } else {
        return sColor;
    }
};
//function () {
//    var sColor = this.toLowerCase();
//    if (sColor && reg.test(sColor)) {
//        if (sColor.length === 4) {
//            var sColorNew = "#";
//            for (var i = 1; i < 4; i += 1) {
//                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
//            }
//            sColor = sColorNew;
//        }
//        //处理六位的颜色值
//        var sColorChange = [];
//        for (var i = 1; i < 7; i += 2) {
//            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
//        }
//        return "RGB(" + sColorChange.join(",") + ")";
//    } else {
//        return sColor;
//    }
//}
//ttyu.web.3.0.1.js中的函数  -- 赵长山 -- 2019-05-30
String.prototype.getUrlValue = function (key) {
    // if (isNull(this)) return "";
    url0 = this.getAfter("?");
    if (url0 == "")
        url0 = this;
    value = "";
    $.each(url0.split('&'), function (n, me) {
        var a = me.split('=');
        if (a[0].trim().toLowerCase() == key.trim().toLowerCase()) {
            value = a[1];
            return true;
        }
    });
    return value;
}
//字符串编码
String.prototype.HTMLEncode = function () {
    var s = ""; var str = this;
    if (str.length == 0) return "";
    s = str.replace(/&/g, "&amp;");
    s = s.replace(/</g, "&lt;");
    s = s.replace(/>/g, "&gt;");
    s = s.replace(/\'/g, "&#39;");
    s = s.replace(/\"/g, "###;");
    s = s.replace(/\r\n/g, "<br/>");
    s = s.replace(/\n/g, "<br/>");
    return s;
}
//字符串反编码
String.prototype.HTMLDecode = function () {
    var s = ""; var str = this;
    if (str.length == 0) return "";
    s = str.replace(/&amp;/g, "&");
    s = s.replace(/&lt;/g, "<");
    s = s.replace(/&gt;/g, ">");
    s = s.replace(/&nbsp;/g, " ");
    s = s.replace(/&#39;/g, "\'");
    s = s.replace(/###;/g, "\"");
    return s;
}

//是否包含
String.prototype.contains = function (subStr) {
    return this.indexOf(subStr) == -1 ? false : true;
}
String.prototype.isIn = function (subStr) {
    return this.contains(subStr);
}

//第一个指定字符串之前的部分
String.prototype.getBefore = function (subStr, isDeleteSpace) {
    index = this.indexOf(subStr);
    if (index < 0) return "";
    str0 = this.substr(0, index);
    if (isDeleteSpace)
        return this.DeleteEndSpaceRows().substr(0, index);
    else
        return str0;
}
//最后一个指定字符串之前的部分
String.prototype.getBeforeLast = function (subStr, isDeleteSpace) {
    index = this.lastIndexOf(subStr);
    if (index < 0) return this;
    str0 = this.substr(0, index);
    if (isDeleteSpace)
        return this.DeleteEndSpaceRows().substr(0, index);
    else
        return str0;
}
//第一个指定字符串之后的部分
String.prototype.getAfter = function (subStr, isDeleteSpace) {
    index = this.toLowerCase().indexOf(subStr.toLowerCase()); // this.indexOf(subStr);
    if (index < 0) return "";
    var str0 = this.substr(index + subStr.length);
    if (isDeleteSpace)
        return this.DeleteEndSpaceRows().substr(index + subStr.length);
    else
        return str0;
}

//最后一个指定字符串之后的部分
String.prototype.getAfterLast = function (subStr, isDeleteSpace) {
    index = this.lastIndexOf(subStr);
    if (index < 0) return this;
    str0 = this.substr(index + subStr.length);
    if (isDeleteSpace)
        return this.DeleteEndSpaceRows().substr(index + subStr.length);
    else
        return str0;
}

String.prototype.getBetween0 = function (StartText) {
    EndText = "</" + StartText + ">";
    StartText = "<" + StartText + ">";
    return this.getBetween(StartText, EndText);
}

String.prototype.getBetween = function (StartText, EndText) {
    try {
        newStr = this.getAfter(StartText);
        if (newStr == "") return "";
        newStr = newStr.getBefore(EndText);
        return newStr;
    }
    catch (e) {
        //        alert(e);
        return "";
    }
}

String.prototype.myFormat = function (strs) {
    try {
        var aa = strs.split(',');
        var newStr = this;
        var i = 0;
        for (i = 0; i < aa.length; i++) {
            var s = aa[i];
            newStr = newStr.myReplace("@" + String(i) + "@", s);
        }
        return newStr;
    }
    catch (e) {
        return e.message;
    }
}
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
String.prototype.myReplace = function (a1, a2) {
    return this.replace(new RegExp(a1, 'g'), a2);
}

String.prototype.startWith = function (str) {
    var reg = new RegExp("^" + str);
    return reg.test(this);
}
//正则表达式中需要转义的字符
String.prototype.getRegExpCh = function () {
    var chars = ",$,*,+,-,(,),{,},[,],|,";
    var ch1 = this;
    if (chars.indexOf(this) >= 0)
        ch1="\\"+this;
    return ch1;
}

//测试ok，直接使用str.endWith("abc")方式调用即可
String.prototype.endWith = function (str) {
    var reg = new RegExp(str + "$");//(
    return reg.test(this);
}
String.prototype.trimStart = function (ch) {
    var str = this.ltrim();
    if (this.indexOf(ch) == 0)
        str = str.getAfter(ch);
    else str = this;
    return str;
}
String.prototype.trimEnd = function (ch) {
    //var str = this.rtrim();
    if (this.getAfterLast(ch) != ch)
        return this;
    str = this.getBeforeLast(ch);
    return str;
}
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function (item) {
    if(item==undefined)
      item="";
    if(item=="")
       return this.replace(/(^\s*)/g, "");   
    var a=this.getAfter(item);
    if(a=="")a=this;
    return a;
}
String.prototype.rtrim = function (item) {
    if(item==undefined)
        item="";
    if(item=="")return this.replace(/(\s*$)/g, "");
    var len=this.length-item.length;
    return this.substring(0, len);
    //return this.replace(/(\s*$)/g, "");
}
//最后一个字符串前部分
String.prototype.getKey = function (key) {
    var a = this.getBetween(key + ":", ",");
    if (a == "")
        a = this.getAfter(key + ":");
    return a
}
String.prototype.toInt = function () {
    try {
        if (this.isNumber())
            return this;
        else
            return parseInt(this);
    } catch (e) {
        alert("toInt:" + this + ":" + e.message);
    }
}
String.prototype.isNumber = function () {
    try {
        return isNaN(this);
    } catch (e) {
        alert("isNumber:" + this + ":" + e.message);
    }
}
String.prototype.toFloat = function () {
    try {
        return parseFloat(this);
    } catch (e) {
        alert("toFloat:" + this + ":" + e.message);
    }
}
String.prototype.toBool = function () {
    try {
        return Boolean(this);
    } catch (e) {
        alert("toBool:" + this + ":" + e.message);
    }
}

function setAHref(aId, fileName) {
    var fileName = currRow[fileName];
    var url = ttyu.page.rootUrl + "/file/" + fileName;
    $("#" + aId).attr("href", url);
}
//////////////div////////////////////////////////////
function replaceKeys(me) {
    //var me = $("#" + divId);
    var row;
    if (me != null) {
        row = $(me).attr("row");
        if (row != null) {
            var id = ttyu.getUrlKeyValue("id");
            if ((typeof (id) == 'null') || id == "-1" || id == "0" || id == "")
                id = ttyu.user.getUserId();
            if (id != "")
                row = row.replace(/@id@/g, id);
            var name = ttyu.getUrlKeyValue("name");
            if (name != "")
                row = row.replace(/@name@/g, name);
            var pid = ttyu.getUrlKeyValue("pid");
            if (pid != "")
                row = row.replace(/@pid@/g, pid);
            $(me).attr("row", row);
        }
    }
    return row;
}
function setRowsData(me, rowDatas, beginID) {//把多行数据绑定到到容器里(多行数据)
    if (typeof (rowDatas) == "string" || me.length == 0) return;
    var me1 = me;
    $.each(rowDatas, function (n, row) {
        try {
            var meNew = $(me1).clone();
            meNew = setRowData(meNew, row);
            if (beginID != null) {
                var id = row["id"]; //hasOwnProperty  row.hasOwnProperty("id")
                if (row.hasOwnProperty("ID")) id = row["ID"];
                if (id == null) id == n;
                meNew.attr("id", id); //<tr id="3">           
                meNew.find("td:first").html(n + 1 + beginID); //加序号
            }
            me.after(meNew); me = meNew;
        }
        catch (e) {
            alert(e.message);
        }
    });
    $(me1).remove();
}

function setRowData(me, rowData) {//把数据行绑定表单(单行数据)
    try {
        if (me == null) return;
        setRowDataBefore(me, rowData);
        var uploads = ttyu.server.uploads + "/";
        for (var key in rowData) {
            var value = rowData[key];
            if (value == "null" || value == null) value = "";
            var o = $(me).find('[name=' + key + ']');
            if ($(me).attr("name") == key) o = me;
            if (o.length == 0)
                o = $(me).find('[src=' + key + ']'); //  $(me).find('input[name='+key+']')$(me).find('select');
            if (o.length > 0) {
                switch ($(o)[0].tagName) {
                    case "TD":
                        //if ($(o).text() == "")
                        $(o).text(value); break;
                    case "FILE": $(o).attr('value', value);
                        ttyu.file.loadFilesByValue($(o), value); break; // $(o).html(value); 
                        break; // 
                    case "DIV": //$(o).attr('value',value);
                        // ttyu.file.loadFilesByValue($(o), value);
                        $(o).html(value); break; // 
                    case "SPAN":
                    case "LABEL":
                        $(o).text(value); break; // $(o).removeAttr("name");
                    case "IMG":
                        var src = value;
                        if (!src.contains("http")) src = ttyu.page.rootUrl + "/uploads/" + src;
                        $(o).attr("src", src); break;
                    case "password":
                    case "hidden":
                    case "TEXTAREA":
                    case "INPUT":
                        if ($(o)[0].type == "file") {
                            ttyu.file.loadFilesByValue1(value);
                            if ($(o).attr('tag') == "show") {
                                $(".ssi-button").hide(); $("#ssi-DropZoneBack").hide();
                            }
                        } else {
                            $(o).val(value);
                            if (o.attr("type") == "checkbox") {
                                if (value == "0" || !value || value == "不") {
                                    o[0].checked = false; $(o).attr('checked', false);
                                    break;
                                }
                                if (value == "1" || value || value == "是")
                                { o[0].checked = true; $(o).attr('checked', true); }
                            }
                        }
                        break;
                    case "SELECT":
                        for (var i = 0; i < $(o)[0].length; i++) {
                            if ($(o)[0].options[i].value == value) {//$(o)[0].options[i].value $(o)[0].options[i].selected
                                $(o)[0].options[i].selected = true;
                                $(o).val(value);
                                if (key == "Province" && $("#City").length > 0)
                                    getCity($(o), "City"); //装载市

                                if (key == "City" && $("#Area").length > 0)
                                    getArea($(o), "Area"); //装载县
                            }
                        }
                        break;
                }
            }
            if ($(me).attr('name') == "@" + key + "@") {
                $(me).attr('name', value)
            }
            var innerHTML = $(me)[0].innerHTML;
            if (innerHTML.indexOf("@" + key + "@") >= 0) {//<!--item-->
                innerHTML = innerHTML.replace("@" + key + "@", value);
                $(me)[0].innerHTML = innerHTML; //  $(me)[0].innerHTML.replace("@" + key + "@", value);
            }
            if (innerHTML.indexOf("<!--" + key + "--") >= 0) {//<!--item-->
                innerHTML = innerHTML.replace("<!--" + key + "-->", value);
                $(me)[0].innerHTML = innerHTML; //  $(me)[0].innerHTML.replace("@" + key + "@", value);
            }
        }
        loadRowAfter(me, rowData);
        return me;
    }
    catch (e) {
        alert(e.message);
        return me;
    }
}
//获取控件值
function getObjValue(o) {
    if (o.length == 0) return null;
    var value;
    switch ($(o)[0].tagName) {
        case "TD":
        case "DIV":
        case "LABEL": value = $(o).text(); break;
        case "IMG": value = $(o).attr("src"); break;
        case "password":
        case "hidden":
        case "TEXTAREA":
        case "INPUT":
            value = $(o).val(); break;
            if (o.type == "checkbox")
                if (value == "1")
                    value = true;
        case "SELECT": value = $(o).val(); break;
        case "checkbox":
        case "radio": value = $(o)[0].checked; break;
    }
    return value;
};

//取容器内的各字段的值形成&分隔的键值系列字符串 如var field = {name:"UserName",value:"张家",error:"姓名?NoNull|IsMobile"} fields=[{name:"",value:"",error:""},{name:"",value:"",error:""}]
function getRowData(obj, isValidate) {
    if (obj == null || obj == null) return "";
    var paras = []; //paras = "";
    if (isValidate != null && !isValidate)
        paras = {};
    var inputs = $(obj).find("input,textarea,select,span,label,div,file")//[error]
    $.each(inputs, function (n, me) {
        var name = $(me).attr('name'); // me.name;
        if (name != null && name != "") {
            var value = $(me).val(); // me.value;
            if (me.tagName == "SPAN")
                value = $(me).text();
            if (me.tagName == "DIV")
                value = $(me).text();
            switch (me.type) {
                case "file": value = $(me).attr('value'); break;
                case "text":
                case "textarea":
                    break;
                case "radio":
                    if (me.checked)
                        value = me.value;
                    else value = "off";
                    break;
                case "checkbox":
                    value = me.checked;
                    break; //document.getElementById(me.id).checked $("#" + parendId).find(':checkbox').attr('checked', true);
            }
            var error = $(me).attr("error"); //escape($(me).attr("error"));
            if (error == null || error.trimEnd("?") == name) error = ""; //a?

            if (me.tagName == "FILE") {
                var v = []; var divs = $(me).find('div[class=imageOne]');
                $.each(divs, function (n, me) {
                    var d = $(me).css('background-image');
                    d = d.getAfter('url("').getBefore('"');
                    if (d.contains('uploads/')) d = d.getAfter('uploads/');
                    var n = $(me).attr('name'); //文件名
                    if (n != null && n != '') {
                        var f = { name: n, data: d };
                        v.push(f);
                    }
                })
                value = v; name = "file_" + name;
            }
            var para = { name: name, value: value, error: error };
            if (isValidate != null && !isValidate)
                paras[name] = value;
            else
                paras.push(para); // paras += para + "&";
        }
    });
    return paras;
}
function isDomObject(obj) {
    var isDOM = (typeof HTMLElement === 'object') ?
        function (obj) {
            return obj instanceof HTMLElement;
        } :
        function (obj) {
            return obj && typeof obj === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
        };
    return isDOM;
}
function isJqueryObject(obj) {
    return obj instanceof jQuery;
}
function getJqueryObject(obj) {
    obj = typeof obj == "string" ? $("#" + obj) : obj;
    if (isDomObject(obj)) {
        return $(obj);
    } else if (isJqueryObject(obj)) {
        return obj;
    }
    return null;
}
function getDomObject(obj) {
    var obj1 = typeof obj == "string" ? document.getElementById(obj) : obj;
    if (obj1 == null) {
        obj1 = $('.' + obj);
        if (obj1.length > 0) obj1 = obj1[0];
    }
    if (isJqueryObject(obj)) {
        return obj.get(0);
    }
    //    if (isDomObject(obj)) {
    //        return obj;
    //    }
    return obj1;
}
Function.prototype.getMultiline = function () {
    var lines = new String(this);
    lines = lines.substring(lines.indexOf("/*\r\n") + 4, lines.lastIndexOf("*/"));
    return lines;
}
function getInputWidth(pWidth, spanWidth, count, offset) {//各占百分比宽
    if (offset == null) offset = 0; //左右各留offset
    //var width = (pWidth - count * spanWidth - count * offset) / count;
    var gwidth = Math.round((pWidth - 2 * offset) / count); //组宽
    var iwidth = gwidth - spanWidth - offset; //input组宽
    var gwidth_ = Math.round((gwidth * 1000) / pWidth) / 10 + "%"; var iwidth_ = Math.floor(iwidth * 100 / gwidth) + "%"; //百分比 向下取整
    return { gwidth: gwidth, iwidth: iwidth, gwidth_: gwidth_, iwidth_: iwidth_ };
}
function getLeft(groupWidth, count, offset) {//
    if (offset == null) offset = 0;
    //var left = (count + 1) * 0 + groupWidth * count;
    //if (left == 0) left = offset;//第一个偏移
    var left = offset + groupWidth * count;
    return left;
}
function findOne(curr, item, selector) {
    if (curr == null || selector == null) return;
    var nodes = $.grep(curr, function (row) {//是否存在
        var value=row[item] == selector; //筛选
        if (typeof(value) == "undefined")
            return null;
        return row[item] == selector; //筛选
    });
    if (nodes.length > 0) {
        return nodes[0];
    }else return null;
}
function findNoNull(curr, item) {
    if (curr == null) return null;
    var nodes = $.grep(curr, function (row) {//是否存在
        return row[item] !=null; //筛选
    });
    if (nodes.length > 0) {
        return nodes[0];
    }
}
function finds(curr, item, selector) {
    var nodes = $.grep(curr, function (row) {//是否存在
        return row[item] == selector; //筛选 子呢
    });
    return nodes;
}
function findAll(curr, item, selector) {arrAll = [];
    var arr= finds(curr, item, selector);//找直接父
    $(arr).each(function () {
        arrAll.push(this);
        if(this.id!=null)
            findSubs(curr,this.id);
    })
    return arrAll;
}
function findSubs(curr,pId) {
    var arrSubs = finds(curr, 'parent', pId); //找子
    $(arrSubs).each(function () {
        arrAll.push(this);
        findSubs(curr, this.id);
    })
}
var arrAll = [];
function remove(curr, item, selector) {
    arrAll = [];
    removes(curr, item, selector);
}
function removes(arrList, key, value) {
    var arr = findAll(arrList, key, value); arr = arrAll;
    //var arr = finds(curr, item, selector);
    //remove(nodes, 'parent', id);
    for (var i = 0; i < arr.length; i++) {
        // curr.splice(i, 1);
        var item = arr[i];
        arrList.splice(jQuery.inArray(item, arrList), 1);
    }
}
function getControlType(text) {//从文字中提取控件类型
    var type = null; //姓名^ 30% text
    var chs = text.split(' ');
    $(chs).each(function () {
        var tag = this.trim(); if (tag.contains(':')) tag = tag.getBefore(':');
        switch (tag) {
            case "a": case "A": type = "a"; break;
            case "b": case "button": type = "button"; break;
            case "co": case "color": type = "color"; break;
            case "c": case "check": case "checkbox": type = "checkbox"; break;
            case "di": case "div": type = "div"; break;
            case "d": case "date": type = "date"; break;
            case "dt": case "datetime": type = "datetime"; break;
            case "e": case "mail": case "em": case "email": type = "email"; break;
            case "f": case "file": type = "file"; break;
            case "r": case "radio": type = "radio"; break;
            case "sp": case "span": type = "span"; break;
            case "sh": case "search": type = "search"; break;
            case "s": case "se": case "select": type = "select"; break;
            case "t": case "text": type = "text"; break;
            case "ta": case "textarea": type = "textarea"; break;
            case "ti": case "time": type = "time"; break;
            case "tel": type = "tel"; break;
            case "i": case "image": type = "image"; break;
            case "n": case "number": type = "number"; break;
            case "m": case "month": type = "month"; break;
            case "h": case "hidden": type = "hidden"; break;
            case "ra": case "range": type = "range"; break;
            case "open": type = "open"; break;
        }
        if (type != null) return type;
    })
    return type;
}
function getTitle(text, input) {//从文字表达式中提取文本
    if (input != null) text = text.replace(input, '');
    var cols = text.trim().split(' '); //
    //    var input1 = getControlType(cols[0]);//第一个是文字还是第二个是文字
    //    if (input1 == input) return cols[1];
    //    return cols[0];
    var title = '';
    for (var index in cols) {
        var title = cols[index];
        var input1 = getControlType(title);
        if (input1 == null) {
            return title;
        }
    }
    //    $(cols).each(function () {
    //        var title = getControlType(this);
    //        if (title==null) {
    //            title = this;
    //            return false;
    //        }
    //    })
    return title;
}

//function document.onkeydown() {
//    //backspace键需要屏蔽掉网页后退的功能
//    if (event.keyCode == 8) {
//        return false;
//    }
//}

function ParseCookie(cookies, name) {
    var field = new String;

    var fieldName = new String;
    var i = 0;
    var strCookies = new String;
    var strRep = new String;
    strCookies = cookies;
    while (true) {
        strRep = strCookies.replace(";", "&");
        if (strRep == strCookies) break;
        strCookies = strRep;
    }
    for (i = 0; ; i++) {
        field = GetField(strCookies, i, "&");
        if (field == "")
            return "";
        fieldName = GetField(field, 0, "=");
        fieldName = fieldName.replace(" ", "");
        if (fieldName == name)
            return GetField(field, 1, "=");
    }
    return "";
}

function getPara(name) {
    var gPrars = ParseCookie(document.cookie, "gPrars");
    if (gPrars == "") return ParseCookie(document.cookie, name);
    return decodeURI(gPrars.getKey(name));
}
function getCookie(name) {
    return ParseCookie(document.cookie, name);
}
function setCookie(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + (30 * 24 * 60 * 60 * 1000));
    document.cookie = name + "=" + encodeURI(value) + "; expires=" + exp.toGMTString();
    //document.cookie = name + "=" + escape(value) + "; expires=" + exp.toGMTString();
}
function setTempCookie(name, value) { document.cookie = name + "=" + encodeURI(value); }
function getBrowseType() {
    var a = navigator.userAgent.toLowerCase();
    if (a.indexOf("chrome") > 0) {
        $("#toolbarGrid").css("margin-top", "-25px");
        return "google";
    }
    var a = a.indexOf("msie");
    switch (a)//firefox|opera|safari|msie
    {
        case (-1):
            return "other";
        //alert("DOM浏览器");
        default:
            return "ie";
        // alert("IE浏览器");
    }
}
function is1024() {
    var browseType = getBrowseType();
    var is1024browse = false; //
    switch (browseType)//firefox|opera|safari|msie
    {
        case ("ie"):
            if (screen.width == 1024 && screen.height == 768)
                is1024browse = true;
            break;
        case ("google"):
            if (screen.width == 1024 && screen.height == 768)
                is1024browse = true;
            break;

        default:
            break;
    }
    return is1024browse;
}

//处理键盘事件
//禁止后退键（Backspace）密码或单行、多行文本框除外
function banBackSpace(e) {return true;
    var ev = e || window.event; //获取event对象
    var obj = ev.target || ev.srcElement; //获取事件源
    var t = obj.type || obj.getAttribute('type'); //获取事件源类型

    //获取作为判断条件的事件类型
    var vReadOnly = obj.readOnly;
    var vDisabled = obj.disabled;
    //处理null值情况
    vReadOnly = (vReadOnly == null) ? false : vReadOnly;

    vDisabled = (vDisabled == null) ? true : vDisabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的，
    //并且readOnly属性为true或disabled属性为true的，则退格键失效
    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea") && (vReadOnly == true || vDisabled == true);

    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea";

    //判断
    if (flag2 || flag1) return false;
}

//禁止退格键
// 作用于Firefox、Opera
//document.onkeypress=banBackSpace;
//禁止退格键
//作用于IE、Chrome
document.onkeydown = banBackSpace;
//我这里结合实际应用中遇到的问题做了修改
function doKey(e) {//处理键盘事件jiangkun
    var ev = e || window.event; //获取event对象
    var obj = ev.target || ev.srcElement; //获取事件源
    var t = obj.type || obj.getAttribute('type'); //获取事件源类型
    var condition = false;
    if (obj.getAttribute('readonly') == 'readonly' || obj.getAttribute('readonly') == true) {
        condition = (ev.keyCode == 8);
    }
    if (condition) {
        return false;
    }
}

window.onload = function () {
    try {
         $('button').on("click", function (e) {//alert(e)  
             buttonClick(e)
         });
         $('td span').on("click", function (e) {//alert(e)  
             tdClick(e)
         });
         $('td').on("click", function (e) {//alert(e)  
            tdClick(e)
         });
         $(".glyphicon-remove").on("click",function () {//动态添加的元素绑定事件glyphicon glyphicon-remove
            $(this).parents(".modal").hide(); 
         });
         if($('.modal-dialog').length>0)
           $('.modal-dialog').draggable();    
            $("file").on("dblclick", "div", function () {
                var url = $(this)[0].outerHTML.getBetween("url(", ")"); if (url == "") return;
                url = url.myReplace('"', '');
                window.open(url);
        });        
        
        $(".icon-sort").click(function () {return;
            var index = $(this).parent()[0].cellIndex;var i=0;var name;
            for(var item in appTable.vm.rows[0]){
                if(i==index){    //item 表示Json串中的属性，如'name'
                    name=item;
                }
            }
//            var td = appTable.item.children()[index];
//            var name = $(td).attr('name');
            var order = appTable.data.order;
            if (order == null) order = name;
            var desc = '';
            if (this.className != "icon-sort glyphicon glyphicon-triangle-bottom")
                desc = 'desc';
            data.order = name + " " + desc;           
            $(this).toggleClass("icon-sort-transform");
        });

    } catch (e) { }
}

function stopBubble(e) {
    var e = e ? e : window.event;
    if (window.event) { // IE
        e.cancelBubble = true;
    } else { // FF
        //e.preventDefault();
        e.stopPropagation();
    }return false;
}

function setPage(row,that) { //该组件所在的页
    var modal = that.parents(".modal");
    if (modal.length == 0) { modal = that.parents(".editPage");}
    if (modal.length ==1)
        row.page=modal;//父容器,.modal .editpage
    else row.page=0;//表示是根
}

// 方法二，通过数组排序，比较临近元素，可指出重复的元素
function isReData(ary,key){
    if(ary==null) return;
    var list=[];
    ary.forEach(function (me) {
        list.push(me[key]);
    });
    var nary = list.sort();
    for(var i = 0; i < nary.length - 1; i++)
    {
        if (nary[i] == nary[i+1])
        {
            return nary[i];
            // alert("重复内容：" + nary[i]);
        }
    }
}


function setTableHeight(tableDiv,top) {
    table = $(tableDiv);
    if(table.length==0)return;
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    var top =top;
    if(top==null)
       top = table.offset().top; 
    table.height(clientHeight - top-10);      
}
function setTreeHeight(div1,top) {
    div = $(div1);
    if(div.length==0)div=$("#"+div1);
    if(div.length==0) return;
    if(div.parents(".t-body").length==0)return;
    var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
    var top =top;
    if(top==null)
       top = div.offset().top; 
    div.height(clientHeight - top-10);      
}

function setTableWidth(tableDiv,left) {
    table = $(tableDiv);
    var clientWidth = document.documentElement.clientWidth || document.body.clientWidth;
    var left =left;
   
    if(left==null)
       left = table.offset().left; 
    if((left+"").indexOf('%')>0){
       left=left.replace("%","");left=parseInt(left);
       left=clientWidth*left/100;
    }
    table.width(clientWidth - left-10);      
}

//function show(e,index) {//编辑事件 
//    var modals = $('.modal');
//    var isModal = true;
//    if (modals.length == 0) {
//        modals = $('.editPage'); isModal = false;
//    }
//    if (isModal) $(modals[index]).show();
//    else {
//        $(modals[index]).show().siblings().hide(); // $(".t-body").hide();
//    }   
//    return false;
//}
function tdClick(e) {//
    var el = e.currentTarget;
    switch (el.innerText.trim()) {
        case "编辑": vm.show(e); break;
        case "详情": show(e,0); break;
        case "审核": show(e,1); break;
    }
} 
function buttonClick(e) {//
    var el = e.currentTarget;
    switch (el.innerText.trim()) {
        case "查询": vm.find(); break;
        case "重置":
            var node = $(e.currentTarget).parents('.t-find');
            if (node.length == 0) node = $(e.currentTarget).parents('.modal-body');
            ttyu.clear(node); break;        
        case "关闭":
            var node = $(e.currentTarget).parents('.modal');
            node.hide(); break;
        case "返回":
            var node = $(e.currentTarget).parents('.editPage');
            if(node.length==1){node.hide();$('.t-body').show();}
            else {node = $(e.currentTarget).parents('.modal');node.hide();}
            break;        
    }
}
function loadApp() {
    var divs = $('.noApp');
    $.each(divs, function () {
        var id = this.id;
        var me = $(this);
        var name = $(this).attr("name"); 
        switch (name) {
            case "树":
                var treeId = id;
                ttyu.tree.showLine(treeId, node.tree.showLine);
                ttyu.tree.showIco(treeId, node.tree.showIco);
                ttyu.tree.nodeIcon(treeId, node.tree.nodeIcon);
                ttyu.tree.setType(treeId, node.tree.nodeType); break;
            case "左菜单树": setTreeDataLeft(id); break;
            case "OutLook树": setTreeDataOutLook(id); break;
            case "Metro树": setTreeDataMetro(id); break;
            case "Awesome树": setTreeDataAwesome(id); break;
            case "百度地图": baidumap(id); break;
            case "腾讯地图": sosomap(id); break;
            case "高德地图": scottmap(id); break;
            case "谷歌地图": googleMap(id); break;
            case "天地图": tianditu(id); break;
            case "散点图": loadChart(id); break;
            case "区域图": loadChart1(id);break;
            case "雷达图": loadChart2(id);break;
            case "折线图": loadChart3(id);break;
            case "饼状图": loadChart4(id);break;
            case "柱状图": loadChart5(id); break;
            case "日历": $("#" + id).eCalendar(); break; // http://www.jq22.com/jquery-info541
            case "网格选择": ui.find('li').attr('style', 'margin: 3px; padding: 1px; float: left; width: 100px; height: 80px; font-size: 4em; text-align:center');
                ui.find('.网格选择').load({ type: 'list', data: [{ item: 1 }, { item: 2 }, { item: 3 }, { item: 4 }, { item: 5 }, { item: 6 }, { item: 7 }, { item: 8 }, { item: 9 }, { item: 10 }, { item: 11}] }); break;
            case "列表选择": ui.find('li').attr('style', 'margin: 3px; padding: 0.4em; font-size: 1.4em;');
                ui.find('.t-list').load({ type: 'list', data: [{ item: 'Item 1' }, { item: 'Item 2' }, { item: 'Item 3' }, { item: 'Item 4' }, { item: 'Item 5' }, { item: 'Item 6'}] });
                break;
//            case "标签页": me.tabs();
//                ttyu.tab.setType(me, tab.type); ttyu.tab.mouseover(me, tab.mouseover); ttyu.tab.sortable(me, tab.sortable);
//                break; //http://www.jqueryui.org.cn/demo/5726.html
            // case "滑块": $("#" + id).slider(); break;              
            case "进度条": ui.progressbar({ value: 37 }); break; //http://www.jqueryui.org.cn/demo/5700.html       
            //case "菜单": ui.menu(); ui.find('ul').show(); break;  //http://www.jqueryui.org.cn/demo/5698.html                     
            case "selectButton": ui.button(); break;
            case "selectRadio": case "selectButtons": ui.buttonset(); break;
            case "selectButtons": $(ui).button(); break; //http://www.jqueryui.org.cn/demo/5672.html
            case "多复选框按钮": $(ui).buttonset(); break; //http://www.jqueryui.org.cn/demo/5672.html
            // case "selectButton": $(ui).buttonset(); break; //http://www.jqueryui.org.cn/demo/5672.html              
            case "自动完成": $(ui).autocomplete({ source: ["ActionScript", "AppleScript", "Asp"] }); break;  //http://www.jqueryui.org.cn/demo/5669.html
            case "折叠面板": $(ui).accordion(); break;
        };
    });
}

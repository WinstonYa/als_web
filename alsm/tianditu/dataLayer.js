const syncSpan = 3000;
var lastTimePos = '';

const cusClrs = [
    '#fff200',
    '#ff0000',
    '#ff5c33',
    '#100606',
    '#44ff00',
    '#33ffff',
    '#3396ff',
    '#3a33ff'
]

let mapDataLayer = new Map();
let mapDataSublayer = new Map();
let mapDataFeature = new Map();
let mapStyle = new Map();

let mapSearchResult = new Map();

// 常住人口，
mapDataLayer.set('czrk', {
    codes: ['B072000']
})
// 暂住人口，
mapDataLayer.set('zzrk', {
    codes: ['B072002']
})
// 堡垒户，
mapDataLayer.set('blhdata', {
    codes: ['B072001']
})
// 公共场所，旅游场所、商业网点、工业园区
mapDataLayer.set('ggcs', {
    codes: ['B030300', 'B030500', 'B077004', 'B060402']
})
// 交通场所，飞机场、火车站、加油站
mapDataLayer.set('jtcs', {
    codes: ['B030200', 'B030203', 'B030202', 'B040501']
})
// 公安系统，边境管理大队、边境派出所、警务室|||边境检查站及临时查缉点|||边防检查站
mapDataLayer.set('gaxt', {
    codes: ['B070500', 'B070501', 'B070505', 'B060300', 'B060200']
})
// 党政军，驻军单位、行政单位/党政机关
mapDataLayer.set('dzj', {
    codes: ['B070800', 'B070100', 'B070200', 'B070300',
        'B070901', 'B070902', 'B070903', 'B070904', 'B070905']
})
// 企事业，企事业单位
mapDataLayer.set('qsy', {
    codes: ['B077000']
})
// 特种行业，旅店|||废品金属回收
mapDataLayer.set('tzhy', {
    codes: ['B077002', 'B077003']
})
// 涉危涉爆，|||大型厂矿企业、工业园区、电厂
mapDataLayer.set('swsb', {
    codes: ['B077001']
})
// 银行金融，
mapDataLayer.set('yhjr', {
    codes: ['B071200', 'B071203']
})
// 医院学校，学校、医院、文物
mapDataLayer.set('yyxx', {
    codes: ['B050800', 'B050801', 'B071101', 'B060403']
})
// |||出租房屋，
mapDataLayer.set('czfw', {
    codes: ['B077005']
})
// 电厂,火力，风力
mapDataLayer.set('dldc', {
    codes: ['B060404', 'B060405']
})

let posTooltip
let posTooltipElement
let contextPosTooltip
let contextPosTooltipElement

let hoverIntePos
let contextIntePos
let hoverTrack

var clickIntePos

let overlay = null;
let container;
let popupCloser;
let content;

function initPosData() {
    container = document.getElementById("popw");
    popupCloser = document.getElementById("img1");
    content = document.getElementById("mainframeshow");
    overlay = new ol.Overlay({
        //设置弹出框的容器
        element: container,
        //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true,
        autoPanMargin: 30
    });
    popupCloser.onclick = function () {
        overlay.setPosition(undefined);
        clickIntePos.getFeatures().clear();
    };
    gMap.getMap().addOverlay(overlay);
    let allLyrs = []
    let mileLyrs = []
    let clrIdx = 0
    mapDataLayer.forEach(function (value, key) {
        let lyrs = []
        for (let i = 0; i < value.codes.length; i++) {
            let code = value.codes[i]
            let icon = top.params.serviceIp + '/file/posIcon/' + code + '.gif'
            let layer = null;
            let styleFunc = function (feature, resolution) {
                console.log(feature)
                console.log(resolution)
                let textStyle = null;
                if(resolution < 0.0016941105498561343) {
                    textStyle = new ol.style.Text({
                        font: '14px serif',
                        text: feature.cusData.name,
                        fill: new ol.style.Fill({
                            color: "#3b43e1"
                        }),
                        stroke: new ol.style.Stroke({
                            color: "#94edfd",
                            width: 3
                        }),
                        // offsetX: feature.xoffset,
                        offsetY: 25
                    });
                }
                return new ol.style.Style({
                    image: new ol.style.Icon({
                        src: icon,
                        // anchor: [0.5, 0.96],
                        // scale: 1 / Math.pow(resolution, 1 / 3),
                        crossOrigin: 'anonymous'
                    }),
                    text: textStyle
                });
            }
            layer = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: styleFunc
            })

            if (code === 'B072001') {
                top.lyrPatroData = layer;
            }
            // if (clrIdx === cusClrs.length) {
            //     clrIdx = 0
            // }
            lyrs.push(layer)
            allLyrs.push(layer)
            mapDataSublayer.set(code, layer)
            mapStyle.set(layer, styleFunc)
        }
        value.layer = new ol.layer.Group({
            layers: lyrs
        })
        value.layer.setVisible(false);
        gMap.getMap().addLayer(value.layer)
    })

    posTooltipElement = document.createElement('div');
    posTooltipElement.className = 'ol-popup';
    posTooltipElement.style.width = '280px';
    posTooltipElement.style.height = '105px';
    posTooltipElement.innerHTML = '';
    posTooltip = new ol.Overlay({
        element: posTooltipElement,
        // offset: [0, -48],
        offset: [0, -12],
        stopEvent: false,
    });
    gMap.getMap().addOverlay(posTooltip);
    contextPosTooltipElement = document.createElement('div');
    contextPosTooltipElement.className = 'ol-popup';
    contextPosTooltipElement.style.width = '95px';
    contextPosTooltipElement.style.height = '60px';
    contextPosTooltipElement.innerHTML = '';
    contextPosTooltip = new ol.Overlay({
        element: contextPosTooltipElement,
        offset: [0, 40],
    });
    gMap.getMap().addOverlay(contextPosTooltip);

    top.initData();
    allLyrs.push(top.lyrPatro);
    allLyrs.push(top.lyrPolice);
    mileLyrs.push(top.lyrTrail);

    //悬浮事件 ol.interaction.Select
    hoverIntePos = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers: allLyrs,
        style: null
    });
    hoverIntePos.on('select', hoverPosHandler);
    gMap.getMap().addInteraction(hoverIntePos);

    hoverTrack = new ol.interaction.Select({
        condition: ol.events.condition.pointerMove,
        layers: mileLyrs,
        style: null
    })
    hoverTrack.on('select', hoverTrackMileage);
    gMap.getMap().addInteraction(hoverTrack);

    contextIntePos = new ol.interaction.Select({
        condition: function (evt) {
            // console.log(evt);
            if (evt.originalEvent.button === 2) {
                return true;
            }
        },
        layers: allLyrs,
        style: null
    });
    contextIntePos.on('select', contextPosHandler);
    gMap.getMap().addInteraction(contextIntePos);

    clickIntePos = new ol.interaction.Select({
        condition: ol.events.condition.click,
        layers: allLyrs,
        style: null
    });
    clickIntePos.on('select', clickPosHandler);
    gMap.getMap().addInteraction(clickIntePos);

    mapDataSublayer.set('B072001', top.lyrPatroData);
    refreshPosData()
}

var isRefresh = false;
var needRefresh = false;
var lastRes = null;

function refreshPosData() {
    top.doApi(function (res) {
            // console.log(res)
            if (isRefresh) {
                needRefresh = true;
            }
            refreshPosDataRes(res);
        },
        null, null, top.params.serviceIp + '/PointPositionInfo/getByAfterSyncTime', 'get', {syncTime: lastTimePos}, undefined, false
    )
}

function refreshPosDataRes(res) {
    if (res.status === 200) {
        for (let i = 0; i < res.data.length; i++) {
            let pos = res.data[i]
            if (lastTimePos == null || lastTimePos < pos.syncTime) {
                lastTimePos = pos.syncTime;
            }
            let cusIcon = pos.typeCode
            if (pos.icon != null && pos.icon != '') {
                cusIcon = pos.icon
            }
            let fea = null;
            if (!mapDataFeature.has(pos.id)) {
                if (pos.isHide === 1) {
                    fea = new ol.Feature({
                        geometry: new ol.geom.Point([pos.longitude, pos.latitude])
                    });
                    fea.cusData = pos
                    mapDataFeature.set(pos.id, fea)
                    if (mapDataSublayer.has(cusIcon)) {
                        mapDataSublayer.get(cusIcon).getSource().addFeature(fea);
                        fea.cusIcon = cusIcon;
                    }
                }
            } else {
                fea = mapDataFeature.get(pos.id);
                if (mapDataSublayer.has(fea.cusIcon) && (pos.isHide === 0 || fea.cusIcon !== cusIcon)) {
                    mapDataSublayer.get(fea.cusIcon).getSource().removeFeature(fea);
                    if (pos.isHide === 1 && mapDataSublayer.has(cusIcon)) {
                        fea.getGeometry().setCoordinates([pos.longitude, pos.latitude])
                        mapDataSublayer.get(cusIcon).getSource().addFeature(fea);
                        fea.cusIcon = cusIcon;
                        continue;
                    }
                    mapDataFeature.delete(pos.id);
                    continue;
                }
                if (pos.longitude !== fea.cusData.longitude || pos.latitude !== fea.cusData.latitude) {
                    fea.getGeometry().setCoordinates([pos.longitude, pos.latitude])
                }
                fea.cusData = pos
            }
        }
    }
}


//鼠标悬停信息弹框
function hoverPosHandler(e) {
    contextIntePos.getFeatures().clear();
    contextPosTooltip.setPosition();
    posTooltip.getElement().style.height = '105px';
    let feaCount = e.target.getFeatures().getLength()
    if (feaCount === 0) {
        posTooltip.setPosition();
    } else {
        // console.log('选中要素：' + feaCount + '个')
        var feat = e.target.getFeatures().item(0);
        var coordinate = feat.getGeometry().getCoordinates();

        var strHtml =
            '<table  class="table" frame="void">\n';
        var count = 0;
        if (feat.cusData.typeName) {
            count++;
            strHtml +=
                '   <tr>\n' +
                '       <td>类型：' + feat.cusData.typeName + '</td>\n' +
                '   </tr>\n';
        }
        if (feat.cusData.name) {
            count++;
            strHtml +=
                '   <tr>\n' +
                '       <td>名称：' + feat.cusData.name + '</td>\n' +
                '   </tr>\n';
        }
        if (count === 1 && feat.cusData.phone) {
            strHtml +=
                '   <tr>\n' +
                '       <td>手机号：' + feat.cusData.phone + '</td>\n' +
                '   </tr>\n';
        }
        strHtml +=
            '   <tr>\n' +
            '       <td></td>\n' +
            '   </tr>\n' +
            '</table>'

        posTooltipElement.innerHTML = strHtml;
        posTooltip.setPosition(coordinate)
    }
}


//鼠标悬停轨迹信息弹框
function hoverTrackMileage(e) {
    contextIntePos.getFeatures().clear();
    contextPosTooltip.setPosition();
    posTooltip.getElement().style.height = '100px';
    let trackMileage = Math.round(top.trackMileage);
    let durationTime = Math.round(top.durationTime);
    let trackHours = Math.floor(durationTime / 60);
    let trackMin = durationTime % 60;
    let feaCount = e.target.getFeatures().getLength();
    if (feaCount === 0) {
        posTooltip.setPosition();
        // gMap.getMap().un('pointermove', pointerMoveHand);
    } else {
        // gMap.getMap().on('pointermove', pointerMoveHand);
        var strHtml =
            '<table  class="table" frame="void">\n';

        strHtml +=
            '   <tr>\n' +
            '       <td>路程时间：' + trackHours + '小时' + trackMin + '分钟' + '</td>\n' +
            '   </tr>\n' +
            '   <tr>\n' +
            '       <td>轨迹长度：' + trackMileage + "米" + '</td>\n' +
            '   </tr>\n' +
            '</table>'

        posTooltipElement.innerHTML = strHtml;
        posTooltip.setPosition(top.trackArray);
    }
}

//删除点位数据方法
function deletePos(id) {
    contextPosTooltip.setPosition();
    var feat = mapDataFeature.get(id);
    var pos = feat.cusData;
    var msg = "您确定要删除“" + pos.name + "”的点位数据吗？删除后不能恢复，请谨慎选择。";
    if (confirm(msg) == true) {
        top.doApi(
            function (res) {
                if (res.status === 200) {
                    if (mapDataFeature.has(pos.id)) {
                        let cusIcon = pos.typeCode
                        if (pos.icon != null && pos.icon != '') {
                            cusIcon = pos.icon
                        }
                        if (mapDataSublayer.has(cusIcon)) {
                            mapDataSublayer.get(cusIcon).getSource().removeFeature(feat);
                        }
                    }
                } else {
                    top.showMessage("点位信息删除失败！", 0);
                }
            }, null, null, top.params.serviceIp + '/PointPositionInfo/' + pos.id,
            "delete"
        )

        return true;  //你也可以在这里做其他的操作
    } else {
        return false;
    }
}

function contextPosHandler(e) {
    let feaCount = e.target.getFeatures().getLength()
    if (feaCount === 0) {
        contextPosTooltip.setPosition();
    } else {
        // console.log('选中要素：' + feaCount + '个')
        var feat = e.target.getFeatures().item(0);
        var coordinate = feat.getGeometry().getCoordinates();
        // console.log(feat.cusData)

        if (feat.cusData.typeName) {
            var strHtml =
                '<button onclick="deletePos(' + feat.cusData.id + ')">'
                + '<img style="width:30px" src="../../images/tools/删除.png">删除</button>\n'
            // + '<button onclick="">'
            // + '<img style="width:30px" src="../../images/tools/视域分析.png">隐藏</button>\n'
            // + '<button onclick="">'
            // + '<img style="width:30px" src="../../images/tools/视点.png">重新定位</button>\n'
            contextPosTooltipElement.innerHTML = strHtml;
            contextPosTooltip.setPosition(coordinate);
            posTooltip.setPosition();
        }
    }
}


//点击弹出信息框事件
function clickPosHandler(e) {
    let feaCount = e.target.getFeatures().getLength()
    if (feaCount === 0) {
        top.closeDataTableFrame();
        overlay.setPosition(undefined);
        clickIntePos.getFeatures().clear();
    } else {
        var feat = e.target.getFeatures().item(0);
        var coorStr = feat.cusData.longitude + ', ' + feat.cusData.latitude;
        if (feat.cusData.formName === '人口管理_常住人口信息') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/populationManager.html?' + id + '&1';
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '人口管理_暂住人口登记') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/TempPopulation.html?' + id;
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '企事业单位_基本情况') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/companyManager.html?' + id + '&1';
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '商业网点_商业网点登记') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/CommercialPoint.html?' + id + '&1';
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '其它场所') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/generalData.html?' + id;
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '特种行业_特种行业登记') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/SpecialIndustry.html?' + id + '&3';
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '涉爆单位_基本情况') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/BoomCompanyManager.html?' + id + '&1';
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '出租房屋_出租房屋治安管理审批') {
            var id = feat.cusData.formId;
            var srcHtml = 'html/view/RentalHousing.html?' + id + '&1';
            top.showDataTableFrame(srcHtml, coorStr);
        } else if (feat.cusData.formName === '堡垒户') {
            var id = feat.cusData.formId;
            top.doApi(
                function (res) {
                    if (res.status === 200) {
                        var html = '';
                        if (res.data.name == null) {
                            res.data.name = ' ';
                        }
                        if (res.data.phone == null) {
                            res.data.phone = ' ';
                        }
                        if (res.data.dptName == null) {
                            res.data.dptName = ' ';
                        }
                        if (res.data.identitynumber == null) {
                            res.data.identitynumber = ' ';
                        }
                        if (res.data.sex == null) {
                            res.data.sex = ' ';
                        }
                        if (res.data.age == null) {
                            res.data.age = ' ';
                        }
                        if (res.data.address == null) {
                            res.data.address = ' ';
                        }
                        if (res.data.protectionArea == null) {
                            res.data.protectionArea = ' ';
                        }
                        if (res.data.address == null) {
                            res.data.address = ' ';
                        }
                        var coodinate = feat.getGeometry().getCoordinates();
                        res.data.longitude = coodinate[0];
                        res.data.latitude = coodinate[1];


                        html = "<table  class=\"table table-hover\" frame=\"void\">\n" +
                            "                            <tr>\n" +
                            "                                <td>姓名：" + res.data.name + "</td>\n" +
                            "                                <td>手机号：" + res.data.phone + "</td>\n" +
                            "                            </tr>\n" +
                            "                            <tr>\n" +
                            "<td>所属部门：" + res.data.dptName + "</td>" +
                            "                                <td>身份证号码:" + res.data.identitynumber + "</td>\n" +
                            "                            </tr>\n" +
                            "<tr>" +
                            "<td>性别：" + res.data.sex + "</td>" +
                            "<td>年龄：" + res.data.age + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>家庭住址：" + res.data.address + "</td>" +
                            "<td>管护面积：" + res.data.protectionArea + "</td>" +
                            "</tr>" +

                            "<tr >" +
                            "<td colspan=\"2\" > 坐标：" + res.data.longitude + "  ,  " + res.data.latitude + "</td>" +
                            "</tr>";
                        html += "</table>";

                        content.innerHTML = html;

                        //设置overlay的显示位置
                        overlay.setPosition(coodinate);
                    }
                }, null, null,
                top.params.serviceIp + '/FortressInfo/' + id,
                'get'
            )
        } else if (feat.cusData.formName === '部门') {
            var id = feat.cusData.formId;
            top.doApi(
                function (res) {
                    if (res.status === 200) {
                        var html = '';
                        if (res.data.name == null) {
                            res.data.name = ' ';
                        }
                        if (res.data.phone == null) {
                            res.data.phone = ' ';
                        }
                        if (res.data.type == null) {
                            res.data.type = ' ';
                        }
                        if (res.data.principal == null) {
                            res.data.principal = ' ';
                        }
                        if (res.data.address == null) {
                            res.data.address = ' ';
                        }
                        if (res.data.postcode == null) {
                            res.data.postcode = ' ';
                        }
                        var coodinate = feat.getGeometry().getCoordinates();
                        res.data.longitude = coodinate[0];
                        res.data.latitude = coodinate[1];


                        html = "<table  class=\"table table-hover\" frame=\"void\">\n" +
                            "                            <tr>\n" +
                            "                                <td>名称：" + res.data.name + "</td>\n" +
                            "                            </tr>\n" +
                            "<tr>" +
                            "                                <td>负责人:" + res.data.principal + "</td>\n" +
                            "</tr>" +
                            "                            <tr>\n" +
                            "                                <td>联系方式：" + res.data.phone + "</td>\n" +
                            "                            </tr>\n" +
                            "<tr>" +
                            "<td>邮编：" + res.data.postcode + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td>地址：" + res.data.address + "</td>" +
                            "</tr>" +
                            "<tr >" +
                            "<td colspan=\"2\" > 坐标：" + res.data.longitude + "  ,  " + res.data.latitude + "</td>" +
                            "</tr>";
                        html += "</table>";

                        content.innerHTML = html;

                        //设置overlay的显示位置
                        overlay.setPosition(coodinate);
                    }
                }, null, null,
                top.params.serviceIp + '/DepartmentInfo/' + id,
                'get'
            )
        }
    }
}

function setLayersStyle(type, style) {
    let lyrs = mapDataLayer.get(type).layer.getLayers();
    let rlyrs = [];
    lyrs.forEach(function (lyr) {
        if (style) {
            lyr.setStyle(style);
        } else {
            let styleFunc = mapStyle.get(lyr)
            lyr.setStyle(styleFunc);
        }
    })
    return rlyrs;
}

function getFeatures(type) {
    let lyrs = mapDataLayer.get(type).layer.getLayers();
    let feas = [];
    lyrs.forEach(function (lyr) {
        feas.concat(lyr.getSource().getFeatures());
    })
    return feas;
}

function flash(type, count) {
    var lyr = getPosLayer(type);
    if (!lyr.getVisible()) {
        return;
    }
    if (!count || count < 0) {
        return;
    }
    let flashStyle = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: cusClrs[1]
            })
        })
    });
    setLayersStyle(type, flashStyle)
    setTimeout(function () {
        setLayersStyle(type)
        if (!lyr.getVisible()) {
            return;
        }
        setTimeout(function () {
            flash(type, --count);
        }, 500)
    }, 400)
}

function setPosVisible(type, isVis) {
    var lyr = getPosLayer(type);
    if (lyr) {
        lyr.setVisible(isVis);
        if (isVis === true) {
            setTimeout(function () {
                flash(type, 3);
            }, 500)
        }
    }
}

function getPosLayer(type) {
    if (mapDataLayer.has(type)) {
        return mapDataLayer.get(type).layer;
    }
    return null;
}

function getHtmlStr(name, num) {
    return '\n' +
        '                    <tr class="el-table__row" style="height: 5px;">\n' +
        '                        <td rowspan="1" colspan="1" class="el-table_1_column_1 is-center " style="padding: 5px 0px;">\n' +
        '                            <div class="cell">\n' +
        '                                ' + name + '\n' +
        '                            </div>\n' +
        '                        </td>\n' +
        '                        <td rowspan="1" colspan="1" class="el-table_1_column_2 is-center " style="padding: 5px 0px;">\n' +
        '                            <div class="cell">\n' +
        '                                ' + num + '\n' +
        '                            </div>\n' +
        '                        </td>\n' +
        '                    </tr>\n' +
        '                    ';
}

function handleSearch(pnts) {
    if (pnts.length === 1 && pnts[0].length > 3) {
        pnts = pnts[0];
        var xmin, ymin, xmax, ymax;
        xmin = xmax = pnts[0][0];
        ymin = ymax = pnts[0][1];
        if (pnts[2][0] > xmax) {
            xmax = pnts[2][0];
        }
        if (pnts[2][0] < xmin) {
            xmin = pnts[2][0];
        }
        if (pnts[2][1] > ymax) {
            ymax = pnts[2][1];
        }
        if (pnts[2][1] < ymin) {
            ymin = pnts[2][1];
        }
        top.doApi(function (res) {
                console.log(res);
                mapSearchResult.clear();
                var dataArr = undefined;
                var name = undefined;
                var strHtml = '';
                for (var i = 0; i < res.data.length; i++) {
                    var data = res.data[i];
                    if (name !== data.typeName) {
                        if (name) {
                            strHtml += getHtmlStr(name, dataArr.length);
                        }
                        dataArr = [];
                        mapSearchResult.set(data.typeName, dataArr);
                        name = data.typeName;
                    }
                    dataArr.push(data);
                    if (i === res.data.length - 1) {
                        strHtml += getHtmlStr(name, dataArr.length);
                    }
                }
                setSearchContent(strHtml);
                showSearchPanel();
            }, null, null, top.params.serviceIp + '/PointPositionInfo/getListByPosition', 'get', {
                longitudeStart: xmin,
                longitudeEnd: xmax,
                latitudeStart: ymin,
                latitudeEnd: ymax
            }, undefined, false
        )
    }
}

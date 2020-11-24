const strOn = '在线';
const strOff = '离线';
const strDone = '已完成';
const strDoing = '进行中';
var syncSpan = 40000;
const animateDuration = 3000;

var isInit = true;

var trackMileage = 0;
var durationTime = 0;
var trackArray;

var syncTrail = false;
var onceTrail = false;
var trailId = null;
var traceType = null;
var trailIdx = null;
var userId = null;

var overlay = null;
var container = document.getElementById("popw");
var popupCloser = document.getElementById("img1");
var content = document.getElementById("mainframeshow");

var lyrTrail = null;
var srcTrail = null;
var feaTrail = null;
var stlTrailAuto = null;
var stlTrailOnce = null;
var isTrailPan = false;

var syncPatro = false;
var lastTimePatro = '';
var dptIdsPatro = null;

var selectIntePatro = null;
var onStyle = null;
var offStyle = null;
var lyrPatro = null;
var lyrPatroData = null;
var srcPatro = null;
var feaPatroMap = new Map();
var objPatroMap = new Map();

var syncPolice = false;
var lastTimePolice = '';
var dptIdsPolice = null;

var selectIntePolice = null;
var mjonStyle = null;
var mjoffStyle = null;
var lyrPolice = null;
var srcPolice = null;
var feaPoliceMap = new Map();
var objPoliceMap = new Map();

function initData() {
    overlay = new ol.Overlay({
        //设置弹出框的容器
        element: container,
        //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
        autoPan: true,
        autoPanMargin: 30
    });
    popupCloser.onclick = function () {
        overlay.setPosition(undefined);
        selectIntePatro.getFeatures().clear();
        selectIntePolice.getFeatures().clear();
    };
    gMap.getMap().addOverlay(overlay);
    srcTrail = new ol.source.Vector();
    lyrTrail = new ol.layer.Vector({
        source: srcTrail
    });
    stlTrailAuto = [
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 3
            }),
            zIndex: 10
        }), new ol.style.Style({
            image: new ol.style.Icon({
                src: './images/qd.png',
                anchor: [0.5, 0.96],
                crossOrigin: 'anonymous'
            }),
            geometry: function (feature) {
                // return the coordinates of the first ring of the polygon
                var coordinates = feature.getGeometry().getCoordinates();
                if (coordinates.length > 0) {
                    return new ol.geom.Point(coordinates[0]);
                }
            },
            zIndex: 10
        })
    ];
    stlTrailOnce = stlTrailAuto.concat([
        new ol.style.Style({
            image: new ol.style.Icon({
                src: './images/zd.png',
                anchor: [0.5, 0.96],
                crossOrigin: 'anonymous'
            }),
            geometry: function (feature) {
                // return the coordinates of the first ring of the polygon
                var coordinates = feature.getGeometry().getCoordinates();
                if (coordinates.length > 0) {
                    return new ol.geom.Point(coordinates[coordinates.length - 1]);
                }
            },
            zIndex: 10
        })
        // , new ol.style.Style({
        //     image: new ol.style.Icon({
        //         src: './images/zd.png',
        //         anchor: [0.5, 0.96],
        //         crossOrigin: 'anonymous'
        //     }),
        //     geometry: function (feature) {
        //         // return the coordinates of the first ring of the polygon
        //         var coordinates = feature.getGeometry().getCoordinates();
        //         if (coordinates.length > 0) {
        //             return new ol.geom.MultiPoint(coordinates);
        //         }
        //     },
        //     zIndex: 10
        // })
    ]);
    gMap.getMap().addLayer(lyrTrail);
    lyrTrail.setVisible(false);
    feaTrail = new ol.Feature({
        geometry: new ol.geom.LineString([])
    });
    srcTrail.addFeature(feaTrail);

    onStyle = new ol.style.Style({image: new ol.style.Icon({src: './images/online.png'}), zIndex: 10});
    offStyle = new ol.style.Style({image: new ol.style.Icon({src: './images/offline.png'}), zIndex: 10});
    srcPatro = new ol.source.Vector();
    lyrPatro = new ol.layer.Vector({
        source: srcPatro
    });
    let selLyr = [lyrPatro];
    if (lyrPatroData) {
        selLyr.push(lyrPatroData);
    }
    selectIntePatro = new ol.interaction.Select({
        layers: selLyr,
        style: null
    });
    gMap.getMap().addLayer(lyrPatro);
    selectIntePatro.on('select', selectPatrolHandler);

    mjonStyle = new ol.style.Style({image: new ol.style.Icon({src: './images/mjonline.png'}), zIndex: 10});
    mjoffStyle = new ol.style.Style({image: new ol.style.Icon({src: './images/mjoffline.png'}), zIndex: 10});
    srcPolice = new ol.source.Vector();
    lyrPolice = new ol.layer.Vector({
        source: srcPolice
    });
    selectIntePolice = new ol.interaction.Select({
        layers: [lyrPolice],
        style: null
    });
    gMap.getMap().addLayer(lyrPolice);
    selectIntePolice.on('select', selectPolicelHandler);

    isInit = false;
}

// function handleTrail(timePnts) {
//     for(let i=0; i<timePnts.length; i++) {
//         timePnts
//     }
// }

//轨迹记录点字符串转化为对象集合
function gpsDataStringToList(val) {
    var timeCoordinateList = [];
    if (val != null) {
        var tps = val.split(";");
        for (var j = 0, len = tps.length; j < len; j++) {
            var tmp = tps[j].split(",");
            if (tmp.length == 3) {
                timeCoordinateList.push({datetime: tmp[0], longitude: parseFloat(tmp[1]), latitude: parseFloat(tmp[2])})
            }
        }
    }
    return timeCoordinateList;
}

//显示轨迹
function showTrace(val, bOnceTrail, bIsTrailPan, needPlayBack) {
    if (bOnceTrail == undefined) {
        bOnceTrail = true;
    }
    if (bIsTrailPan == undefined) {
        bIsTrailPan = false;
    }
    if (needPlayBack == undefined) {
        needPlayBack = true;
    }

    //显示图层
    lyrTrail.setVisible(true);
    var trace = [];
    var pts = val;
    if (!(pts instanceof Array)) {
        pts = gpsDataStringToList(val);
    }
    // console.info(pts);
    var coords = [];
    for (var i = 0; i < pts.length; i++) {
        var ps = pts[i];
        if (ps) {
            coords.push([ps.longitude, ps.latitude]);
            if (needPlayBack) {
                var s = "";
                if (ps.datetime != null && ps.datetime != "") {
                    s = ps.datetime.replace(/-/g, "/");
                }
                trace.push({time: new Date(s).getTime(), pt: [ps.longitude, ps.latitude]})
            }
        }
    }
    if (needPlayBack) {

        $("#map2dv")[0].contentWindow.initTracePlayback(trace, traceType === 'blh' ? onStyle : mjonStyle);
        $("#map2dv")[0].contentWindow.tracePanel();
    }

    if (coords.length !== 0) {
        feaTrail.getGeometry().setCoordinates(coords);
        if (bOnceTrail) {
            feaTrail.setStyle(stlTrailOnce);
        } else {
            feaTrail.setStyle(stlTrailAuto);
        }
        if (!bIsTrailPan) {
            isTrailPan = true;
            map2dMoveTo(feaTrail, function () {
                // $("#map2dv")[0].contentWindow.startTrace()
            });
            overlay.setPosition()
            selectIntePatro.getFeatures().clear();
            selectIntePolice.getFeatures().clear();
        }
    }
}

function displayTrail(curTrailId, comFunc) {
    doApiByJsonstr(
        function (res) {
            if (res.status === 200 && syncTrail) {
                if (onceTrail) {
                    syncTrail = false;
                }
                var trace = []
                var pts = res.data.timeCoordinates;
                showTrace(pts, onceTrail, isTrailPan);
                //   console.info(pts);
            }
        }, null, comFunc,
        params.serviceIp + '/TrackRecordInfo/' + curTrailId, 'get'
    )
}

function refreshTrail() {
    displayTrail(trailId,
        function (XMLHttpRequest, textStatus) {
            if (syncTrail) {
                setTimeout(refreshTrail, syncSpan);
            }
        })
}

function selectPatrolHandler(e) {
    trailIdx = null;
    if (e.target.getFeatures().getLength() == 0) {
        userId = null;
        overlay.setPosition(undefined);
    } else {
        var feat = e.target.getFeatures().item(0);
        userId = feat.cusData.userId;
        if (feat.cusData.typeCode) {
            userId = null;
            overlay.setPosition(undefined);
            return;
        }
        doApi(
            function (res) {
                if (res.status === 200) {
                    var disable = false;
                    if (feat.cusData.status === strOff) {
                        disable = true;
                    }
                    var html = '';
                    var coodinate = feat.getGeometry().getCoordinates();

                    //       console.log(feat.cusData.name);
                    if (feat.cusData.name == null) {
                        feat.cusData.name = ' ';
                    }
                    if (feat.cusData.phone == null) {
                        feat.cusData.phone = ' ';
                    }
                    if (feat.cusData.dptName == null) {
                        feat.cusData.dptName = ' ';
                    }
                    if (feat.cusData.identitynumber == null) {
                        feat.cusData.identitynumber = ' ';
                    }
                    if (feat.cusData.sex == null) {
                        feat.cusData.sex = ' ';
                    }
                    if (feat.cusData.age == null) {
                        feat.cusData.age = ' ';
                    }
                    if (feat.cusData.address == null) {
                        feat.cusData.address = ' ';
                    }
                    if (feat.cusData.protectionArea == null) {
                        feat.cusData.protectionArea = ' ';
                    }
                    if (feat.cusData.address == null) {
                        feat.cusData.address = ' ';
                    }
                    if (feat.cusData.longitude == null) {
                        feat.cusData.longitude = ' ';
                    }
                    if (feat.cusData.latitude == null) {
                        feat.cusData.latitude = ' ';
                    }


                    html = "<table  class=\"table table-hover\" frame=\"void\">\n" +
                        "                            <tr>\n" +
                        "                                <td>姓名：" + feat.cusData.name + "</td>\n" +
                        "                                <td>手机号：" + feat.cusData.phone + "</td>\n" +
                        "                            </tr>\n" +
                        "                            <tr>\n" +
                        "<td>所属部门：" + feat.cusData.dptName + "</td>" +
                        "                                <td>身份证号码:" + feat.cusData.identitynumber + "</td>\n" +
                        "                            </tr>\n" +
                        "<tr>" +
                        "<td>性别：" + feat.cusData.sex + "</td>" +
                        "<td>年龄：" + feat.cusData.age + "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>家庭住址：" + feat.cusData.address + "</td>" +
                        "<td>管护面积：" + feat.cusData.protectionArea + "</td>" +
                        "</tr>" +

                        "<tr >" +
                        "<td colspan=\"2\" > 当前坐标：" + feat.cusData.longitude + "  ,  " + feat.cusData.latitude + "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>轨迹：  </td></tr>"
                    for (var i in res.data.rows) {
                        var tid = res.data.rows[i].traceId;
                        var sync = res.data.rows[i].traceState === strDone;
                        var mileage = res.data.rows[i].mileage;
                        var durTime = res.data.rows[i].duration;
                        html += "<tr><td >" + res.data.rows[i].starttime + "</td>";
                        if (lyrTrail.getVisible() && trailId === tid) {
                            trailIdx = i;
                            html += "<td><input type='button' value='隐藏轨迹' onclick=top.cancelTrail(" + i + "," + tid + "," + sync + ",'blh'," + mileage + "," + durTime + ") /></td></tr>";
                            // } else if (disable) {
                            //     content.innerHTML += "<label type='text' value='无轨迹' disabled />";
                        } else {
                            html += "<td><input  type='button' value='显示轨迹' onclick=top.showTrail(" + i + "," + tid + "," + sync + ",'blh'," + mileage + "," + durTime + ") /></td></tr>";
                        }

                    }
                    html += "</table>";

                    content.innerHTML = html;

                    //设置overlay的显示位置
                    overlay.setPosition(coodinate);
                }
            }, null, null,
            params.serviceIp + '/FortressPatrolTrace/pageByPersonId',
            'get', {
                personId: userId,
                // traceState: '进行中',
                page: 0,
                limit: 3
            }
        )
    }
}

function display(row, source, map, offStyle, onStyle) {
    var curStyle = offStyle;
    if (row.status === strOn) {
        curStyle = onStyle;
    }
    var feature = null;
    if (!map.has(row.userId)) {
        feature = new ol.Feature({
            // 就一个参数啊，定义坐标
            geometry: new ol.geom.Point([row.longitude, row.latitude])
        });
        feature.cusData = row;

        map.set(row.userId, feature);
        source.addFeature(feature);
        feature.setStyle(curStyle);
    } else {
        feature = map.get(row.userId);
        feature.cusData = row;
        feature.getGeometry().setCoordinates([row.longitude, row.latitude]);
        if (feature.getStyle() !== curStyle) {
            feature.setStyle(curStyle);
        }
        // if (row.userId === userId && overlay.getPosition()) {
        //     overlay.setPosition([row.longitude, row.latitude]);
        // }
    }
}

function refreshPatro() {
    doApi(
        function (res) {
            if (res.status === 200 && syncPatro) {
                blhInfo = res.data;
                for (var i in blhInfo) {
                    var row = blhInfo[i];
                    display(row, srcPatro, feaPatroMap, offStyle, onStyle);
                    if (lastTimePatro == null || lastTimePatro < row.siteRecordTime) {
                        lastTimePatro = row.siteRecordTime;
                    }
                }
            }
        }, function (err) {
        }, function (XMLHttpRequest, textStatus) {
            if (syncPatro) {
                setTimeout(refreshPatro, syncSpan);
            }
        }, params.serviceIp + '/FortressInfo/getByCurrentUserDeptAndAfterSiteRecordTime',
        'get', {siteRecordTime: lastTimePatro}
    );
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
function selectPolicelHandler(e) {
    trailIdx = null;
    if (e.target.getFeatures().getLength() == 0) {
        userId = null;
        overlay.setPosition(undefined);
    } else {
        var feat = e.target.getFeatures().item(0);
        userId = feat.cusData.userId;
        doApi(
            function (res) {
                if (res.status === 200) {
                    var disable = false;
                    if (feat.cusData.status === strOff) {
                        disable = true;
                    }
                    var html = '';
                    var coodinate = feat.getGeometry().getCoordinates();

                    //爲null 改爲空格
                    if (feat.cusData.name == null) {
                        feat.cusData.name = ' ';
                    }
                    if (feat.cusData.phone == null) {
                        feat.cusData.phone = ' ';
                    }
                    if (feat.cusData.dptName == null) {
                        feat.cusData.dptName = ' ';
                    }
                    if (feat.cusData.identitynumber == null) {
                        feat.cusData.identitynumber = ' ';
                    }
                    if (feat.cusData.sex == null) {
                        feat.cusData.sex = ' ';
                    }
                    if (feat.cusData.age == null) {
                        feat.cusData.age = ' ';
                    }
                    if (feat.cusData.address == null) {
                        feat.cusData.address = ' ';
                    }
                    if (feat.cusData.protectionArea == null) {
                        feat.cusData.protectionArea = ' ';
                    }
                    if (feat.cusData.address == null) {
                        feat.cusData.address = ' ';
                    }
                    if (feat.cusData.policeSignal == null) {
                        feat.cusData.policeSignal = ' ';
                    }
                    if (feat.cusData.jurisdiction == null) {
                        feat.cusData.jurisdiction = ' ';
                    }
                    if (feat.cusData.longitude == null) {
                        feat.cusData.longitude = ' ';
                    }
                    if (feat.cusData.latitude == null) {
                        feat.cusData.latitude = ' ';
                    }

                    //     console.log(feat.cusData.name);

                    html = "<table  class=\"table table-hover\" frame=\"void\">\n" +
                        "                            <tr>\n" +
                        "                                <td>姓名：" + feat.cusData.name + "</td>\n" +
                        "                                <td>手机号：" + feat.cusData.phone + "</td>\n" +
                        "                            </tr>\n" +
                        "                            <tr>\n" +
                        "<td>所属部门：" + feat.cusData.dptName + "</td>" +
                        "                                <td>身份证号码:" + feat.cusData.identitynumber + "</td>\n" +
                        "                            </tr>\n" +
                        "<tr>" +
                        "<td>性别：" + feat.cusData.sex + "</td>" +
                        "<td>年龄：" + feat.cusData.age + "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>家庭住址：" + feat.cusData.address + "</td>" +
                        "<td>警号：" + feat.cusData.policeSignal + "</td>" +
                        "</tr>" +
                        "<tr >" +
                        "<td colspan=\"2\" > 管辖区域：" + feat.cusData.jurisdiction + "</td>" +
                        "</tr>" +

                        "<tr >" +
                        "<td colspan=\"2\" > 当前坐标：" + feat.cusData.longitude + "  ,  " + feat.cusData.latitude + "</td>" +
                        "</tr>" +
                        "<tr>" +
                        "<td>轨迹：  </td></tr>"
                    for (var i in res.data.rows) {
                        var tid = res.data.rows[i].traceId;
                        var sync = res.data.rows[i].traceState === strDone;
                        var mileage = res.data.rows[i].mileage;
                        var durTime = res.data.rows[i].duration;
                        html += "<tr><td >" + res.data.rows[i].starttime + "</td>";
                        if (lyrTrail.getVisible() && trailId === tid) {
                            trailIdx = i;
                            html += "<td><input type='button' value='隐藏轨迹' onclick=top.cancelTrail(" + i + "," + tid + "," + sync + ",'mj'," + mileage + "," + durTime + ") /></td></tr>";
                            // } else if (disable) {
                            //     content.innerHTML += "<label type='text' value='无轨迹' disabled />";
                        } else {
                            html += "<td><input  type='button' value='显示轨迹' onclick=top.showTrail(" + i + "," + tid + "," + sync + ",'mj'," + mileage + "," + durTime + ") /></td></tr>";

                        }

                    }

                    html += "</table>";

                    content.innerHTML = html;
                    //设置overlay的显示位置
                    overlay.setPosition(coodinate);
                }
            }, null, null,
            params.serviceIp + '/PoliceVisitTrace/pageByVisitorId',
            'get', {
                visitorId: userId,
                // traceState: '进行中',
                page: 0,
                limit: 2
            }
        )
    }
}

function refreshPolice() {
    doApi(
        function (res) {
            if (res.status === 200 && syncPolice) {
                mjInfo = res.data;
                for (var i in mjInfo) {
                    var row = mjInfo[i];
                    display(row, srcPolice, feaPoliceMap, mjoffStyle, mjonStyle);
                    if (lastTimePolice == null || lastTimePolice < row.siteRecordTime) {
                        lastTimePolice = row.siteRecordTime;
                    }
                }
            }
        }, function (err) {
        }, function (XMLHttpRequest, textStatus) {
            if (syncPolice) {
                setTimeout(refreshPolice, syncSpan);
            }
        }, params.serviceIp + '/PoliceInfo/getByCurrentUserDeptAndAfterSiteRecordTime',
        'get'
        , {siteRecordTime: lastTimePolice}
    );
}

function pointerMoveHand(evt) {
    trackArray = evt.coordinate;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------

//显示轨迹
function showTrail(idx, id, tracing, type, mileage, durTime) {
    trackMileage = mileage;
    durationTime = durTime;
    isTrailPan = false;
    if (trailId != null) {
        if (trailId !== id) {
            cancelTrail(trailIdx, trailId);
        }
    }
    syncTrail = true;
    if (tracing !== undefined) {
        onceTrail = tracing
    } else {
        onceTrail = true;
    }
    lyrTrail.setVisible(true);
    trailId = id;
    traceType = type;
    trailIdx = idx;
    refreshTrail(trailId);
    gMap.getMap().on('pointermove', pointerMoveHand);
    if (idx != null) {
        var btnEle = content.getElementsByTagName('input')[idx];
        if (btnEle) {
            btnEle.value = '隐藏轨迹';
            btnEle.onclick = function () {
                top.cancelTrail(idx, id, tracing, type, mileage, durTime);
            }
        }
    }
}

//隐藏轨迹
function cancelTrail(idx, id, tracing, type, mileage, durTime) {
    $("#map2dv")[0].contentWindow.clearTrace();
    syncTrail = false;
    trailId = null;
    feaTrail.getGeometry().setCoordinates([]);
    lyrTrail.setVisible(false);
    gMap.getMap().un('pointermove', pointerMoveHand);
    if (idx != null) {
        var btnEle = content.getElementsByTagName('input')[idx];
        if (btnEle) {
            btnEle.value = '显示轨迹';
            btnEle.onclick = function () {
                top.showTrail(idx, id, tracing, type, mileage, durTime);
            }
        }
    }
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 初始化堡垒户数据刷新及交互
function showPatrol() {
    if (isInit) {
        initData();
    } else {
        lyrPatro.setVisible(true);
    }

    syncPatro = true;
    gMap.getMap().addInteraction(selectIntePatro);

    refreshPatro();

    $("#map2dv")[0].contentWindow.showBLH(true);

    refreshPosData();
}

// 取消堡垒户数据刷新及交互
function cancelPatrol() {
    syncPatro = false;
    gMap.getMap().removeInteraction(selectIntePatro);
    lyrPatro.setVisible(false);
    userId = null;
    overlay.setPosition(undefined);
    cancelTrail();

    $("#map2dv")[0].contentWindow.showBLH(false);
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
// 初始化民警数据刷新及交互
function showPolice() {
    if (isInit) {
        initData();
    } else {
        lyrPolice.setVisible(true);
    }

    syncPolice = true;
    gMap.getMap().addInteraction(selectIntePolice);

    refreshPolice();

    $("#map2dv")[0].contentWindow.showMJ(true);

    refreshPosData();
}

// 取消堡垒户数据刷新及交互
function cancelPolice() {
    syncPolice = false;
    gMap.getMap().removeInteraction(selectIntePolice);
    lyrPolice.setVisible(false);
    userId = null;
    overlay.setPosition(undefined);
    cancelTrail();

    $("#map2dv")[0].contentWindow.showMJ(false);
}

function showDataTableFrame(srcHtml, coor) {
    $("#dataTableMain").attr("src", srcHtml);
    $('#dataTableDiv').show();
    $('#coor').text(coor);
}

function closeDataTableFrame() {
    $("#map2dv")[0].contentWindow.clickIntePos.getFeatures().clear();
    $("#dataTableMain").attr("src", "");
    $('#dataTableDiv').hide();
}

function refreshPosData() {
    $("#map2dv")[0].contentWindow.refreshPosData();
}

function map2dMoveTo(fea, doSomething) {
    var coords = null;

    function moveEndHandler() {
        if (typeof doSomething === 'function') {
            doSomething();
        }
        flashMarker(coords, 5000)
        gMap.getMap().un('moveend', moveEndHandler);
    }

    gMap.getMap().on('moveend', moveEndHandler)
    var hasMoveing = false;
    gMap.getMap().on('movestart', function moveStartHandler() {
        gMap.getMap().un('movestart', moveStartHandler);
        hasMoveing = true;
    })
    setTimeout(function () {
        if (!hasMoveing) {
            if (typeof doSomething === 'function') {
                doSomething();
            }
            flashMarker(coords, 5000)
            gMap.getMap().un('moveend', moveEndHandler);
        }
    }, 100)
    if (Array.isArray(fea) && fea.length === 2) {
        gMap.getMap().getView().animate({center: fea}, {zoom: 18});
        coords = fea;
    } else if (fea && fea.getGeometry && fea.getGeometry()) {
        // 使用fit居中要素
        gMap.getMap().getView().fit(fea.getGeometry(), {
            size: gMap.getMap().getSize(),
            maxZoom: 18,
            duration: animateDuration,
            easing: ol.easing.inAndOut,
            padding: [40, 40, 40, 40]
        })
    }
}

function flashMarker(coords, OutTime) {
    if (!coords) {
        return;
    }
    var monitorOverlay;
    var point_div = document.createElement('div')
    point_div.id = 'css_animation'
    monitorOverlay = new ol.Overlay({
        //设置弹出框的容器
        element: point_div,
        positioning: 'center-center',
        stopEvent: false,
    });
    gMap.getMap().addOverlay(monitorOverlay);

    monitorOverlay.setPosition(coords);

    window.setTimeout(function () {
        monitorOverlay.setElement('');
        gMap.getMap().removeLayer(monitorOverlay);
    }, OutTime);
}

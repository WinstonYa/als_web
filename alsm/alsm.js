LayerManagement.earth = top.earth;

var Layer = {};
Layer.RectLayer = null;
Layer.YurtLayer = null;
Layer.Trailayer = null;
Layer.RectShow = false;
Layer.YurtShow = false;
Layer.TraiShow = false;
var RectDic = new ActiveXObject("Scripting.Dictionary"); //范围
var YurtDic = new ActiveXObject("Scripting.Dictionary"); //蒙古包，人员，轨迹端点
var TraiDic = new ActiveXObject("Scripting.Dictionary"); //轨迹

var minRange = 0;
var maxRange = 2000;
var textHeightScale = 1.2;
var textWidthScale = 1.2;

var bFollow = true;

var alsmObj = {
    loaclUrl: '',
    /***
     创建图层
     ***/
    createLayer: function () {
        var earth = LayerManagement.earth;
        var params = top.params;
        // if (Layer.RectLayer == null) {//钻孔原始地层
        //     var Rectlayer = earth.Factory.CreateEditLayer(earth.Factory.createGuid(), "Rectlayer_1", earth.Factory.CreateLonLatRect(-90, 90, -180, 180, 0, 1000), 0, 1000, params.ip);
        //     earth.AttachObject(Rectlayer);
        //     Layer.RectLayer = Rectlayer;
        // }

        if (Layer.YurtLayer == null) {
            var Yurtlayer = earth.Factory.CreateEditLayer(earth.Factory.createGuid(), "Yurtlayer_1", earth.Factory.CreateLonLatRect(-90, 90, -180, 180, 0, 1000), 0, 1000, params.ip);
            earth.AttachObject(Yurtlayer);
            Layer.YurtLayer = Yurtlayer;
        }
        if (Layer.Trailayer == null) {
            var Trailayer = earth.Factory.CreateEditLayer(earth.Factory.createGuid(), "Trailayer_1", earth.Factory.CreateLonLatRect(-90, 90, -180, 180, 0, 1000), 0, 1000, params.ip);
            earth.AttachObject(Trailayer);
            Layer.Trailayer = Trailayer;
        }
        Layer.RectShow = true;
        Layer.YurtShow = true;
        Layer.TraiShow = false;
    },

    removeLayer: function () {
        Layer.RectShow = false;
        Layer.YurtShow = false;
        Layer.TraiShow = false;
    },

    showLayer: function (result) {
        var IconPath = top.earth.Environment.RootPath + 'icon\\alsmIcon\\';
        // Layer.RectLayer.BeginUpdate();
        Layer.YurtLayer.BeginUpdate();
        Layer.Trailayer.BeginUpdate();
        for (var i = 0; i < result.length; i++) {
            var id = result[i].id;
            var key = id;
            var layerObj = top.Layer;
            top.alsmObj.showPoint(key + 'yurt', result[i].homeloc, IconPath + 'yurt.png', ',yurt', '', Layer.YurtShow);
            if (result[i].status == 0) {
                top.alsmObj.showPoint(key + 'loc', result[i].loc, IconPath + 'offline.png', ',loc', result[i].name, Layer.YurtShow);
            } else {
                top.alsmObj.showPoint(key + 'loc', result[i].loc, IconPath + 'online.png', ',loc', result[i].name, Layer.YurtShow);
            }
            top.alsmObj.showRect(key + "rect", result[i].patrolrect)
        }
        // Layer.RectLayer.EndUpdate();
        Layer.YurtLayer.EndUpdate();
        Layer.Trailayer.EndUpdate();
    },

    showPoint: function (key, obj, iconPath, suffix, text, isShow) {
        var seearth = LayerManagement.earth;
        if (YurtDic.Exists(key) && YurtDic.Item(key) != null) {
            var guid = YurtDic.Item(key);
            Layer.YurtLayer.GetObjByGuid(guid).Visibility = isShow;
        } else {
            var altitude = seearth.Measure.MeasureTerrainAltitude(obj.lon, obj.lat);
            var guid = seearth.Factory.CreateGUID();
            var circleIcon = seearth.Factory.CreateElementIcon(guid, key + suffix);
            circleIcon.Visibility = true;
            circleIcon.textFormat = parseInt("0x100");
            circleIcon.textHorizontalScale = textWidthScale;
            circleIcon.textVerticalScale = textHeightScale;
            circleIcon.showHandle = true;
            circleIcon.minVisibleRange = minRange;
            circleIcon.maxVisibleRange = maxRange;
            circleIcon.selectable = "true";
            circleIcon.editable = "true";
            circleIcon.LineSize = 7;
            circleIcon.Create(obj.lon, obj.lat, altitude, iconPath, iconPath, text);
            YurtDic.Item(key) = guid;
            Layer.YurtLayer.AttachObject(circleIcon);
        }
    },

    showLine: function (key, obj) {
        var seearth = LayerManagement.earth;
        var IconPath = top.earth.Environment.RootPath + 'icon\\alsmIcon\\';
        top.alsmObj.showPoint(key + 'st', obj[0], IconPath + 'qd.png', ',traist', '', Layer.TraiShow);
        top.alsmObj.showPoint(key + 'ed', obj[obj.length - 1], IconPath + 'zd.png', ',traied', '', Layer.TraiShow);
        if (TraiDic.Exists(key) && TraiDic.Item(key) != null) {
            var guid = TraiDic.Item(key);
            Layer.Trailayer.GetObjByGuid(guid).Visibility = Layer.TraiShow;
        } else {
            var vectors3s = seearth.Factory.CreateVector3s();
            for (var k = obj.length - 1; k >= 0; k--) {
                var altitude = seearth.Measure.MeasureTerrainAltitude(obj[k].lon, obj[k].lat);
                vectors3s.Add(obj[k].lon, obj[k].lat, altitude);
            }

            var guid = seearth.Factory.CreateGUID();
            var elementLine = seearth.Factory.CreateElementLine(guid, key + ',line');
            elementLine.BeginUpdate();
            elementLine.SetPointArray(vectors3s);
            elementLine.LineStyle.LineColor = parseInt("0xccff0000");
            elementLine.LineStyle.LineWidth = 3;
            elementLine.Visibility = Layer.TraiShow;
            elementLine.ArrowType = 0;
            elementLine.AltitudeType = 1;
            //新增属性
            elementLine.selectable = false;
            elementLine.editable = false;
            elementLine.DrawOrder = 0;
            elementLine.minVisibleRange = minRange;
            elementLine.maxVisibleRange = maxRange;
            elementLine.EndUpdate();
            TraiDic.Item(key) = guid;
            Layer.Trailayer.AttachObject(elementLine);
        }
    },

    showRect: function (key, obj) {
        // var altitude = 0;
        var seearth = LayerManagement.earth;
        if (RectDic.Exists(key) && RectDic.Item(key) != null) {
            var guid = RectDic.Item(key);
            Layer.YurtLayer.GetObjByGuid(guid).Visibility = Layer.RectShow;
        } else if (obj.length > 2) {
            var vectors3s = seearth.Factory.CreateVector3s();
            var vecs = seearth.GeometryAlgorithm.CreatePolygonFromCircle(2, 24);
            for (var k = 0; k < obj.length; k++) {
                var altitude = seearth.Measure.MeasureTerrainAltitude(obj[k].lon, obj[k].lat);
                vectors3s.Add(obj[k].lon, obj[k].lat, altitude);
            }

            var guid = seearth.Factory.CreateGUID();
            var elementCircle = seearth.Factory.CreateElementPolygon(guid, key + ',rect');
            elementCircle.BeginUpdate();
            elementCircle.SetExteriorRing(vectors3s);
            elementCircle.selectable = false;
            elementCircle.editable = false;
            elementCircle.AltitudeType = 1;
            elementCircle.FillStyle.FillColor = parseInt("0x110000ff"); // 0xccff00ff;
            elementCircle.LineStyle.LineWidth = 5;
            elementCircle.LineStyle.LineColor = parseInt("0xccff0000");
            elementCircle.minVisibleRange = minRange;
            elementCircle.maxVisibleRange = maxRange;
            elementCircle.Visibility = Layer.RectShow;
            elementCircle.EndUpdate();
            RectDic.Item(key) = guid;
            Layer.YurtLayer.AttachObject(elementCircle);
        }
    },

    selectObj: function () {
        var earth = LayerManagement.earth;
        earth.Environment.SetCursorStyle(32512);
        earth.Event.OnPickObject = function (param1) {
            if (param1.name && param1.name != "drill") {
                var name = param1.name;
                var index = 0;
                if (name.indexOf(',') > -1) {
                    if ((index = name.indexOf('yurt')) > -1) {
                        var key = name.substring(0, index);
                        window.open('html/alsm/renkou/pepleotab4.html?ID=' + key, '_blank');
                    } else if ((index = name.indexOf('loc')) > -1) {
                        var key = name.substring(0, index);
                        var x = top.blhInfo[key - 1].loc.lon;
                        var y = top.blhInfo[key - 1].loc.lat;
                        top.alsmObj.showHtmlBalloon(x, y, 425, top.alsmObj.loaclUrl + '/blhInfo' + key + '1RY.html', 600, 650)
                    }

                }
            }
        }
        earth.Event.OnLBDown = function (p2) {
            function _onlbd(p2) {
                earth.Event.OnLBUp = function (p2) {
                    earth.Event.OnLBDown = function (p2) {
                        _onlbd(p2);
                    };
                    earth.Query.PickObject(511, p2.x, p2.y);
                };
            }

            _onlbd(p2);
        };
    },

    cancelSelectObj: function () {
        var earth = LayerManagement.earth;
        earth.Event.OnPickObjectEx = function () {
        };
        earth.Event.OnPickObject = function () {
        };
        earth.Event.OnLBDown = function () {
        };
        earth.Event.OnLBUp = function () {
        };
    },

// 飞行至
    flyToLocation: function (centerX, centerY, range) {
        top.earth.GlobeObserver.FlytoLookat(centerX, centerY, 0, 0, 90, 0, range, 3);
    },
// 气泡显示
    showHtmlBalloon: function (vecCenterX, vecCenterY, vecCenterZ, htmlStr, w, h) {
        var earth = LayerManagement.earth;
        var earthHeight = $("#earthDiv", window.parent.document).height();
        var balloonHeight = earthHeight / 2 - 50;
        if (h != null) {
            balloonHeight = h
        }
        var balloonWidth = 380;
        if (w != null) {
            balloonWidth = w
        }

        if (LayerManagement.htmlBalloon) {
            LayerManagement.htmlBalloon.DestroyObject();
            LayerManagement.htmlBalloon = null;
        }
        var guid = earth.Factory.CreateGuid();

        LayerManagement.htmlBalloon = earth.Factory.CreateHtmlBalloon(guid, "balloon");
        vecCenterZ = earth.Measure.MeasureTerrainAltitude(vecCenterX, vecCenterY);
        LayerManagement.htmlBalloon.SetSphericalLocation(vecCenterX, vecCenterY, vecCenterZ);
        LayerManagement.htmlBalloon.SetRectSize(balloonWidth, balloonHeight);
        if (top.SYSTEMPARAMS.balloonAlpha > 0) {
            LayerManagement.htmlBalloon.SetIsTransparence(true);
        } else {
            LayerManagement.htmlBalloon.SetIsTransparence(false);
        }
        var color = parseInt("0xffffff00");
        LayerManagement.htmlBalloon.SetTailColor(color);
        LayerManagement.htmlBalloon.SetIsAddCloseButton(true);
        LayerManagement.htmlBalloon.SetIsAddMargin(true);
        LayerManagement.htmlBalloon.SetIsAddBackgroundImage(true);
        LayerManagement.htmlBalloon.SetBackgroundAlpha(0xcc);
        // LayerManagement.htmlBalloon.ShowHtml(htmlStr);
        LayerManagement.htmlBalloon.ShowNavigate(htmlStr);
        top.Stamp.Tools.OnHtmlBalloonFinishedFunc(guid, function (closeBid) {

            if (LayerManagement.htmlBalloon != null) {
                LayerManagement.htmlBalloon.DestroyObject();
                LayerManagement.htmlBalloon = null;
            }
        });
    },

    trackName: 'GPSTrack',
    tracks: [],
    line: [],
    //停止所有GPS
    internalTime: null,
    lunXunTime: 1,
    finishTimes: null,
    record: [], //包含所有路径点、路径以及对象
    //获取运动对象列表
    //callback：回调函数
    dynamicList: [],
    dynamicListPeople: [],
    dynamicListCar: [],
    dynamicListBoat: [],
    dynamicListPlane: [],
    StartTrack: function (name) {
        top.alsmObj.StopTrack();
        Layer.TraiShow = true;
        top.alsmObj.trackName = name;
        top.alsmObj.getXmlData();
        if (top.alsmObj.record.length > 0) {
            top.alsmObj.line = [];
            for (var i = 0; i < top.alsmObj.record[0].trackPoints.length; i++) {
                var pnt = {
                    lon: top.alsmObj.record[0].trackPoints[i].x,
                    lat: top.alsmObj.record[0].trackPoints[i].y,
                }
                top.alsmObj.line.push(pnt);
            }
            top.alsmObj.showLine(top.alsmObj.trackName, top.alsmObj.line);
            top.alsmObj.flyToLocation(top.alsmObj.line[0].lon, top.alsmObj.line[0].lat, 425);

            earth.Environment.SetCursorStyle(32512);
            earth.Event.OnPickObject = function (param1) {
                if (param1.name && param1.name != "drill") {
                    var name = param1.name;
                    var index = 0;
                    if (name == top.alsmObj.trackName + 'st,traist') {
                        top.alsmObj.GPSTrack();
                    }
                }
            }
            earth.Event.OnLBDown = function (p2) {
                function _onlbd(p2) {
                    earth.Event.OnLBUp = function (p2) {
                        earth.Event.OnLBDown = function (p2) {
                            _onlbd(p2);
                        };
                        earth.Query.PickObject(511, p2.x, p2.y);
                    };
                }

                _onlbd(p2);
            };
        }
    },
    StopTrack: function (name) {
        Layer.TraiShow = false;
        var earth = LayerManagement.earth;
        earth.Event.OnPickObjectEx = function () {
        };
        earth.Event.OnPickObject = function () {
        };
        earth.Event.OnLBDown = function () {
        };
        earth.Event.OnLBUp = function () {
        };
        top.alsmObj.GPSStop();
    },
    //将gpstrack文件下面的解析为一个包含点集的数据集合并且返回
    //主要用于构造ztree
    getXmlData: function () {
        var trackXml = top.alsmObj.getXml("trackList");
        if (trackXml.xml) {
            top.alsmObj.record = $.xml2json(trackXml.xml);
            if (top.alsmObj.record && top.alsmObj.record.Record) {
                top.alsmObj.record = top.alsmObj.record.Record;
            } else {
                return null;
            }
            if (!top.alsmObj.record.length) { //只有一条记录
                top.alsmObj.record = [top.alsmObj.record];
            }
            for (var i = 0; i < top.alsmObj.record.length; i++) {
                var thisTrackFileName = "track" + top.alsmObj.record[i].ID;
                var trackPointXml = top.alsmObj.getXml(thisTrackFileName); //调用接口读取客户端中的xml
                if (trackPointXml.xml) {
                    var trackPoint = $.xml2json(trackPointXml.xml);
                    var trackPoints = top.alsmObj.getTrackPoints(trackPoint);
                    top.alsmObj.record[i].trackPoints = trackPoints;
                }
            }
        }
    },
    //获取xml文件的内容
    getXml: function (fileName) {
        var earth = LayerManagement.earth; //三维球对象
        var gpsTrckFile = earth.Environment.RootPath + top.alsmObj.trackName + "\\" + fileName + ".xml";
        var fileXml = earth.UserDocument.LoadXmlFile(gpsTrckFile);
        var fileDoc = loadXMLStr(fileXml);
        if ((fileDoc === null) || (fileDoc.xml === "")) {
        }
        return fileDoc;
    },
    //通过trackPoint数组构造点集合
    //trackPoint:通过解析xml得到的对象
    //返回点集合pointArr
    getTrackPoints: function (trackPoint) {
        var earth = LayerManagement.earth; //三维球对象
        var thisRoute = trackPoint.Route;
        var pass = thisRoute.Pass;
        var pointArr = [];
        for (var i = 0; i < pass.length; i++) {
            var thisStation = pass[i];
            var stationPoint = {
                x: thisStation.Longitude,
                y: thisStation.Latitude,
                z: thisStation.Altitude,
                range: earth.Measure.MeasureTerrainAltitude(thisStation.Longitude, thisStation.Latitude) + parseFloat(thisStation.FlyHeight)
            };
            pointArr.push(stationPoint);
        }
        return pointArr;
    },
    /**
     * 加载所有对象
     */
    loadAllObject: function () {
        var thisLoadId = null;
        //根据保存的XML里面的运动对象guid寻找是否有相同的对象
        for (var i = 0; i < top.alsmObj.record.length; i++) {
            top.alsmObj.record[i].trackPointIndex = 0; //设置运动物体目前跑到哪一个点位，用于定位
            var thisDynaId = top.alsmObj.record[i].DYNAMICID;
            for (var j = 0; j < dynamicList.length; j++) {
                if (dynamicList[j].guid == thisDynaId) {
                    thisLoadId = thisDynaId;
                    break;
                }
            }
            //如果有相同guid的对象则加载保存的对象
            if (thisLoadId) {
                earth.DynamicSystem.LoadDynamicObject(thisLoadId);
            } else { //如果没有,则根据保存的对象类型寻找加载对象
                if (top.alsmObj.record[i].TYPE == "car") {
                    if (dynamicListCar && dynamicListCar.length > 0) {
                        earth.DynamicSystem.LoadDynamicObject(dynamicListCar[0].guid);
                    } else {
                        earth.DynamicSystem.LoadDynamicObject(dynamicList[0].guid);
                    }
                } else if (top.alsmObj.record[i].TYPE == "people") {
                    if (dynamicListPeople && dynamicListPeople.length > 0) {
                        earth.DynamicSystem.LoadDynamicObject(dynamicListPeople[0].guid);
                    } else {
                        earth.DynamicSystem.LoadDynamicObject(dynamicList[0].guid);
                    }
                } else if (top.alsmObj.record[i].TYPE == "boat") {
                    if (dynamicListBoat && dynamicListBoat.length > 0) {
                        earth.DynamicSystem.LoadDynamicObject(dynamicListBoat[0].guid);
                    } else {
                        earth.DynamicSystem.LoadDynamicObject(dynamicList[0].guid);
                    }
                } else if (top.alsmObj.record[i].TYPE == "plane") {
                    if (dynamicListPlane && dynamicListPlane.length > 0) {
                        earth.DynamicSystem.LoadDynamicObject(dynamicListPlane[0].guid);
                    } else {
                        earth.DynamicSystem.LoadDynamicObject(dynamicList[0].guid);
                    }
                } else {
                    //如果guid和类型都匹配不上,那么默认加载第一个运动对象
                    earth.DynamicSystem.LoadDynamicObject(dynamicList[0].guid);
                }
            }
        }
    },
    /**
     * 开启循环
     * @param  {[string]} pointIndex [现在是第几个点]
     * @param  {[number]} i          [第几个对象]
     * @return {[type]}            [description]
     */
    roundTrack: function (pointIndex, i) {
        var nTrackIndex = 0;
        if (pointIndex % ((top.alsmObj.record[i].trackPoints.length - 1) * 2) <= top.alsmObj.record[i].trackPoints.length - 1) {
            nTrackIndex = pointIndex % ((top.alsmObj.record[i].trackPoints.length - 1) * 2);
        } else {
            nTrackIndex = ((top.alsmObj.record[i].trackPoints.length - 1) * 2) - pointIndex % ((top.alsmObj.record[i].trackPoints.length - 1) * 2);
        }
        top.alsmObj.record[i].trackPointIndex = nTrackIndex;
        top.alsmObj.record[i].track.AddGPS(top.alsmObj.record[i].trackPoints[nTrackIndex].x, top.alsmObj.record[i].trackPoints[nTrackIndex].y, top.alsmObj.record[i].trackPoints[nTrackIndex].range, top.alsmObj.lunXunTime * 1000);
    },
    /**
     * 没有开启循环的track
     * @param  {[string]} pointIndex [现在是第几个点]
     * @param  {[number]} i          [第几个对象]
     * @return {[type]}            [description]
     */
    normalTrack: function (pointIndex, i) {
        if (pointIndex < top.alsmObj.record[i].trackPoints.length) {
            top.alsmObj.record[i].trackPointIndex = pointIndex;
            top.alsmObj.record[i].track.AddGPS(top.alsmObj.record[i].trackPoints[pointIndex].x, top.alsmObj.record[i].trackPoints[pointIndex].y, top.alsmObj.record[i].trackPoints[pointIndex].range, top.alsmObj.lunXunTime * 1000);
        } else if (pointIndex > top.alsmObj.record[i].trackPoints.length) {
            top.alsmObj.finishTimes++;
            if (top.alsmObj.record[i].track.BindObject) { //卸载运动对象
                earth.GlobeObserver.StopTracking();
                earth.GlobeObserver.Stop();
                top.alsmObj.record[i].track.Stop();
                earth.DynamicSystem.UnLoadDynamicObject(top.alsmObj.record[i].track.BindObject);
            }
            earth.GPSTrackControl.DeleteTrack(top.alsmObj.record[i].track.guid);
            top.alsmObj.record[i].track = null;
            if (top.alsmObj.finishTimes == top.alsmObj.record.length) { //当所有的都飞行完毕时将按钮状态还原
                clearInterval(top.alsmObj.internalTime);
                top.alsmObj.internalTime = null;
            }
        }
    },
//开启所有的GPSTrack
    GPSTrack: function () {
        var earth = LayerManagement.earth; //三维球对象
        top.alsmObj.tracks = [];
        top.alsmObj.getDynamicList(function () { //获取运动对象列表
            var dIndex = 0;
            earth.Event.OnDocumentChanged = function (type, newGuid) {
                top.alsmObj.gpsPlay(top.alsmObj.record[dIndex], newGuid); //设置路径属性，加载路径
                dIndex++;
                if (dIndex == top.alsmObj.record.length) { //所有运动对象加载完毕
                    objectLoaded = true;
                }
            };
            top.alsmObj.loadAllObject(); //加载对象
            var pointIndex = 3;
            var isRound = false; //循环是否开启
            top.alsmObj.finishTimes = 0; //路径完成的条数,针对不开启循环
            top.alsmObj.internalTime = setInterval(function () {
                if (top.alsmObj.internalTime == null) { //防止报错
                    return;
                }
                ///如果是接入实时数据（url），需要通过AJAX实时请求URL服务，返回坐标点加入到AddGPS中
                for (var i = 0; i < top.alsmObj.record.length; i++) {
                    if (top.alsmObj.record[i].track && top.alsmObj.record[i].trackPoints) {
                        if (isRound) { //如果开启了循环则用定时器实现来回
                            top.alsmObj.roundTrack(pointIndex, i);
                        } else { //如果没有开启循环,则在加载完一条Track的时候就将此track设为null
                            top.alsmObj.normalTrack(pointIndex, i);
                        }
                    }
                }
                pointIndex++;
            }, top.alsmObj.lunXunTime * 1000);
        });
    },
    GPSStop: function () {
        var earth = LayerManagement.earth; //三维球对象
        if (top.alsmObj.internalTime) { //清除掉定时器
            clearInterval(top.alsmObj.internalTime);
            top.alsmObj.internalTime = null;
        }
        //此接口使用有问题，暂时注释掉
        for (var i = 0; i < top.alsmObj.record.length; i++) {
            if (!top.alsmObj.record[i].track) {
                continue;
            }
            earth.GPSTrackControl.SetMainTrack(top.alsmObj.record[i].track.guid, 4);
        }
        if (earth && earth.GPSTrackControl && earth.GlobeObserver) {
            earth.GlobeObserver.StopTracking();
            earth.GlobeObserver.Stop();
            for (var i = top.alsmObj.record.length - 1; i >= 0; i--) {
                if (top.alsmObj.record[i].track) {
                    top.alsmObj.record[i].track.Stop();
                    earth.DynamicSystem.UnLoadDynamicObject(top.alsmObj.record[i].track.BindObject); //写在运动物体
                    earth.GPSTrackControl.DeleteTrack(top.alsmObj.record[i].track.guid); //删除三维球上的路径
                    top.alsmObj.record[i].track = null;
                }
            }
        }

        if (top.alsmObj.line.length > 0)
            top.alsmObj.showLine(top.alsmObj.trackName, top.alsmObj.line);
        top.alsmObj.tracks = [];
        top.alsmObj.line = [];
    },
    //根据保存的xml来对track进行设置
    gpsPlay: function (trackObj, newGuid) {
        var earth = LayerManagement.earth; //三维球对象
        var pts = trackObj.trackPoints;
        var track = null;
        var tid = earth.Factory.CreateGuid();
        track = earth.Factory.CreateGPSTrack(tid, trackObj.NAME);
        track.DataType = 3; //1-从串口获取数据，2-从文件获取数据，3-使用接口AddGPS手动传入数据
        var isShowRoute = false;
        track.Visibility = isShowRoute;
        track.ShowBindObject(true);

        track.InitFollowTrack(180, 15, 2, 10);
        track.HeightType = trackObj.HEIGHTTYPE; //1贴地,0读取数据
        track.BindObject = newGuid;
        track.NameColor = 0xffffffff;
        track.InformationColor = 0xffffffff;
        track.Play();
        top.alsmObj.tracks.push(track);
        var pointIndex = 0;
        var time = top.alsmObj.lunXunTime * 1000;
        //如果是读取数据高程则读取xml里面的range
        track.AddGPS(pts[pointIndex].x, pts[pointIndex].y, pts[pointIndex].range, time);
        pointIndex++;
        track.AddGPS(pts[pointIndex].x, pts[pointIndex].y, pts[pointIndex].range, time);
        pointIndex++;
        track.AddGPS(pts[pointIndex].x, pts[pointIndex].y, pts[pointIndex].range, time);
        pointIndex++;
        track.Information = trackObj.INFORMATION;
        var isShowName = true;
        track.ShowInfomation = false;
        track.ShowName = isShowName;
        trackObj.track = track;
        if (bFollow) {
            earth.GPSTrackControl.SetMainTrack(trackObj.track.guid, 3);
        }
    },
    getDynamicList: function (callback) {
        var earth = LayerManagement.earth; //三维球对象
        earth.Event.OnDynamicListLoaded = function (list) { //获取到运动对象回调
            earth.Event.OnDynamicListLoaded = function () {
            }; //清除回调
            if (list == null || list.Count == 0) { //运动对象列表为空
                return;
            }
            dynamicList = [];
            dynamicListPeople = [];
            dynamicListCar = [];
            dynamicListBoat = [];
            dynamicListPlane = [];
            for (var i = 0; i < list.Count; i++) {
                var dynamic = list.Items(i);
                var type = dynamic.Type;
                if (type == "DynamicPeople") { //人
                    dynamicListPeople.push(dynamic);
                } else if (type == "DynamicObject") { //车
                    dynamicListCar.push(dynamic);
                } else if (type == "FlyObject" && dynamic.Name == "船") {
                    dynamicListBoat.push(dynamic);
                } else if (type == "FlyObject" && dynamic.Name != "船") {
                    dynamicListPlane.push(dynamic);
                }
                dynamicList.push(dynamic);

            }
            callback();
        };
        earth.DynamicSystem.ApplyDynamicList(); //获取运动对象列表
    },

}

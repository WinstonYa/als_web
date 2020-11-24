// 监控点位显示

var monitorOverlay = null;
var monitorContent = null;
var monitorLayer = null;
var monitorSource = null;
var monitorFeature = null;

function showMonitorOverlay(pnt, src) {
    if (monitorOverlay == null) {
        var container = document.getElementById("monitor_popw");
        var popupCloser = document.getElementById("monitor_close");
        monitorContent = document.getElementById("monitor_frame");

        monitorOverlay = new ol.Overlay({
            //设置弹出框的容器
            element: container,
            //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
            autoPan: true,
            autoPanMargin: 30
        });
        popupCloser.onclick = function () {
            if (monitorContent != null) {
                monitorContent.src = '';
            }
            if (monitorOverlay != null) {
                monitorOverlay.setPosition(undefined);
            }
        };
        gMap.getMap().addOverlay(monitorOverlay);
    }

    if (monitorContent != null) {
        monitorContent.src = src;
        monitorOverlay.setPosition(pnt);
    }
}

function showMonitorPoints(pnts) {
    if (monitorSource == null) {
        monitorSource = new top.ol.source.Vector()
        monitorLayer = new top.ol.layer.Vector({
            source: monitorSource,
            style: new top.ol.style.Style({
                image: new top.ol.style.Icon({
                    src: './images/monitor.png',
                    anchor: [0.5, 0.96],
                    crossOrigin: 'anonymous'
                })
            })
        })
        monitorFeature = new top.ol.Feature({
            geometry: new top.ol.geom.MultiPoint(pnts)
        });
        monitorSource.addFeature(monitorFeature);

        top.gMap.getMap().addLayer(monitorLayer);
    } else {
        monitorFeature.getGeometry().setCoordinates(pnts);
    }
}

// 上报事件点位显示
var eventOverlay = null;
var eventContent = null;
var eventLayer = null;
var eventSource = null;
var eventFeatureMap = new Map();
var selectInteEvent = null;
var currentEventInfo = null;

function displayEventOverlay(coodinate) {
    if (currentEventInfo) {
        eventOverlay.setPosition(coodinate);
        if (eventContent.contentWindow && eventContent.contentWindow.vm) {
            eventContent.contentWindow.vm.setData(currentEventInfo);
        }
        var p = gMap.getMap().getPixelFromCoordinate(coodinate);
        if (p) {
            p[1] -= 200;
            coodinate = gMap.getMap().getCoordinateFromPixel(p);
            if (coodinate) {
                gMap.getMap().getView().animate({center: coodinate});
            }
        }
    }
}

function selectEventHandler(e) {
    if (e.target.getFeatures().getLength() === 0) {
        userId = null;
        eventOverlay.setPosition(undefined);
    } else {
        var feat = e.target.getFeatures().item(0);
        var coodinate = feat.getGeometry().getCoordinates();
        currentEventInfo = feat.cusData;
        displayEventOverlay(coodinate);
    }
}

function initEventPoints() {
    if (eventSource == null) {
        eventSource = new ol.source.Vector()
        eventLayer = new ol.layer.Vector({
            source: eventSource,
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    src: './images/event.png',
                    anchor: [0.5, 0.96],
                    crossOrigin: 'anonymous'
                })
            })
        })

        selectInteEvent = new ol.interaction.Select({
            layers: [eventLayer],
            style: null
        });

        gMap.getMap().addLayer(eventLayer);
        gMap.getMap().addInteraction(selectInteEvent);
        selectInteEvent.on('select', selectEventHandler);

        var container = document.getElementById("monitor_popw");
        var popupCloser = document.getElementById("monitor_close");
        eventContent = document.getElementById("monitor_frame");

        eventOverlay = new ol.Overlay({
            //设置弹出框的容器
            element: container,
            //是否自动平移，即假如标记在屏幕边缘，弹出时自动平移地图使弹出框完全可见
            offset: [0, -48],
            // autoPan: true,
            // autoPanMargin: 30
        });
        eventContent.src = '../alsm/patrolManage/EventFiles.html';
        popupCloser.onclick = function () {
            if (eventOverlay != null) {
                eventOverlay.setPosition(undefined);
            }
            if (selectInteEvent != null) {
                selectInteEvent.getFeatures().clear();
            }
        };
        gMap.getMap().addOverlay(eventOverlay);
    }
}

function showEventPoints(events) {
    initEventPoints();
    eventSource.clear();
    eventFeatureMap.clear();

    for (var i = 0; i < events.length; i++) {
        var eventFeature = new ol.Feature({
            geometry: new ol.geom.Point([events[i].longitude, events[i].latitude])
        });
        eventFeature.cusData = events[i];
        eventFeatureMap.set(events[i].id, eventFeature);

        eventSource.addFeature(eventFeature);
    }

    eventLayer.setVisible(true);
}

function showEventOverlay(id) {
    if (eventContent != null) {
        var eventFeature = null;
        if (eventFeatureMap.has(id)) {
            selectInteEvent.getFeatures().clear();
            eventFeature = eventFeatureMap.get(id);
            selectInteEvent.getFeatures().push(eventFeature);
            currentEventInfo = eventFeatureMap.get(id).cusData;
            var coodinate = eventFeature.getGeometry().getCoordinates();
            displayEventOverlay(coodinate);
        }
    }
}

function hideEventPoints() {
    if (eventSource == null) {
        return;
    }
    eventLayer.setVisible(false);
    eventOverlay.setPosition(undefined);
}

function showProtectRegion(strPnts, name) {
    $(document).contents().find("#map2dv")[0].contentWindow.clearMeasure();
    initEventPoints();
    eventSource.clear();
    eventFeatureMap.clear();

    if (strPnts != null) {
        var pts = gpsDataStringToList(strPnts);
        if (pts.length > 0) {
            var coords = [];
            for (var i = 0; i < pts.length; i++) {
                var ps = pts[i];
                if (ps) {
                    coords.push([ps.longitude, ps.latitude]);
                }
            }
            var eventFeature = new ol.Feature({
                geometry: new ol.geom.Polygon([coords])
            });
            eventFeature.setStyle(new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "#794215".colorRgbaArray(0.2)
                }),
                stroke: new ol.style.Stroke({
                    color: "#fd0505",
                    width: 2
                }),
                text: new ol.style.Text({
                    font: '14px serif',
                    text: name,
                    fill: new ol.style.Fill({
                        color: "#fd0505"
                    })
                })
            }));
            eventSource.addFeature(eventFeature);
            eventLayer.setVisible(true);
        }
    }

}

function hideProtectRegion() {
    if (eventSource == null) {
        return;
    }
    eventLayer.setVisible(false);
    $(document).contents().find("#map2dv")[0].contentWindow.cancelMeasure();
}

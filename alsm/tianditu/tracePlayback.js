var TYPE_NORMAL = 0;
var TYPE_KNEE = 1;

var traceLyr = null;
var traceSrc = null;
var onStyle = null;
var traceFea = null;

var stepCount = 1000;
var stepTime = 50;
var actualStepTime = 1000;
var curTrace = [];
var maxRateCount = 10;
var rates = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 18];
var originalRate = 15000;
var curStep = 1;
var curIndex = -1;
var isPlaying = false;
var isPrePlaying = false;
var isShowInfo = false;

var traceHoverIntePos = null;
var traceHoverTooltip = null;
var traceHoverTooltipElement = null;

// let traceTooltip
// let traceTooltipElement

function initTracePlayback(trace, style) {
    if (traceLyr == null) {
        traceSrc = new ol.source.Vector();
        traceLyr = new ol.layer.Vector({
            source: traceSrc,
            // style: new ol.style.Style({image: new ol.style.Icon({src: './images/none.png'}), zIndex: 10})
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({color: '#ffcc33'})
                })
            })
        });
        gMap.getMap().addLayer(traceLyr);

        traceHoverIntePos = new ol.interaction.Select({
            condition: ol.events.condition.pointerMove,
            layers: [traceLyr]
        });
        traceHoverIntePos.on('select', traceHoverPosHandler);
        gMap.getMap().addInteraction(traceHoverIntePos);

        traceHoverTooltipElement = document.createElement('div');
        traceHoverTooltipElement.className = 'ol-popup';
        traceHoverTooltipElement.style.width = '280px';
        traceHoverTooltipElement.style.height = '135px';
        traceHoverTooltipElement.innerHTML = '';
        traceHoverTooltip = new ol.Overlay({
            element: traceHoverTooltipElement,
            // offset: [0, -48],
            offset: [0, -12],
            stopEvent: false,
        });
        gMap.getMap().addOverlay(traceHoverTooltip);

        // traceTooltipElement = document.createElement('div');
        // traceTooltipElement.className = 'ol-popup';
        // traceTooltipElement.style.width = '185px';
        // traceTooltipElement.style.height = '105px';
        // traceTooltipElement.innerHTML = '';
        // traceTooltip = new ol.Overlay({
        //     element: traceTooltipElement,
        //     // offset: [0, -48],
        //     offset: [0, -12],
        //     stopEvent: false,
        // });
        // gMap.getMap().addOverlay(traceTooltip);
    }

    gMap.getMap().on('moveend', function () {
        if (isPrePlaying) {
            isPrePlaying = false;
            startTrace();
        }
    });
    gMap.getMap().on('movestart', function moveStartHandler() {
        if (isPlaying) {
            isPrePlaying = true;
            pauseTrace();
        }
    });

    onStyle = style;

    clearTrace();
    showTrace();
    handleTrace(trace);
}

function handleTrace(trace) {
    if (!trace || trace.length < 1) {
        return;
    }
    var startTime = trace[0].time;
    var endTime = trace[trace.length - 1].time;
    var timeCount = endTime - startTime;

    actualStepTime = Math.ceil(timeCount / stepCount / 1000) * 1000;
    var curTime = startTime;
    var i = 0;
    var preTrace = null;
    while (curTime < endTime) {
        if (curTime > trace[i].time) {
            while (curTime > trace[i].time) {
                addTracePoint(trace[i], preTrace, TYPE_KNEE);
                preTrace = trace[i];
                i++;
            }
        }
        if (curTime === trace[i].time) {
            addTracePoint(trace[i], preTrace, TYPE_KNEE);
            preTrace = trace[i];
            i++;
        } else if (curTime < trace[i].time) {
            var r = (curTime - preTrace.time) / (trace[i].time - preTrace.time);
            var pt0 = preTrace.pt;
            var pt1 = trace[i].pt;
            var newTrace = {};
            newTrace.time = curTime
            newTrace.pt = [pt0[0] + (pt1[0] - pt0[0]) * r, pt0[1] + (pt1[1] - pt0[1]) * r]
            addTracePoint(newTrace, preTrace);
        }
        curTime += actualStepTime;
    }
    addTracePoint(trace[trace.length - 1], preTrace);
}

function calMileage(tracePoint, preTracePoint) {
    var p1 = tracePoint.pt;
    var p0 = preTracePoint.pt;
    return ol.sphere.getDistance(p1, p0) / 1000;
}

function addTracePoint(tracePoint, preTracePoint, type) {
    if (preTracePoint != null) {
        tracePoint.timeout = tracePoint.time - preTracePoint.time
        var preMileage = calMileage(tracePoint, preTracePoint);
        tracePoint.speed = (preMileage * 3600000 / tracePoint.timeout);
        tracePoint.mileage = preTracePoint.mileage + preMileage;
    } else {
        tracePoint.mileage = 0;
        tracePoint.speed = 0;
    }
    tracePoint.strTime = new Date(tracePoint.time).pattern('yyyy-MM-dd HH:mm:ss');
    if (type) {
        tracePoint.type = type;
    } else {
        tracePoint.type = TYPE_NORMAL;
    }
    if (type === TYPE_KNEE && curTrace.length !== 0) {
        curTrace[curTrace.length - 1].knee.push(tracePoint);
    } else {
        tracePoint.knee = [];
        curTrace.push(tracePoint)
    }
    if (type === TYPE_KNEE) {
        var tmpFea = new ol.Feature({
            // 就一个参数啊，定义坐标
            geometry: new ol.geom.Point(tracePoint.pt)
        })
        tmpFea.cusData = tracePoint;
        traceSrc.addFeature(tmpFea);
    }
}

function traceHoverPosHandler(e) {
    var feat = null;
    if (isShowInfo) {
        feat = traceFea;
    }
    let feaCount = e.target.getFeatures().getLength()
    if (feaCount !== 0) {
        feat = e.target.getFeatures().item(0);
    }
    if (feat) {
        // console.log('选中要素：' + feaCount + '个')
        if (feat.cusData) {
            showTooltip(feat.cusData, traceHoverTooltipElement, traceHoverTooltip);
        }
    } else {
        traceHoverTooltip.setPosition();
    }
}

function showTooltip(trace, tooltipElement, tooltip) {
    var coordinate = trace.pt;
    var strHtml =
        '<table  class="table" frame="void">\n';
    var count = 0;
    count++;
    strHtml +=
        '   <tr>\n' +
        '       <td>时间：' + trace.strTime + '</td>\n' +
        '   </tr>\n';
    count++;
    strHtml +=
        '   <tr>\n' +
        '       <td>里程：' + trace.mileage.toFixed(2) + ' 公里</td>\n' +
        '   </tr>\n';
    strHtml +=
        '   <tr>\n' +
        '       <td>速度：' + trace.speed.toFixed(0) + ' 公里/小时</td>\n' +
        '   </tr>\n';
    strHtml +=
        '   <tr>\n' +
        '       <td></td>\n' +
        '   </tr>\n' +
        '</table>'
    tooltipElement.innerHTML = strHtml;
    tooltip.setPosition(coordinate)
}

function showPersonIcon(idx) {
    if (!traceFea) {
        traceFea = new ol.Feature({
            // 就一个参数啊，定义坐标
            geometry: new ol.geom.Point(curTrace[idx].pt)
        })
        traceFea.setStyle(onStyle);
        traceSrc.addFeature(traceFea);
    } else {
        traceFea.getGeometry().setCoordinates(curTrace[idx].pt);
    }
    traceFea.cusData = curTrace[idx];
    gMap.getMap().render();
    // showTooltip(curTrace[idx], traceTooltipElement, traceTooltip);
    if (isShowInfo && traceHoverIntePos.getFeatures().getLength() === 0) {
        showTooltip(curTrace[idx], traceHoverTooltipElement, traceHoverTooltip);
    }
    // console.log(curTrace[idx].pt);
}

function hidePersonIcon() {
    if (traceSrc) {
        traceSrc.clear();
        traceFea = null;
    }
}

function moveFeature(event) {
    var vectorContext = ol.render.getVectorContext(event);
    var frameState = event.frameState;
    // console.log(event);
    updateCurIndex();
    var elapsedTime = frameState.time - now;
    if (elapsedTime < stepTime) {
        // console.log(stepTime - elapsedTime);
        setTimeout(function () {
            if (isPlaying) {
                stepTrace();
            }
        }, stepTime - elapsedTime);
    } else {
        stepTrace();
    }
}

function stepTrace(step) {
    now = new Date().getTime();
    step = step || curStep;
    if (curTrace.length === 0) {
        return;
    }
    curIndex += step;
    if (curIndex < 0) {
        curIndex = 0;
    }
    if (curIndex > curTrace.length - 1) {
        curIndex = curTrace.length - 1
    }
    if (curIndex === curTrace.length - 1) {
        isPlaying = false;
    }
    showPersonIcon(curIndex);
}

function startTrace() {
    $('#playTraceBtn').hide();
    $('#pauseTraceBtn').show();
    if (traceLyr) {
        traceLyr.setVisible(true);
        isPlaying = true;
        traceLyr.on('postrender', moveFeature);
        stepTrace();
    }
}

function pauseTrace() {
    $('#pauseTraceBtn').hide();
    $('#playTraceBtn').show();
    if (traceLyr) {
        isPlaying = false;
        traceLyr.un('postrender', moveFeature);
    }
}

function resetTrace() {
    $('#pauseTraceBtn').hide();
    $('#playTraceBtn').show();
    curIndex = -1;
    isPlaying = false;
    pauseTrace();
    stepTrace()
    updateCurIndex();
}

function showTrace() {
    if (traceLyr) {
        traceLyr.setVisible(true);
        if (isShowInfo && traceHoverIntePos.getFeatures().getLength() === 0 && traceFea) {
            showTooltip(traceFea.cusData, traceHoverTooltipElement, traceHoverTooltip);
        }
    }
}

function hideTrace() {
    if (traceLyr) {
        pauseTrace();
        traceLyr.setVisible(false);
        traceHoverTooltip.setPosition();
    }
}

function clearTrace() {
    hideTrace();
    curTrace.length = 0;
    curIndex = -1;
    isPlaying = false;
    hidePersonIcon();
    initTracePanel();
    updateCurIndex();
    hideTracePanel();
}

function initTracePanel() {
    tag = false;
    ox = 0;
    left = 0;
    bgleft = 0;
    setProgress();
}

function setProgress() {
    $('.progress_btn').css('left', left);
    $('.progress_bar').width(left);
    $('.text').html(((left / 300) * 100).toFixed(0) + '%');
}

function updateProgress() {
    curIndex = Math.round((left / 300) * curTrace.length);
    stepTrace(0);
}

function updateCurIndex() {
    if (curIndex > -1) {
        left = Math.round((curIndex / curTrace.length) * 300);
        setProgress();
    }
}

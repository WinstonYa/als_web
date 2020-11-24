const MeasureType_area = 'area';
const MeasureType_line = 'line';
const MeasureType_rect = 'rect';

let typeSelect = MeasureType_line;

const source = new ol.source.Vector();
const vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

let binit = false;
let breg = false;


/**
 * Currently drawn feature.
 * @type {import("../src/ol/Feature.js").default}
 */
let sketch;


/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
let helpTooltipElement;


/**
 * ol.Overlay to show the help messages.
 * @type {ol.Overlay}
 */
let helpTooltip;


/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
let measureTooltipElement;


/**
 * ol.Overlay to show the measurement.
 * @type {ol.Overlay}
 */
let measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
const continuePolygonMsg = 'Click to continue drawing the polygon';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
const continueLineMsg = 'Click to continue drawing the line';


/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
const pointerMoveHandler = function (evt) {
    // if (evt.dragging) {
    //     return;
    // }
    // /** @type {string} */
    // let helpMsg = 'Click to start drawing';
    //
    // if (sketch) {
    //     const geom = sketch.getGeometry();
    //     if (geom instanceof ol.geom.Polygon) {
    //         helpMsg = continuePolygonMsg;
    //     } else if (geom instanceof ol.geom.LineString) {
    //         helpMsg = continueLineMsg;
    //     }
    // }
    //
    // helpTooltipElement.innerHTML = helpMsg;
    // helpTooltip.setPosition(evt.coordinate);
    //
    // helpTooltipElement.classList.remove('hidden');
};

const mouseOutHandler = function () {
    helpTooltipElement.classList.add('hidden');
}

const contextMenuHandler = function () {
    cancelMeasure();
}

let draw; // global so we can remove it later
let listener;


/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
const formatLength = function (line) {
    const length = ol.sphere.getLength(line, {projection: gMap.getMap().getView().getProjection()});
    let output;
    if (length > 100) {
        output = (Math.round(length / 1000 * 100) / 100) + ' km';
    } else {
        output = (Math.round(length * 100) / 100) + ' m';
    }
    return output;
};


/**
 * Format area output.
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
const formatArea = function (polygon) {
    const area = ol.sphere.getArea(polygon, {projection: gMap.getMap().getView().getProjection()});
    let output;
    if (area > 10000) {
        output = (Math.round(area / 1000000 * 100) / 100) + ' km<sup>2</sup>';
    } else {
        output = (Math.round(area * 100) / 100) + ' m<sup>2</sup>';
    }
    return output;
};


//将给定的互动添加到地图中
function addInteraction() {
    const type = (typeSelect === MeasureType_area ? 'Polygon' : typeSelect === MeasureType_line ? 'LineString' : typeSelect === MeasureType_rect ? 'Circle' : undefined);
    const func = (typeSelect === MeasureType_rect ? ol.interaction.Draw.createBox() : undefined);
    draw = new ol.interaction.Draw({
        source: source,
        type: type,
        geometryFunction: func,
        style: new ol.style.Style({
            fill: new ol.style.Fill({  //矢量图层填充颜色，以及透明度
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({ //边界样式
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({ //图片框选的样式
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    draw.on('drawstart', function (evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        let tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function (evt) {
            const geom = evt.target;
            let output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function (evt) {
        console.info(evt.feature.getGeometry().getCoordinates())
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);
    });
    gMap.getMap().addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    // if (helpTooltipElement) {
    //     helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    // }
    // helpTooltipElement = document.createElement('div');
    // helpTooltipElement.className = 'ol-tooltip hidden';
    // helpTooltip = new ol.Overlay({
    //     element: helpTooltipElement,
    //     stopEvent: false,
    //     offset: [15, 0],
    //     positioning: 'center-left'
    // });
    // gMap.getMap().addOverlay(helpTooltip);
}

function clearHelpTooltip() {
    // gMap.getMap().removeOverlay(helpTooltip)
}

let measureTooltips = [];

/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    if (measureTooltip) {
        measureTooltips.push(measureTooltip);
    }
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        stopEvent: false,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    gMap.getMap().addOverlay(measureTooltip);
}

function clearMeasureTooltip() {
    gMap.getMap().removeOverlay(measureTooltip);
}

function clearMeasureTooltips() {
    for (let i = 0; i < measureTooltips.length; i++) {
        gMap.getMap().removeOverlay(measureTooltips[i]);
    }
    measureTooltips.splice(0);
}

function regLis() {
    if (breg == false) {
        gMap.getMap().on('pointermove', pointerMoveHandler);

        gMap.getMap().on('mouseout', mouseOutHandler);

        gMap.getMap().on('contextmenu', contextMenuHandler);
        breg = true;
    }
}

function unregLis() {
    if (breg == true) {
        if (helpTooltipElement) {
            helpTooltipElement.classList.add('hidden');
        }

        gMap.getMap().un('pointermove', pointerMoveHandler);

        gMap.getMap().un('mouseout', mouseOutHandler);

        gMap.getMap().un('contextmenu', contextMenuHandler);
        breg = false;
    }
}

/**
 * Let user change the geometry type.
 */
function startMeasure(typeSel) {
    if (binit == false) {
        gMap.getMap().addLayer(vector);
        binit = true;
    }
    regLis();
    typeSelect = typeSel;
    gMap.getMap().removeInteraction(draw);
    addInteraction();
};

function cancelMeasure() {
    gMap.getMap().removeInteraction(draw);
    unregLis();
    clearHelpTooltip();
    clearMeasureTooltip();
};

function clearMeasure() {
    source.clear();
    clearMeasureTooltips();
};


var routeXY;

//绘制路线
function drawRoute(val) {
    if (binit == false) {
        gMap.getMap().addLayer(vector);
        binit = true;
    }
    regLis();
    typeSelect = MeasureType_line;
    gMap.getMap().removeInteraction(draw);
    setRoute(val);
};

function setRoute(val) {
    draw = new ol.interaction.Draw({
        source: source,
        type: "LineString",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    draw.on('drawstart', function (evt) {
        sketch = evt.feature;
        let tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function (evt) {
            const geom = evt.target;
            let output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function (evt) {
        window.parent.document.getElementById("operator").contentWindow.vm.handleRoute(evt.feature.getGeometry().getCoordinates());
        clearMeasure();
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);
        var postRenderHandler = function () {
            vector.un('postrender', postRenderHandler);
            cancelMeasure();
        }
        vector.on('postrender', postRenderHandler);

    });
    gMap.getMap().addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

}


//绘制查询矩形
function drawSearchRect(val) {
    if (binit == false) {
        gMap.getMap().addLayer(vector);
        binit = true;
    }
    regLis();
    typeSelect = MeasureType_rect;
    gMap.getMap().removeInteraction(draw);
    setRect(val);
};

function setRect(val) {
    draw = new ol.interaction.Draw({
        source: source,
        type: "Circle",
        geometryFunction: ol.interaction.Draw.createBox(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    draw.on('drawstart', function (evt) {
        sketch = evt.feature;
        let tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function (evt) {
            const geom = evt.target;
            let output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function (evt) {
        handleSearch(evt.feature.getGeometry().getCoordinates());
        clearMeasure();
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);

        var postRenderHandler = function () {
            vector.un('postrender', postRenderHandler);
            cancelMeasure();
        }
        vector.on('postrender', postRenderHandler);
    });
    gMap.getMap().addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

}


//绘制管护范围
function drawProtectRegion(val) {
    if (binit == false) {
        gMap.getMap().addLayer(vector);
        binit = true;
    }
    regLis();
    typeSelect = MeasureType_rect;
    gMap.getMap().removeInteraction(draw);
    setProtectRegion(val);
};

function setProtectRegion(val) {
    draw = new ol.interaction.Draw({
        source: source,
        type: "Polygon",
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    draw.on('drawstart', function (evt) {
        sketch = evt.feature;
        let tooltipCoord = evt.coordinate;

        listener = sketch.getGeometry().on('change', function (evt) {
            const geom = evt.target;
            let output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function (evt) {
        window.parent.document.getElementById("tableFrame").contentWindow.vm.handleRegion(evt.feature.getGeometry().getCoordinates()[0]);
        clearMeasure();
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        ol.Observable.unByKey(listener);
        var postRenderHandler = function () {
            vector.un('postrender', postRenderHandler);
            cancelMeasure();
            back2Table();
        }
        vector.on('postrender', postRenderHandler);

    });
    gMap.getMap().addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

}


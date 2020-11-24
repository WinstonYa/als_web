const selsource = new ol.source.Vector();
const selvector = new ol.layer.Vector({
    source: selsource,
    style: new ol.style.Style({
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

let bselinit = false;
let bselreg = false;


/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
let selhelpTooltipElement;


/**
 * ol.Overlay to show the help messages.
 * @type {ol.Overlay}
 */
let selhelpTooltip;

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
let selTooltipElement;
let selFrameElement;

/**
 * ol.Overlay to show the help messages.
 * @type {ol.Overlay}
 */
let selTooltip;


/**
 * Handle pointer move.
 * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
 */
const selpointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }

    selhelpTooltip.setPosition(evt.coordinate);

    selhelpTooltipElement.classList.remove('hidden');
};

const selmouseOutHandler = function () {
    selhelpTooltip.setPosition();
}

const selcontextMenuHandler = function () {
    cancelMeasure();
}

let seldraw; // global so we can remove it later

function seladdInteraction(url) {
    if (!seldraw) {
        seldraw = new ol.interaction.Draw({
            source: selsource,
            type: 'Point',
            style: new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.7)'
                    }),
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 0.2)'
                    })
                })
            }),
            condition: function (evt) {
                // console.log(evt);
                if (evt.originalEvent.button === 2) {
                    cancelSel();
                    selclearHelpTooltip();
                    return false;
                } else if (evt.originalEvent.button === 0) {
                    // let feats = hoverIntePos.getFeatures();
                    // if(feats.getLength() !== 0) {
                    //     clearSel();
                    //     let coord = feats.item[0].getGeometry().getCoordinates();
                    //     selFrameElement.contentWindow.vm.setCoordination(coord, addPosSucCallback);
                    //     selTooltip.setPosition(coord);
                    //     return false;
                    // }
                    return true;
                } else {
                    return false;
                }
            }
        });

        seldraw.on('drawend', function (evt) {
            clearSel();
            selFrameElement.contentWindow.vm.setCoordination(evt.feature.getGeometry().getCoordinates(), addPosSucCallback, changePosCallback);
            selTooltip.setPosition(evt.feature.getGeometry().getCoordinates());
        });
    }

    gMap.getMap().addInteraction(seldraw);

    selcreateHelpTooltip();
    selcreateTooltip(url);
}


/**
 * Creates a new selection tooltip
 */
function selcreateTooltip(url) {

    if (!selTooltip) {
        if (selTooltipElement) {
            selTooltipElement.parentNode.removeChild(selTooltipElement);
        }
        selTooltipElement = document.createElement('div');
        selTooltipElement.className = 'ol-popup';
        selTooltipElement.style.width = '350px';
        selTooltipElement.style.height = '400px';
        selTooltipElement.style.paddingLeft = '0px';
        selTooltipElement.style.paddingRight = '0px';

        // console.log(selTooltipElement);
        selTooltip = new ol.Overlay({
            element: selTooltipElement,
            autoPan: true,
            autoPanMargin: 30,
        });
        gMap.getMap().addOverlay(selTooltip);
    }
    selTooltipElement.innerHTML = '<iframe src='+url+' style="border: 0; width:100%; height: 100%"></iframe>\n' +
        '        <a href="#" class="ol-popup-closer"></a>';
    selFrameElement = selTooltipElement.children[0];
    selTooltipElement.children[1].addEventListener("click", function () {
        selclearTooltip();
    });
}

function selclearTooltip() {
    if (selTooltip) {
        clearSel();
        selTooltip.setPosition();
    }
}

/**
 * Creates a new help tooltip
 */
function selcreateHelpTooltip() {
    if (!selhelpTooltip) {
        if (selhelpTooltipElement) {
            selhelpTooltipElement.parentNode.removeChild(selhelpTooltipElement);
        }
        selhelpTooltipElement = document.createElement('div');
        selhelpTooltipElement.className = 'ol-tooltip hidden';
        // helpTooltipElement.css('pointer-events', 'none');
        selhelpTooltipElement.innerHTML = '请点击地图添加点位数据'
        selhelpTooltip = new ol.Overlay({
            element: selhelpTooltipElement,
            stopEvent: false,
            offset: [15, 0],
            positioning: 'center-left'
        });
        gMap.getMap().addOverlay(selhelpTooltip);
    }
}

function selclearHelpTooltip() {
    if (selhelpTooltip) {
        selhelpTooltip.setPosition(undefined);
    }
}

function selregLis() {
    if (bselreg == false) {
        gMap.getMap().on('pointermove', selpointerMoveHandler);

        gMap.getMap().on('mouseout', selmouseOutHandler);

        gMap.getMap().on('click', selcontextMenuHandler);
        bselreg = true;
    }
}

function selunregLis() {
    if (bselreg == true) {
        if (selhelpTooltipElement) {
            selhelpTooltipElement.classList.add('hidden');
        }

        gMap.getMap().un('pointermove', selpointerMoveHandler);

        gMap.getMap().un('mouseout', selmouseOutHandler);

        gMap.getMap().un('contextmenu', selcontextMenuHandler);
        bselreg = false;
    }
}

function changePosCallback(lon, lat) {
    var tmpFeas = selsource.getFeatures();
    if(tmpFeas.length === 1){
        tmpFeas[0].getGeometry().setCoordinates([lon, lat])
    }
    selTooltip.setPosition([lon, lat]);
}

function addPosSucCallback() {
    selclearTooltip();
    refreshPosData();
}

/**
 * Let user change the geometry type.
 */
function startSel1(typeSel) {
    if (bselinit == false) {
        gMap.getMap().addLayer(selvector);
        bselinit = true;
    }
    selregLis();
    typeSelect = typeSel;
    gMap.getMap().removeInteraction(seldraw);
    seladdInteraction("../../html/alsm/pointPosition/pointDetails.html");
};


var formId;
var formName;
var name;
var typeCode;
var typeName;
var oldIcon;
function reLoadTable() {
    document.getElementById("dataShow").contentWindow.vm.loadData();
}
function reLoadTree() {
    document.getElementById("dataShow").contentWindow.vm.getTree();
}

function startSel2(formId0,formName0,name0,typeCode0,typeName0,oldIcon0) {
    if (bselinit == false) {
        gMap.getMap().addLayer(selvector);
        bselinit = true;
    }
    selregLis();
    gMap.getMap().removeInteraction(seldraw);
    formId=formId0;
    formName=formName0;
    name=name0;
    typeCode=typeCode0;
    typeName=typeName0;
    oldIcon=oldIcon0;
    seladdInteraction("../../html/alsm/details/pointDetails.html");
};

function cancelSel() {
    gMap.getMap().removeInteraction(seldraw);
    selunregLis();
    selclearHelpTooltip();
};

function clearSel() {
    selsource.clear();
}

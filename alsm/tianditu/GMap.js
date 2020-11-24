function EventTarget() {
    var handlers = {};

    this.addHandler = function (type, handler) {
        if (typeof (handlers[type]) == 'undefined') {
            handlers[type] = [];
        }
        handlers[type].push(handler);
    }
    this.fire = function (eve) {
        if (!eve.target) {
            event.target = this;
        }
        if (handlers[eve.type] instanceof Array) {
            for (var i = 0, len = handlers[eve.type].length; i < len; i++) {
                handlers[eve.type][i](eve);
            }
        }
    }
    this.fire2 = function (eve) {
        alert(0);
    }
    this.removeHandler = function (type, handler) {
        if (handlers[type] instanceof Array) {
            var handlers = handlers[type];
            for (var i = 0, len = handlers.length; i < len; i++) {
                if (handlers[i] === handler) {
                    break;
                }
            }
            handlers.splice(i, 1);
        }
    }
}

const displayProjection = "EPSG:4326";
// ssy proj
// const displayProjection = "EPSG:3857";
const tdtProjection = "EPSG:4490";

proj4.defs("EPSG:4490", "GEOGCS[\"China Geodetic Coordinate System 2000\",DATUM[\"China_2000\",SPHEROID[\"CGCS2000\",6378137,298.257222101,AUTHORITY[\"EPSG\",\"1024\"]],AUTHORITY[\"EPSG\",\"1043\"]],PRIMEM[\"Greenwich\",0,AUTHORITY[\"EPSG\",\"8901\"]],UNIT[\"degree\",0.0174532925199433,AUTHORITY[\"EPSG\",\"9122\"]],AUTHORITY[\"EPSG\",\"4490\"]]");
ol.proj.proj4.register(proj4);

var getWmtsTileGrid = function (proj, maxLevel) {
    maxLevel = maxLevel || 18;
    let projection = ol.proj.get(proj);
    let projectionExtent = projection.getExtent();
    let origin = projectionExtent ? ol.extent.getTopLeft(projectionExtent) : [-180, 90];

    let fromLonLat = ol.proj.getTransform(displayProjection, projection);
    let width = projectionExtent ? ol.extent.getWidth(projectionExtent) : ol.extent.getWidth(ol.extent.applyTransform([-180.0, -90.0, 180.0, 90.0], fromLonLat));
    let resolutions = [];
    let matrixIds = [];
    for (let z = 1; z <= maxLevel; z++) {
        resolutions[z] = width / (256 * Math.pow(2, z));
        matrixIds[z] = z;
    }
    ;

    return new ol.tilegrid.WMTS({
        origin: origin,
        resolutions: resolutions,
        matrixIds: matrixIds
    });
}
var getXyzTileGrid = function (proj) {
    return new ol.tilegrid.TileGrid({
        origin: origin,
        resolutions: resolutions,
        matrixIds: matrixIds
    });
}

/**
 * 封装一个GNSSMap类，来实现天地图前端网络链路监控界面。
 * http://t0.tianditu.gov.cn/cta_c/wmts?tk=c9039b4c69d61337387e74355424ddce&SERVICE=WMTS&REQUEST=GetCapabilities
 * @return
 */
function GNSSMap() {
    /**
     * 地图对象
     */
    var map = null;

    /**
     * 数据源列表。
     */
    var vSource_bhz = null;

    //var vSource_jb = null;

    var vSource_sjcj = null;
    var vSource_ywcj = null;
    var vSource_xmsjgl = null;
    var vSource_gytd = null;
    var vSource_yd = null;
    var vSource_hwxj = null;
    var vSource_txjz = null;
    var vSource_qxz = null;

    var vSource_jb = null;
    var vSource_jz = null;
    var vSource_xcp = null;
    var vSource_bhd = null;
    var vSource_lwt = null;
    var vSource_gs = null;

    var vSource_lyd = null;

    var vSource_jgd = null;
    var vSource_dz = null;
    var vSource_sk = null;
    var vSource_qxz = null;
    var vSource_jmd = null;
    var vSource_dm = null;
    var vSource_gnqh = null;
    var vSource_jcsj = null;
    var vSource_jtb = null;

    var vSource_xb = null;
    var vSource_lq = null;
    var vSource_bdzy = null;
    var vSource_xhss = null;    //地图定位
    var vSource_com = null;
    var vSource_xhlxbyid = null; //巡护路线
    var vSource_xz = null;
    var vSource_spjk = null; //视频监控
    var vSource_xhzs = null; //巡护值守

    var vsource_photos = null; //照片
    var vsource_photos2 = null; //照片
    var vsource_photos3 = null; //照片
    var vsource_photos4 = null; //照片

    var vSource_lw = null; //路网

    /**
     * 图层列表。
     */
    var layes = null;

    // 矢量编辑控件。
    var controls;
    var measureControls;

    var vLayer_bhz = null;

    //var vLayer_jb = null;

    var vLayer_sjcj = null;
    var vLayer_ywcj = null;
    var vLayer_xmsjgl = null;
    var vLayer_gytd = null;
    var vLayer_yd = null;
    var vLayer_hwxj = null;
    var vLayer_txjz = null;
    var vLayer_qxz = null;

    var vLayer_jb = null;
    var vLayer_jz = null;
    var vLayer_xcp = null;
    var vLayer_bhd = null;
    var vLayer_lwt = null;
    var vLayer_gs = null;

    var vLayer_lyd = null;

    var vLayer_jgd = null;
    var vLayer_dz = null;
    var vLayer_sk = null;
    var vLayer_qxz = null;
    var vLayer_jmd = null;
    var vLayer_dm = null;
    var vLayer_gnqh = null;
    var vLayer_jcsj = null;
    var vLayer_jtb = null;

    var vLayer_xb = null;
    var vLayer_lq = null;
    var vLayer_bdzy = null;
    var vLayer_xhss = null;    //地图定位
    var vLayer_com = null;
    var vLayer_xhlxbyid = null; //巡护路线
    var vLayer_xz = null;
    var vLayer_spjk = null; //视频监控
    var vLayer_xhzs = null; //巡护值守


    var vlayer_photos = null; //照片
    var vlayer_photos2 = null; //照片
    var vlayer_photos3 = null; //照片
    var vlayer_photos4 = null; //照片

    var layers_blh = null;
    var layers_G7 = null;
    var layersmtxb_ldsuyq = null;
    var layersmtxb_ldsiyq = null;
    var layersmtxb_lmsuyq = null;
    var layersmtxb_lmsiyq = null;
    var layersmtxb_nl = null;

    var zt_ztlayers = null;

    var test123layer = null;
    var vLayer_setline = null;

    var vLayer_lw = null; //路网

    var control;
    /**
     * 基准站矢量图层。
     */
    var vLayer = null;
    var vLayer_problem = null;
    var vLayer_streamError = null;
    var vLayer_error = null;

    var vectors;

    var style_bhz = null;
    var style_jb = null;
    var style_jz = null;
    var style_xcp = null;
    var style_bhd = null;
    var style_lwt = null;
    var style_gs = null;
    var style_jcsj = null;
    var style_sjcj = null;
    var style_ywcj = null;
    var style_xmsjgl = null;
    var style_gytd = null;
    var style_yd = null;
    var style_hwxj = null;
    var style_txjz = null;
    var style_qxz = null;
    var style_lyd = null;

    var style_jgd = null;
    var style_dz = null;
    var style_sk = null;
    var style_qxz = null;
    var style_jmd = null;
    var style_dm = null;
    var style_gnqh = null;
    var style_jtb = null;
    var style_bdzy = null;
    var style_xhss = null;
    var style_xhlxbyid = null; //巡护路线
    var style_xz = null;
    /**    * 基准站正常样式。*/
    var style_spjk = null;
    /**    * 视频监控。*/
    var style_xhzs = null; /*巡护值守*/

    var style_ok = null;
    /**
     * 基准站曾有故障记录样式。
     */
    var style_problem = null;
    /**
     * 基准站故障样式。
     */
    var style_error = null;
    /**
     * 数据流中断。
     */
    var style_streamError = null;


    /**
     * 中心点位置与缩放比例尺。
     */

    var style_lw = null; //路网

    var centerPoint = null;
    var pppoints = [];


    /**
     * 点击选择控件。
     */
    var sFeature;

    /**
     * 气泡选择器。
     */
    var qFeature;

    /**
     * 框选控件。
     */
    var kFeature;

    var eventTarget;

    var mouseHD;

    var msOBJ;
    var isGetPositionFlag = false;
    var isGetPositionFlag2 = false;
    var getPosition = null;

    var com_layers = null;
    var allyw_layers = null;

    var siteMouseOver = function (currentFeature) {
        if (eventTarget != null) {
            eventTarget.fire({
                type: "mouseover",
                target: currentFeature
            });
        }
    };
    var siteMouseOut = function (currentFeature) {
        if (eventTarget != null) {
            eventTarget.fire({
                type: "mouseout",
                target: currentFeature
            });
        }
    };
    var siteMouseClick = function (currentFeature) {
        if (eventTarget != null) {
            eventTarget.fire({
                type: "mouseclick",
                target: currentFeature
            });
        }
    };

    var onClickSelect = function (currentFeature) {

        if (eventTarget != null) {
            currentFeature.selected = "1";
            eventTarget.fire({
                type: "clickSelect",
                target: currentFeature
            });
        }
    };
    var onUnClickSelect = function (currentFeature) {
        if (eventTarget != null) {
            currentFeature.selected = "0";
            eventTarget.fire({
                type: "clickUnSelect",
                target: currentFeature
            });
        }
    };

    // 鼠标拉框选择
    var multipleSFOptions = {
        onSelect: function (currentFeature) {
            currentFeature.selected = "1";
        },
        onUnselect: function (currentFeature) {
            currentFeature.selected = "0";
        },

        clickout: true,
        toggle: false,
        multiple: true,
        hover: false,
        toggleKey: "ctrlKey", // ctrl key removes from selection
        multipleKey: "shiftKey", // shift key adds to selection
        box: true
    };

    // 鼠标拉框选择
    var qipaoSFOptions = {
        onSelect: function (currentFeature) {
            currentFeature.selected = "1";
        },
        onUnselect: function (currentFeature) {
            currentFeature.selected = "0";
        },

        clickout: true,
        toggle: false,
        multiple: true,
        hover: true,
        toggleKey: "ctrlKey", // ctrl key removes from selection
        multipleKey: "shiftKey", // shift key adds to selection
        box: true
    };

    var initFeatureStyleOne = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = true;
        style1.stroke = false;
        style1.strokeColor = "#ffffff";
        style1.strokeOpacity = 0;
        style1.strokeWidth = "0px";
        style1.fillColor = "#ffffff";
        style1.fillOpacity = 0;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#ffffff";
        style1.fontSize = "14px";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 0;
        style1.labelXOffset = 15;
        style1.labelYOffset = -3;


        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style1.stroke = false;
        style2.strokeColor = "#ffffff";
        style2.strokeOpacity = 0;
        style2.strokeWidth = "0px";
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        style2.cursor = "default";
        style2.pointRadius = 0;
        style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };
    //蒙古包
    var initFeatureStyleOneMGB = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        // ssy style
        var style = function (feature, resolution) {
            return new ol.style.Style({
                // fill: new ol.style.Fill({
                //     color: "#ffffff" + "00"
                // }),
                // stroke: new ol.style.Stroke({
                //     color: "#ffffff" + "00",
                //     width: 0
                // }),
                image: new ol.style.Icon({
                    src: surls[0],
                    size: [imgW, imgH],
                    opacity: 1.0
                }),
                text: new ol.style.Text({
                    font: 'bold 16px serif',
                    text: feature.name,
                    fill: new ol.style.Fill({
                        color: "#f90516"
                    }),
                    offsetX: -15,
                    offsetY: 3,
                    backgroundFill: new ol.style.Fill({
                        color: "#efefef"
                    }),
                    backgroundStroke: new ol.style.Stroke({
                        color: "#cfcfcf"
                    })
                })
            });
        }
        return style;
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = true;
        style1.stroke = false;
        style1.strokeColor = "#ffffff";
        style1.strokeOpacity = 0;
        style1.strokeWidth = "0px";
        style1.fillColor = "#ffffff";
        style1.fillOpacity = 0;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#f90516";
        style1.fontSize = "16px";
        style1.labelAlign = "rb";
        style1.labelOutlineWidth = 0;
        style1.labelXOffset = -15;
        style1.labelYOffset = 3;
        style1.labelPadding = "3px";
        style1.labelBackgroundColor = "#efefef";
        style1.labelBorderColor = "#cfcfcf";

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style1.stroke = false;
        style2.strokeColor = "#ffffff";
        style2.strokeOpacity = 0;
        style2.strokeWidth = "0px";
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        style2.cursor = "default";
        style2.pointRadius = 0;
        style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };
    //小班样式
    var initFeatureStyleOne2 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = true;
        style1.stroke = true;
        style1.strokeColor = "#478FD7";
        style1.strokeOpacity = 1;
        style1.strokeWidth = 2;
        style1.fillColor = "#478FD7";
        style1.fillOpacity = 0.3;
        //style1.strokeLinecap = "square";
        //style1.strokeDashstyle = "solid";

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${fourChar}";
        style1.fontColor = "#ffffff";
        style1.fontSize = "15px";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 0;

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = true;
        style1.stroke = true;
        style2.strokeColor = "#478FD7";
        style2.strokeOpacity = 1;
        style2.strokeWidth = 2;
        style2.fillColor = "#478FD7";
        style2.fillOpacity = 0.3;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        //style2.cursor = "default";
        style2.pointRadius = 0;
        //style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    //林权样式
    var initFeatureStyleOne3 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = true;
        style1.stroke = true;
        style1.strokeColor = "#fd0505";
        style1.strokeOpacity = 1;
        style1.strokeWidth = 2;
        style1.fillColor = "#fd0505";
        style1.fillOpacity = 0.1;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#fd0505";
        style1.fontSize = "14px";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 4;

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = true;
        style2.stroke = true;
        style2.strokeColor = "#fd0505";
        style2.strokeOpacity = 1;
        style2.strokeWidth = 2;
        style2.fillColor = "#fd0505";
        style2.fillOpacity = 0.3;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        //style2.cursor = "default";
        style2.pointRadius = 0;
        //style2.label = "${name}";
        style2.fontColor = "#fd0505";
        style2.fontSize = "15px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    var initFeatureStyleLW = function () {
        // ssy style
        var style = function (feature, resolution) {
            return new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: feature.color.colorRgbaArray(0.8),
                    width: feature.width
                })
            });
        }
        return style;
    }

    //功能区划样式
    var initFeatureStyleOne4 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        // ssy style
        var style = function (feature, resolution) {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    // color: "#794215"
                    color: "#794215".colorRgbaArray(0.1)
                }),
                stroke: new ol.style.Stroke({
                    color: feature.color.colorRgbaArray(0.8),
                    width: 5
                }),
                image: new ol.style.Icon({
                    src: surls[0],
                    size: [imgW, imgH],
                    opacity: 1.0
                }),
                text: new ol.style.Text({
                    font: 'bold 16px serif',
                    placement: 'point',
                    text: feature.fourChar,
                    fill: new ol.style.Fill({
                        color: "#94edfd"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#3b43e1",
                        width: 8
                    }),
                    // offsetX: 0,
                    // offsetY: -80,
                    textAlign: "center"
                })
            });
        }
        return style;
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = false;
        style1.stroke = true;
        //style1.strokeColor = "#FF0000";
        style1.strokeColor = "${color}";
        style1.strokeOpacity = 0.8;
        style1.strokeWidth = 5;
        style1.fillColor = "#794215";
        style1.fillOpacity = 0.5;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${fourChar}";
        style1.fontColor = "#94edfd";
        style1.fontSize = 16;
        style1.labelAlign = "rb";
        style1.labelOutlineColor = "#3b43e1",
            style1.labelOutlineWidth = 8;
        style1.labelXOffset = 0;
        style1.labelYOffset = -80;

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style2.stroke = true;
        //style2.strokeColor = "#FF0000";
        style2.strokeColor = "${color}";
        //style2.strokeOpacity = 3;
        style2.strokeWidth = 3;
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0.5;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        //style2.cursor = "default";
        style2.pointRadius = 0;
        //style2.label = "${name}";
        style2.fontColor = "${color}";
        style2.fontSize = "14px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;
        style1.labelXOffset = "${xoffset}";
        style1.labelYOffset = "${yoffset}";

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };


    //图幅样式
    var initFeatureStyleOne5 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        // ssy style
        var style = function (feature, resolution) {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "#794215".colorRgbaArray(0.2)
                }),
                stroke: new ol.style.Stroke({
                    color: feature.color,
                    width: 2
                }),
                image: new ol.style.Icon({
                    src: surls[0],
                    size: [imgW, imgH],
                    opacity: 1.0
                }),
                text: new ol.style.Text({
                    font: '14px serif',
                    text: feature.fourChar,
                    fill: new ol.style.Fill({
                        color: "#94edfd"
                    }),
                    stroke: new ol.style.Stroke({
                        color: feature.color,
                        width: 8
                    }),
                    offsetX: feature.xoffset,
                    offsetY: feature.yoffset
                })
            });
        }
        return style;
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = false;
        style1.stroke = true;
        style1.strokeColor = "#ffffff";
        style1.strokeOpacity = 1;
        style1.strokeWidth = 3;
        style1.fillColor = "#794215";
        style1.fillOpacity = 0.5;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#ffffff";
        style1.fontSize = "12px";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 0;
        style1.labelXOffset = -60;
        //style1.labelYOffset = -3;
        style1.labelYOffset = 8;

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style2.stroke = true;
        style2.strokeColor = "#ffffff";
        style2.strokeOpacity = 1;
        style2.strokeWidth = 3;
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0.5;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        //style2.cursor = "default";
        style2.pointRadius = 0;
        //style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    //本地资源样式
    var initFeatureStyleOne6 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = false;
        style1.stroke = true;
        style1.strokeColor = "#2E64DE";
        style1.fillColor = "#794215";
        style1.fillOpacity = 0.5;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#ffffff";
        style1.fontSize = "5px";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 0;
        style1.labelXOffset = 10;
        style1.labelYOffset = -3;

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style2.stroke = true;
        style2.strokeColor = "#2E64DE";
        style2.strokeOpacity = 0;
        style2.strokeWidth = "0px";
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0.5;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        //style2.cursor = "default";
        style2.pointRadius = 0;
        //style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    //资源采集
    var initFeatureStyleOne7 = function (imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        var style1 = ol.Util.extend({},
            new Geo.Style());

        style1.fill = true;
        style1.stroke = false;
        style1.strokeColor = "#ffffff";
        style1.strokeOpacity = 0;
        style1.strokeWidth = "0px";
        style1.fillColor = "#ffffff";
        style1.fillOpacity = 0;


        style1.externalGraphic = "${img}";
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#ffffff";
        style1.fontSize = "12px";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 0;
        style1.labelXOffset = 15;
        style1.labelYOffset = -3;

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style2.stroke = false;
        style2.strokeColor = "#ffffff";
        style2.strokeOpacity = 0;
        style2.strokeWidth = "0px";
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0;

        style2.externalGraphic = "${img}";
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        style2.cursor = "default";
        style2.pointRadius = 0;
        style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    //巡护路线
    var initFeatureStyleOne8 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = true;
        //style1.fillColor = "#00ffff";
        style1.stroke = true;
        style1.strokeColor = "${color}";
        style1.strokeOpacity = 0.9;
        style1.strokeWidth = 4;
        //style1.pointRadius = 3;
        style1.fillColor = "#ffffff";
        style1.fillOpacity = 0;

        style1.externalGraphic = "${img}";
        style1.graphic = true;
        style1.graphicWidth = "${size}";
        style1.graphicHeight = "${size}";
        //style1.backgroundGraphic = "${pic}";
        style1.backgroundWidth = 60;
        style1.backgroundHeight = 60;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#ffffff";
        style1.fontSize = "${fontSize}";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 0;
        style1.labelXOffset = 15;
        style1.labelYOffset = -3;
        //style1.labelXOffset = "${labelXOffset}";
        //style1.labelYOffset = "${labelYOffset}";
        //style1.backgroundXOffset = "${backgroundXOffset}";
        //style1.backgroundYOffset = "${backgroundYOffset}";
        //style1.graphicXOffset = "${graphicXOffset}";
        //style1.graphicYOffset = "${graphicYOffset}";

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style1.stroke = true;
        style2.strokeColor = "${color}";
        style2.strokeOpacity = 0.9;
        style2.strokeWidth = 4;
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0;

        style2.externalGraphic = "${img}";
        style2.graphic = true;
        style2.graphicWidth = "${size}";
        style2.graphicHeight = "${size}";
        //style2.backgroundGraphic = "${pic}";
        style2.backgroundWidth = 60;
        style2.backgroundHeight = 60;
        style2.graphicOpacity = 1.0;
        style2.cursor = "default";
        style2.pointRadius = 0;
        style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "${fontSize}";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;
        //style2.backgroundXOffset = "${backgroundXOffset}";
        //style2.backgroundYOffset = "${backgroundYOffset}";
        //style2.graphicXOffset = "${graphicXOffset}";
        //style2.graphicYOffset = "${graphicYOffset}";

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    //乡镇区划样式
    var initFeatureStyleOne9 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        // ssy style
        var style = function (feature, resolution) {
            return new ol.style.Style({
                fill: new ol.style.Fill({
                    color: "#794215".colorRgbaArray(0.2)
                }),
                stroke: new ol.style.Stroke({
                    color: feature.color,
                    width: 2
                }),
                image: new ol.style.Icon({
                    src: surls[0],
                    size: [imgW, imgH],
                    opacity: 1.0
                }),
                text: new ol.style.Text({
                    font: '14px serif',
                    text: feature.fourChar,
                    fill: new ol.style.Fill({
                        color: feature.color
                    }),
                    offsetX: feature.xoffset,
                    offsetY: feature.yoffset
                })
            });
        }
        return style;
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = true;
        style1.stroke = true;
        //style1.strokeColor = "#FF0000";
        style1.strokeColor = "${color}";
        //style1.strokeOpacity = 1;
        style1.strokeWidth = 2;
        style1.fillColor = "#794215";
        style1.fillOpacity = 0.2;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${fourChar}";
        style1.fontColor = "${color}";
        style1.fontSize = 14;
        style1.labelAlign = "lb";
        style1.labelOutlineColor = "#ffffff",
            style1.labelOutlineWidth = 0;
        style1.labelXOffset = "${xoffset}";
        style1.labelYOffset = "${yoffset}";

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style2.stroke = true;
        //style2.strokeColor = "#FF0000";
        style2.strokeColor = "${color}";
        //style2.strokeOpacity = 3;
        style2.strokeWidth = 2;
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0.5;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        //style2.cursor = "default";
        style2.pointRadius = 0;
        //style2.label = "${name}";
        style2.fontColor = "${color}";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;
        style1.labelXOffset = "${xoffset}";
        style1.labelYOffset = "${yoffset}";

        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    //事件上报（显示上传的图片）
    var initFeatureStyleOne10 = function (surls, imgW, imgH, imgW1, imgH1) {
        var styles = new Array();
        var style1 = ol.Util.extend({},
            new Geo.Style());
        style1.fill = true;
        style1.stroke = false;
        style1.strokeColor = "#ffffff";
        style1.strokeOpacity = 0;
        style1.strokeWidth = "0px";
        style1.fillColor = "#ffffff";
        style1.fillOpacity = 0;

        style1.externalGraphic = surls[0];
        style1.graphic = true;
        style1.graphicWidth = imgW;
        style1.graphicHeight = imgH;
        style1.backgroundGraphic = "${pic}";
        style1.backgroundWidth = imgW;
        style1.backgroundHeight = imgH;
        style1.graphicOpacity = 1.0;
        style1.cursor = "default";
        style1.pointRadius = 0;
        style1.label = "${name}";
        style1.fontColor = "#ffffff";
        style1.fontSize = "12px";
        style1.labelAlign = "lb";
        style1.labelOutlineWidth = 0;
        style1.labelXOffset = 30;
        style1.labelYOffset = -3;

        var style2 = ol.Util.extend({},
            new Geo.Style());

        style2.fill = false;
        style1.stroke = false;
        style2.strokeColor = "#ffffff";
        style2.strokeOpacity = 0;
        style2.strokeWidth = "0px";
        style2.fillColor = "#ffffff";
        style2.fillOpacity = 0;

        style2.externalGraphic = surls[1];
        style2.graphic = true;
        style2.graphicWidth = imgW1;
        style2.graphicHeight = imgH1;
        style2.backgroundGraphic = "${pic}";
        style2.backgroundWidth = imgW1;
        style2.backgroundHeight = imgH1;
        style2.graphicOpacity = 1.0;
        style2.cursor = "default";
        style2.pointRadius = 0;
        style2.label = "${name}";
        style2.fontColor = "#ffffff";
        style2.fontSize = "12px";
        style2.labelAlign = "lb";
        style2.labelOutlineWidth = 0;
        styles[0] = style1;
        styles[1] = style2;

        return styles;
    };

    /**
     * 初始化元素样式。
     */
    //振声
    this.initFeatureStyleZS = function (bhzurl, lydurl, jgdurl, dzurl, skurl, qxzurl, jmdurl, ydurl, hwxjurl, dmurl, xhddurl) {
        style_bhz = initFeatureStyleOne(bhzurl, 21, 25, 25, 32);

        style_lyd = initFeatureStyleOne(lydurl, 21, 25, 25, 32);
        style_jgd = initFeatureStyleOneMGB(jgdurl, 21, 25, 25, 32);
        style_dz = initFeatureStyleOne(dzurl, 21, 25, 25, 32);
        style_sk = initFeatureStyleOne(skurl, 32, 32, 25, 32);
        style_qxz = initFeatureStyleOne(qxzurl, 21, 25, 25, 32);
        style_jmd = initFeatureStyleOne(jmdurl, 16, 16, 16, 16);
        style_yd = initFeatureStyleOne(ydurl, 21, 25, 25, 32);
        style_hwxj = initFeatureStyleOne(hwxjurl, 21, 25, 25, 32);
        style_dm = initFeatureStyleOne("", 21, 25, 25, 32);
        style_xhlxbyid = initFeatureStyleOne8(xhddurl, 5, 5, 5, 5);
    };

    //陆洲
    this.initFeatureStyleLZ = function (sjcjurl, hwxjurl, ydurl, qxzurl, gytdurl, txjzurl, xmsjglurl, ywcjurl, xhssurl, xhzsurl) {
        style_sjcj = initFeatureStyleOne10(sjcjurl, 18, 20, 20, 25);
        //style_ywcj = initFeatureStyleOne(ywcjurl, 18, 20, 20, 25);
        style_xmsjgl = initFeatureStyleOne(xmsjglurl, 18, 20, 20, 25);
        style_gytd = initFeatureStyleOne(gytdurl, 18, 20, 20, 25);
        style_yd = initFeatureStyleOne(ydurl, 18, 20, 20, 25);
        style_txjz = initFeatureStyleOne(txjzurl, 18, 20, 20, 25);
        style_hwxj = initFeatureStyleOne(hwxjurl, 18, 20, 20, 25);
        style_qxz = initFeatureStyleOne(qxzurl, 18, 20, 20, 25);
        style_xhss = initFeatureStyleOne7(18, 20, 20, 25);
        style_xhzs = initFeatureStyleOne(xhzsurl, 18, 20, 20, 25);
    };

    //张停
    this.initFeatureStyleZT = function (jburl, jzurl, xcpurl, bhdurl, lwturl, gsurl) {

        style_jb = initFeatureStyleOne(jburl, 18, 20, 20, 25);
        style_jz = initFeatureStyleOne(jzurl, 18, 20, 20, 25);
        style_xcp = initFeatureStyleOne(xcpurl, 18, 20, 20, 25);
        style_bhd = initFeatureStyleOne(bhdurl, 18, 20, 20, 25);
        style_lwt = initFeatureStyleOne(lwturl, 18, 20, 20, 25);
        style_gs = initFeatureStyleOne(gsurl, 18, 20, 20, 25);

        //  style_gs = initFeatureStyleOne(gsurl, 21, 25, 25, 32);
    };

    //张停
    this.initFeatureStyleZJ = function (comurl, bdzyurl, xburl, lqurl, spjkurl) {
        style_com = initFeatureStyleOne(comurl, 16, 16, 16, 16);

        style_xb = initFeatureStyleOne2(xburl, 16, 16, 16, 16);

        style_lq = initFeatureStyleOne3(lqurl, 16, 16, 16, 16);

        style_gnqh = initFeatureStyleOne4(comurl, 16, 16, 16, 16);
        style_jcsj = initFeatureStyleOne4(comurl, 16, 16, 16, 16);
        style_jtb = initFeatureStyleOne5(comurl, 16, 16, 16, 16);
        style_bdzy = initFeatureStyleOne6(bdzyurl, 16, 16, 16, 16);

        style_ywcj = initFeatureStyleOne7(18, 20, 20, 25);
        style_xz = initFeatureStyleOne9(comurl, 18, 20, 20, 25);
        style_spjk = initFeatureStyleOne(spjkurl, 20, 20, 20, 20);

        style_lw = initFeatureStyleLW();
    };


    //设置中心点位置
    this.initCenterPoint = function (point) {
        if (point)
            centerPoint = point;
        else
            centerPoint = {
                "lon": 113.298611111111,
                "lat": 24.4308333333333,
                "minzoom": 12,
                "maxzoom": 19,
                "sip": "183.234.8.166:6066",
                "slayers": "smte1,smte2,smte3,smte4,smte5,smte6,smte7,smte8,smte9,smte10"
            };
    };

    this.getMap = function () {
        return map;
    }
    /**
     * 加载天地图。
     */
    this.loadMap = function (divName, errorPath, flag) {
        divMap = divName;

        var Styles_bhz = ([
            style_bhz[0],
            style_bhz[1]
        ]);

        //var Styles_jb = ([
        //    style_jb[0],
        //    style_jb[1]
        //]);

        var Styles_sjcj = ([
            style_sjcj[0],
            style_sjcj[1]
        ]);
        var Styles_ywcj = ([
            style_ywcj[0],
            style_ywcj[1]
        ]);
        var Styles_hwxj = ([
            style_hwxj[0],
            style_hwxj[1]
        ]);
        var Styles_qxz = ([
            style_qxz[0],
            style_qxz[1]
        ]);
        var Styles_yd = ([
            style_yd[0],
            style_yd[1]
        ]);
        var Styles_gytd = ([
            style_gytd[0],
            style_gytd[1]
        ]);
        var Styles_xmsjgl = ([
            style_xmsjgl[0],
            style_xmsjgl[1]
        ]);
        var Styles_txjz = ([
            style_txjz[0],
            style_txjz[1]
        ]);
        var Styles_jb = ([
            style_jb[0],
            style_jb[1]
        ]);
        var Styles_jz = ([
            style_jz[0],
            style_jz[1]
        ]);
        var Styles_xcp = ([
            style_xcp[0],
            style_xcp[1]
        ]);
        var Styles_bhd = ([
            style_bhd[0],
            style_bhd[1]
        ]);
        var Styles_lwt = ([
            style_lwt[0],
            style_lwt[1]
        ]);
        var Styles_gs = ([
            style_gs[0],
            style_gs[1]
        ]);

        var Styles_lyd = ([
            style_lyd[0],
            style_lyd[1]
        ]);
        var Styles_jgd = style_jgd;
        // var Styles_jgd = ([
        //     style_jgd[0],
        //     style_jgd[1]
        // ]);
        var Styles_dz = ([
            style_dz[0],
            style_dz[1]
        ]);
        var Styles_sk = ([
            style_sk[0],
            style_sk[1]
        ]);
        var Styles_hwxj = ([
            style_hwxj[0],
            style_hwxj[1]
        ]);
        var Styles_dm = ([
            style_dm[0],
            style_dm[1]
        ]);
        var Styles_jmd = ([
            style_jmd[0],
            style_jmd[1]
        ]);

        var Styles_com = ([
            style_com[0],
            style_com[1]
        ]);
        var Styles_xb = ([
            style_xb[0],
            style_xb[1]
        ]);
        var Styles_lq = ([
            style_lq[0],
            style_lq[1]
        ]);

        var Styles_gnqh = style_gnqh;
        // var Styles_gnqh = ([
        //     style_gnqh[0],
        //     style_gnqh[1]
        // ]);
        var Styles_jcsj = ([
            style_jcsj[0],
            style_jcsj[1]
        ]);
        var Styles_jtb = style_jtb
        // var Styles_jtb = ([
        //     style_jtb[0],
        //     style_jtb[1]
        // ]);

        var Styles_xhss = ([
            style_xhss[0],
            style_xhss[1]
        ]);

        var Styles_bdzy = ([
            style_bdzy[0],
            style_bdzy[1]
        ]);

        var Styles_xhlxbyid = ([
            style_xhlxbyid[0],
            style_xhlxbyid[1]
        ]);

        var Styles_xz = style_xz;
        // var Styles_xz = ([
        //     style_xz[0],
        //     style_xz[1]
        // ]);

        var Styles_spjk = ([
            style_spjk[0],
            style_spjk[1]
        ]);

        var Styles_xhzs = ([
            style_xhzs[0],
            style_xhzs[1]
        ]);

        var Styles_lw = style_lw

        vSource_bhz = new ol.source.Vector();

        //vSource_jb = new ol.source.Vector();

        vSource_sjcj = new ol.source.Vector();
        vSource_ywcj = new ol.source.Vector();
        vSource_xmsjgl = new ol.source.Vector();
        vSource_gytd = new ol.source.Vector();
        vSource_yd = new ol.source.Vector();
        vSource_hwxj = new ol.source.Vector();
        vSource_txjz = new ol.source.Vector();
        vSource_qxz = new ol.source.Vector();

        vSource_jb = new ol.source.Vector();
        vSource_jz = new ol.source.Vector();
        vSource_xcp = new ol.source.Vector();
        vSource_bhd = new ol.source.Vector();
        vSource_lwt = new ol.source.Vector();
        vSource_gs = new ol.source.Vector();

        vSource_lyd = new ol.source.Vector();

        vSource_jgd = new ol.source.Vector();
        vSource_dz = new ol.source.Vector();
        vSource_sk = new ol.source.Vector();
        vSource_qxz = new ol.source.Vector();
        vSource_jmd = new ol.source.Vector();
        vSource_dm = new ol.source.Vector();
        vSource_gnqh = new ol.source.Vector();
        vSource_jcsj = new ol.source.Vector();
        vSource_jtb = new ol.source.Vector();

        vSource_xb = new ol.source.Vector();
        vSource_lq = new ol.source.Vector();
        vSource_bdzy = new ol.source.Vector();
        vSource_xhss = new ol.source.Vector();    //地图定位
        vSource_com = new ol.source.Vector();
        vSource_xhlxbyid = new ol.source.Vector(); //巡护路线
        vSource_xz = new ol.source.Vector();
        vSource_spjk = new ol.source.Vector(); //视频监控
        vSource_xhzs = new ol.source.Vector(); //巡护值守


        vsource_photos = new ol.source.Vector(); //照片
        vsource_photos2 = new ol.source.Vector(); //照片
        vsource_photos3 = new ol.source.Vector(); //照片
        vsource_photos4 = new ol.source.Vector(); //照片

        vSource_lw = new ol.source.Vector(); //路网

        vLayer_bhz = new ol.layer.Vector({
            source: vSource_bhz,
            style: Styles_bhz
        });

        vLayer_ywcj = new ol.layer.Vector({
            source: vSource_ywcj,
            style: Styles_ywcj
        });
        vLayer_sjcj = new ol.layer.Vector({
            source: vSource_sjcj,
            style: Styles_sjcj
        });
        vLayer_qxz = new ol.layer.Vector({
            source: vSource_qxz,
            style: Styles_qxz
        });
        vLayer_txjz = new ol.layer.Vector({
            source: vSource_txjz,
            style: Styles_txjz
        });
        vLayer_xmsjgl = new ol.layer.Vector({
            source: vSource_xmsjgl,
            style: Styles_xmsjgl
        });
        vLayer_yd = new ol.layer.Vector({
            source: vSource_yd,
            style: Styles_yd
        });
        vLayer_gytd = new ol.layer.Vector({
            source: vSource_gytd,
            style: Styles_gytd
        });
        vLayer_hwxj = new ol.layer.Vector({
            source: vSource_hwxj,
            style: Styles_hwxj
        });

        vLayer_jb = new ol.layer.Vector({
            source: vSource_jb,
            style: Styles_jb
        });
        vLayer_jz = new ol.layer.Vector({
            source: vSource_jz,
            style: Styles_jz
        });
        vLayer_xcp = new ol.layer.Vector({
            source: vSource_xcp,
            style: Styles_xcp
        });
        vLayer_bhd = new ol.layer.Vector({
            source: vSource_bhd,
            style: Styles_bhd
        });
        vLayer_lwt = new ol.layer.Vector({
            source: vSource_lwt,
            style: Styles_lwt
        });
        vLayer_gs = new ol.layer.Vector({
            source: vSource_gs,
            style: Styles_gs
        });

        vLayer_lyd = new ol.layer.Vector({
            source: vSource_lyd,
            style: Styles_lyd
        });

        vLayer_jgd = new ol.layer.Vector({
            source: vSource_jgd,
            style: Styles_jgd
        });

        vLayer_dz = new ol.layer.Vector({
            source: vSource_dz,
            style: Styles_dz
        });

        vLayer_sk = new ol.layer.Vector({
            source: vSource_sk,
            style: Styles_sk
        });

        vLayer_jmd = new ol.layer.Vector({
            source: vSource_jmd,
            style: Styles_jmd
        });
        vLayer_dm = new ol.layer.Vector({
            source: vSource_dm,
            style: Styles_dm
        });

        vLayer_com = new ol.layer.Vector({
            source: vSource_com,
            style: Styles_com
        });

        vLayer_xb = new ol.layer.Vector({
            source: vSource_xb,
            style: Styles_xb
        });

        vLayer_lq = new ol.layer.Vector({
            source: vSource_lq,
            style: Styles_lq
        });

        vLayer_gnqh = new ol.layer.Vector({
            source: vSource_gnqh,
            style: Styles_gnqh
        });

        vLayer_jcsj = new ol.layer.Vector({
            source: vSource_jcsj,
            style: Styles_jcsj
        });

        vLayer_jtb = new ol.layer.Vector({
            source: vSource_jtb,
            style: Styles_jtb
        });


        vLayer_xhss = new ol.layer.Vector({
            source: vSource_xhss,
            style: Styles_xhss
        });
        vLayer_bdzy = new ol.layer.Vector({
            source: vSource_bdzy,
            style: Styles_bdzy
        });

        vLayer_xhlxbyid = new ol.layer.Vector({
            source: vSource_xhlxbyid,
            style: Styles_xhlxbyid
        });

        vLayer_xz = new ol.layer.Vector({
            source: vSource_xz,
            style: Styles_xz
        });

        vLayer_spjk = new ol.layer.Vector({
            source: vSource_spjk,
            style: Styles_spjk
        });

        vLayer_xhzs = new ol.layer.Vector({
            source: vSource_xhzs,
            style: Styles_xhzs
        });

        vlayer_photos = new ol.layer.Vector({
            source: vsource_photos,
            style: new ol.style.Style({
                backgroundGraphic: "http://www.hclbs.com/webgis/swf/photo_back.png",
                strokeColor: "white",
                backgroundHeight: 100,
                backgroundWidth: 100,
                graphicWidth: 80,
                graphicHeight: 80,
                externalGraphic: "${lstlj}",
                graphicYOffset: -104,
                backgroundYOffset: -114,
                graphicTitle: "点击查看大图"
            })
        });

        vlayer_photos2 = new ol.layer.Vector({
            source: vsource_photos2,
            style: new ol.style.Style({
                graphicWidth: 30,
                graphicHeight: 30,
                externalGraphic: "http://www.hclbs.com/webgis/swf/qipao.png"
            })
        });

        //巡护轨迹中上报图片
        vlayer_photos3 = new ol.layer.Vector({
            source: vsource_photos3,
            style: new ol.style.Style({
                //graphicWidth: 10,
                //graphicHeight: 10,
                graphicWidth: "${graphicWidth}",
                graphicHeight: "${graphicWidth}",
                fontSize: "12px",
                //graphicXOffset: -5,
                //graphicYOffset: -10,
                graphicXOffset: "${graphicXOffset}",
                graphicYOffset: "${graphicYOffset}",
                externalGraphic: "http://www.hclbs.com/webgis/swf/qipao.png"
            })
        });

        vlayer_photos4 = new ol.layer.Vector({
            source: vsource_photos4,
            style: new ol.style.Style({
                backgroundGraphic: "http://www.hclbs.com/webgis/swf/photo_back.png",
                strokeColor: "white",
                fontColor: "#fff",
                fontSize: "${fontSize}",
                //backgroundWidth: 60,
                //backgroundHeight: 60,
                backgroundWidth: "${backgroundWidth}",
                backgroundHeight: "${backgroundWidth}",
                graphicWidth: "${size}",
                graphicHeight: "${size}",
                externalGraphic: "${img}",
                label: "${label}",
                labelYOffset: "${labelYOffset}",
                backgroundXOffset: "${backgroundXOffset}",
                backgroundYOffset: "${backgroundYOffset}",
                graphicXOffset: "${graphicXOffset}",
                graphicYOffset: "${graphicYOffset}",
                action: "${action}",
                fourChar: "${fourChar}"
            })
        });

        vLayer_lw = new ol.layer.Vector({
            source: vSource_lw,
            style: Styles_lw
        });

        // ssy map
        function getBaseLayer_ggyx(layername) {
            // return new ol.layer.Tile({
            //     name: layername,
            //     source: new ol.source.TileWMS({
            //         //geoserver所在服务器地址
            //         // url: "http://192.168.43.78:8080/geoserver/map/wms",
            //         url: "http://192.168.1.104:8080/geoserver/map/wms",
            //         params: {
            //             'FORMAT': "image/png",
            //             'VERSION': '1.1.1',
            //             tiled: true,
            //             STYLES: '',
            //             // LAYERS: 'map:yx',
            //             LAYERS: 'map:alsyx',
            //             tilesOrigin: 73.62 + "," + 16.7
            //         }
            //     })
            // });
            return new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: "https://mt0.google.cn/vt?lyrs=s&amp&x={x}&y={y}&z={z}"
                })
            })
        }

        const gg_offsetX = -460;
        const gg_offsetY = -60;
        let gg_projection = ol.proj.get("EPSG:3857");
        const gg_projectionExtent = gg_projection.getExtent();
        const gg_size = ol.extent.getWidth(gg_projectionExtent) / 256;
        let gg_resolutions = [];
        for (var i = 0; i < 19; i++) {
            gg_resolutions[i] = gg_size / Math.pow(2, i);
        }
        let gg_tileGrid = new ol.tilegrid.TileGrid({
            origin: [gg_projection.getExtent()[0] + gg_offsetX, gg_projection.getExtent()[3] + gg_offsetY],
            // origin: [0, 0],
            resolutions: gg_resolutions
        });

        // ssy map
        function getBaseLayer_ggsl(layername) {
            // return new ol.layer.Tile({
            //     name: layername,
            //     source: new ol.source.TileWMS({
            //         //geoserver所在服务器地址
            //         // url: "http://192.168.43.78:8080/geoserver/map/wms",
            //         url: "http://192.168.1.104:8080/geoserver/map/wms",
            //         params: {
            //             'FORMAT': "image/png",
            //             'VERSION': '1.1.1',
            //             tiled: true,
            //             STYLES: '',
            //             LAYERS: 'map:gdx',
            //             tilesOrigin: 73.62 + "," + 16.7
            //         }
            //     })
            // });
            // let projection = ol.proj.get("EPSG:3857");
            // let resolutions = [];
            // for (var i = 0; i < 19; i++) {
            //     resolutions[i] = Math.pow(2, 18 - i);
            // }
            // let tilegrid = new ol.tilegrid.TileGrid({
            //     origin: [0, 0],
            //     resolutions: resolutions
            // });
            // return new ol.layer.Tile({
            //     source: new ol.source.TileImage({
            //         projection: projection,
            //         tileGrid: tilegrid,
            //         tileUrlFunction: function (tileCoord, pixelRatio, proj) {
            //             if (!tileCoord) {
            //                 return "";
            //             }
            //             var z = tileCoord[0];
            //             var x = tileCoord[1];
            //             var y = tileCoord[2];
            //
            //             if (x < 0) {
            //                 x = "M" + (-x);
            //             }
            //             if (y < 0) {
            //                 y = -y - 1;
            //             } else {
            //                 y = "M" + y;
            //             }
            //
            //             return "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" + x + "&y=" + y + "&z=" + z + "&styles=pl&udt=20200411&scaler=1&p=1";
            //         }
            //     })
            // });
            return new ol.layer.Tile({
                source: new ol.source.XYZ({
                    projection: gg_projection,
                    tileGrid: gg_tileGrid,
                    url: "https://mt0.google.cn/vt?lyrs=m&amp&x={x}&y={y}&z={z}"
                })
            })
        }

        // ssy map
        function getBaseLayer_ggdx(layername) {
            // return new ol.layer.Tile({
            //     source: new ol.source.XYZ({
            //         url: "https://mt0.google.cn/vt?lyrs=t&amp&x={x}&y={y}&z={z}"
            //     })
            // })
            return new ol.layer.Tile({
                source: new ol.source.XYZ({
                    projection: gg_projection,
                    tileGrid: gg_tileGrid,
                    url: "https://mt0.google.cn/vt?lyrs=r&amp&x={x}&y={y}&z={z}"
                })
            })
        }

        // ssy map
        function getBaseLayer_ggdldm(layername) {
            return new ol.layer.Tile({
                source: new ol.source.XYZ({
                    projection: gg_projection,
                    tileGrid: gg_tileGrid,
                    url: "https://mt0.google.cn/vt?lyrs=h&x={x}&y={y}&z={z}"
                })
            })
        }

        function getBaseLayerWmts_sl(layername, layer) {
            return new ol.layer.Tile({
                name: layername,
                source: new ol.source
                    .XYZ({
                        urls: [
                            "http://t0.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                            "http://t1.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                            "http://t2.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                            "http://t3.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                            "http://t4.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                            "http://t5.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                            "http://t6.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                            "http://t7.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce"
                        ],
                        isBaseLayer: true,
                        displayInLayerSwitcher: true,
                        tileGrid: getWmtsTileGrid(tdtProjection),
                        projection: ol.proj.get(tdtProjection)
                    }),
                visible: false
            });
        }

        function getBaseLayerWmts_yx(layername, layer) {
            return new ol.layer.Tile({
                name: layername,
                source: new ol.source.WMTS({
                    urls: [
                        "http://t0.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t1.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t2.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t3.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t4.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t5.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t6.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t7.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce"
                    ],
                    layer: layer,
                    matrixSet: "c",
                    // matrixIds: matrixIds,
                    format: "tiles",
                    style: "default",
                    opacity: 1,
                    isBaseLayer: true,
                    displayInLayerSwitcher: true,
                    tileGrid: getWmtsTileGrid(tdtProjection),
                    projection: ol.proj.get(tdtProjection)
                })
            });
        }

        // ssy map
        function getBaseLayerWmts_dx(layername, layer) {
            return new ol.layer.Tile({
                name: layername,
                source: new ol.source.WMTS({
                    urls: [
                        "http://t0.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t1.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t2.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t3.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t4.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t5.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t6.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t7.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce"
                    ],
                    layer: layer,
                    matrixSet: "c",
                    // matrixIds: matrixIds,
                    format: "tiles",
                    style: "default",
                    opacity: 1,
                    isBaseLayer: true,
                    displayInLayerSwitcher: true,
                    tileGrid: getWmtsTileGrid(tdtProjection, 14),
                    projection: ol.proj.get(tdtProjection)
                })
            });
        }

        function getBaseLayerWmts_dldm(layername, layer) {
            return new ol.layer.Tile({
                name: layername,
                source: new ol.source.WMTS({
                    urls: [
                        "http://t0.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t1.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t2.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t3.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t4.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t5.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t6.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                        "http://t7.tianditu.gov.cn/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce"
                    ],
                    layer: layer,
                    matrixSet: "c",
                    // matrixIds: matrixIds,
                    format: "tiles",
                    style: "default",
                    opacity: 1,
                    isBaseLayer: true,
                    displayInLayerSwitcher: true,
                    tileGrid: getWmtsTileGrid(tdtProjection, 14),
                    projection: ol.proj.get(tdtProjection)
                })
            });
        }

        function getBaseLayerWmts_hlsx(layername, layer) {
            return new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: layername,
                    url: "http://glcdata.tianditu.com/" + layer + "_c/wmts?tk=c9039b4c69d61337387e74355424ddce",
                    layer: layer,
                    matrixSet: "c",
                    // matrixIds: matrixIds,
                    format: "tiles",
                    style: "default",
                    opacity: 1,
                    isBaseLayer: true,
                    displayInLayerSwitcher: true,
                    tileGrid: getWmtsTileGrid(tdtProjection),
                    projection: ol.proj.get(tdtProjection)
                })
            });
        }

        function getBaseLayerWmts_Esri(layername, layer) {
            return new ol.layer.Tile({
                source: new ol.source.WMTS({
                    name: layername,
                    url: "http://services.arcgisonline.com/ArcGIS/rest/services/ESRI_Imagery_World_2D/MapServer",
                    layer: layer,
                    matrixSet: "default028mm",
                    format: "tiles",
                    style: "_null",
                    opacity: 1,
                    isBaseLayer: true,
                    displayInLayerSwitcher: true,
                    tileGrid: getWmtsTileGrid(tdtProjection),
                    projection: ol.proj.get(tdtProjection)
                })
            });
        }

        function getAnnoLayer(layername, layer, visiable) {
            return new ol.layer.Tile({
                source: new ol.source.XYZ({
                    urls: [
                        "http://t0.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                        "http://t1.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                        "http://t2.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                        "http://t3.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                        "http://t4.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                        "http://t5.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                        "http://t6.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce",
                        "http://t7.tianditu.gov.cn/DataServer?T=" + layer + "&X={x}&Y={y}&L={z}&tk=c9039b4c69d61337387e74355424ddce"
                    ],
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    tileGrid: getWmtsTileGrid(tdtProjection),
                    projection: ol.proj.get(tdtProjection)
                }),
                visible: visiable
            });
        }
        ;

        var baseLayers = ["vec_c", "img", "ter", "cta", "lcr", "World Imagery"];
        //        layer_sl = getBaseLayer2("矢量", baseLayers[0]);
        //        layer_yx = getBaseLayer("影像", baseLayers[1]);
        layer_sl = getBaseLayerWmts_sl("矢量", baseLayers[0]);
        layer_yx = getBaseLayerWmts_yx("影像", baseLayers[1]);
        layer_yx.setVisible(false);
        layer_sl.setVisible(true);
        layer_dx = getBaseLayerWmts_dx("地形", baseLayers[2]);
        layer_dx.setVisible(false);
        layer_dldm = getBaseLayerWmts_dldm("道路地名", baseLayers[3]);
        layer_dldm.setVisible(false);
        layer_ggyx = getBaseLayer_ggyx("谷歌影像");
        layer_ggyx.setVisible(false);
        layer_ggsl = getBaseLayer_ggsl("谷歌矢量");
        layer_ggsl.setVisible(false);
        layer_ggdx = getBaseLayer_ggdx("谷歌地形");
        layer_ggdx.setVisible(false);
        layer_ggdldm = getBaseLayer_ggdldm("谷歌地形");
        layer_ggdldm.setVisible(false);

        layer_hlsx = getBaseLayerWmts_hlsx("河流水系", baseLayers[4]);
        layer_Esri = getBaseLayerWmts_Esri("Esri", baseLayers[5]);

        layer_Anno = getAnnoLayer("地图标注", "cva_c", true);

        // layer_sl.setVisible(false);
        // layer_dldm.setVisible(false);
        // layer_Anno.setVisible(false);

        // var layer1 = new ol.layer.Tile({
        //        source: new ol.source.WMTS({
        //    name: "ditu", //layername
        //    url: "http://t0.tianditu.gov.cn/vec_c/wmts",
        //    layer: "vec", //参考规范
        //    style: "default",
        //    matrixSet: "c", //参考规范
        //    format: "tiles",
        //    isBaseLayer: true
        //    })
        // });

        var layerTDT_ly = new ol.layer.Tile({
            name: "TDT_ly",
            source: new ol.source.ImageWMS({
                //geoserver所在服务器地址
                url: "http://gisserver.tianditu.com:80/TDTService/scenic/wms",
                layers: "040300,040200,040100,040400",
                format: "image/png",
                singleTile: true,
                transparent: true
            })
        });

        layerTDT_xzqh = new ol.layer.Tile({
            name: "xzqh",
            source: new ol.source.ImageWMS({
                //geoserver所在服务器地址
                url: "http://gisserver.tianditu.com/TDTService/region/wms",
                layers: "030100",
                format: "image/png",
                singleTile: true,
                transparent: true
            })
        });

        // layers_blh = new ol.layer.Tile({
        //     name: "blh",
        //     source: new ol.source.ImageWMS({
        //         //geoserver所在服务器地址
        //         url: "http://122.14.210.73:8008/geoserver/gxzrbhq/wms",
        //         layers: "gxzrbhq:blh",
        //         format: "image/png",
        //         transparent: true,
        //         singleTile: true
        //     })
        // });
        // layers_G7 = new ol.layer.Tile({
        //     name: "G7",
        //     source: new ol.source.ImageWMS({
        //         //geoserver所在服务器地址
        //         url: "http://122.14.210.73:8008/geoserver/gxzrbhq/wms",
        //         layers: "gxzrbhq:G72",
        //         format: "image/png",
        //         transparent: true,
        //         singleTile: true
        //     })
        // });
        // layersmtxb_ldsuyq = new ol.layer.Tile({
        //     name: "smtxb_ldsuyq",
        //     source: new ol.source.ImageWMS({
        //         //geoserver所在服务器地址
        //         url: "http://gisserver.tianditu.com:80/TDTService/scenic/wms",
        //         layers: "smtxb_ldsuyq",
        //         format: "image/png",
        //         transparent: true,
        //         singleTile: true
        //     }),
        //     visibility: false, opacity: 0.7
        // });
        //
        // layersmtxb_ldsiyq = new ol.layer.Tile({
        //     name: "smtxb_ldsiyq",
        //     source: new ol.source.ImageWMS({
        //         //geoserver所在服务器地址
        //         url: "http://183.234.8.166:6066/geoserver/smt/wms",
        //         layers: "smtxb_ldsiyq",
        //         format: "image/png",
        //         transparent: true,
        //         singleTile: true
        //     }),
        //     visibility: false, opacity: 0.7
        // });
        //
        //
        // layersmtxb_lmsuyq = new ol.layer.Tile({
        //     name: "smtxb_lmsuyq",
        //     source: new ol.source.ImageWMS({
        //         //geoserver所在服务器地址
        //         url: "http://183.234.8.166:6066/geoserver/smt/wms",
        //         layers: "smtxb_lmsuyq",
        //         format: "image/png",
        //         transparent: true,
        //         singleTile: true
        //     }),
        //     visibility: false, opacity: 0.7
        // });
        // layersmtxb_lmsiyq = new ol.layer.Tile({
        //     url: "smtxb_lmsiyq",
        //     source: new ol.source.ImageWMS({
        //         //geoserver所在服务器地址
        //         url: "http://183.234.8.166:6066/geoserver/smt/wms",
        //         layers: "smtxb_lmsiyq",
        //         format: "image/png",
        //         transparent: true,
        //         singleTile: true
        //     }),
        //     visibility: false, opacity: 0.7
        // });
        //
        // layersmtxb_nl = new ol.layer.Tile({
        //     name: "smtxb_nl",
        //     source: new ol.source.ImageWMS({
        //         //geoserver所在服务器地址
        //         url: "http://183.234.8.166:6066/geoserver/smt/wms",
        //         layers: "smtxb_nl",
        //         format: "image/png",
        //         transparent: true,
        //         singleTile: true
        //     }),
        //     visibility: false, opacity: 0.7
        // });

        vectors = new ol.layer.Vector({
            source: new ol.source.Vector("Vector Layer")
        });

        // var options = {
        //     tileSize: [256, 256],
        //     projection: "EPSG:4326",
        //     displayProjection: new ol.Projection("EPSG:4326")
        // };

        // map = new ol.Map(divName, options);
        map = new ol.Map({
            target: divName,
            view: new ol.View({
                center: [centerPoint.lon, centerPoint.lat],
                // center: [106.69, 31.935],
                zoom: centerPoint.minzoom,
                projection: displayProjection,
                // constrainResolution: true
            })
        });

        com_layers = new ol.layer.Group({
            layers: [layer_yx, layer_dx, layer_sl, vectors, vLayer_com, layer_dldm, layer_ggyx, layer_ggsl, layer_ggdx, layer_ggdldm, layer_Anno, vLayer_lw, vLayer_gnqh, vLayer_xz/*, layers_G7*/, vLayer_sk, vLayer_xb, vLayer_jcsj, vLayer_jgd]
        });
        var lz_layers = [vLayer_sjcj, vLayer_ywcj, vLayer_hwxj, vLayer_txjz, vLayer_gytd, vLayer_xmsjgl, vLayer_yd, vLayer_qxz, vLayer_xhss];
        var zs_layers = [vLayer_jb, vLayer_jz, vLayer_xcp, vLayer_bhz, vLayer_lyd, vLayer_dz, vLayer_qxz, vLayer_jmd, vLayer_hwxj, vLayer_dm, vLayer_xb, vLayer_lq, vLayer_jtb, vLayer_bdzy, vLayer_xhlxbyid, vlayer_photos3, vlayer_photos4, vlayer_photos2, vlayer_photos];
        // var zt_layers = [vLayer_bhd, vLayer_lwt, vLayer_gs, vLayer_spjk, vLayer_xhzs];
        // zt_ztlayers = new ol.layer.Group({
        //     layers: [layersmtxb_ldsuyq, layersmtxb_ldsiyq, layersmtxb_lmsuyq, layersmtxb_lmsiyq, layersmtxb_nl]
        // });
        // map.addControl(new Geo.View2D.defaultControls);

        var allyw_layers = new ol.layer.Group({
            layers: [vLayer_sjcj, vLayer_ywcj, vLayer_hwxj, vLayer_txjz, vLayer_gytd, vLayer_xmsjgl, vLayer_yd, vLayer_qxz, vLayer_xhss, vLayer_jb, vLayer_jz, vLayer_xcp, vLayer_bhz, vLayer_lyd, vLayer_dz, vLayer_jmd, vLayer_dm, vLayer_xb, vLayer_lq, vLayer_jtb, vLayer_bdzy, vLayer_xhlxbyid, vlayer_photos3, vlayer_photos4, vlayer_photos2, vlayer_photos]
        });
        // allyw_layers = lz_layers;
        // for (var i = 0; i < zs_layers.getLayersArray().length; i++) {
        //     allyw_layers.push(zs_layers.getLayersArray()[i]);
        // }

        // for (var i = 0; i < zt_layers.length; i++) {
        //     allyw_layers.push(zt_layers[i]);
        // }
        //        for (var i = 0; i < zt_ztlayers.length; i++) {
        //            allyw_layers.push(zt_ztlayers[i]);
        //        }
        map.addLayer(com_layers);
        map.addLayer(allyw_layers);

        var jsonStr = "[[100.1, 40.8461],[100.541111, 41.85],[101.003611, 41.891944],[104.555278, 40.764167],[103.1625, 41.676667],[104.956944, 40.658056],[104.536389, 40.249444],[104.698611, 40.4575],[100.58, 41.873889],[101.277222, 42.579167],[101.228056, 42.513611],[101.033889, 41.898333],[105.194167, 40.830556]]";
        var json = JSON.parse(jsonStr);
        var styleTmp = function (feature, resolution) {
            return new ol.style.Style({
                image: new ol.style.Icon({
                    src: './images/icon.png',
                    // size: [imgW, imgH],
                    // anchor: [0.5, 0.96],
                    opacity: 1.0
                }),
            });
        };
        var sourceTmp = new ol.source.Vector();
        layer_bjkk = new ol.layer.Vector({
            source: sourceTmp,
            style: styleTmp
        });
        layer_bjkk.setVisible(false);
        for (var i = 0; i < json.length; i++) {
            var feaTmp = new ol.Feature({geometry: new ol.geom.Point(json[i])});
            sourceTmp.addFeature(feaTmp);
        }
        map.addLayer(layer_bjkk);
        vLayer_xz.setVisible(false);
        vLayer_jtb.setVisible(false);
        vLayer_lw.setVisible(false);
        // 底图
        // var baseSrc = new ol.source.Vector();
        // baseLyr = new ol.layer.Vector({
        //     source: baseSrc,
        //     style: new ol.style.Style({
        //         fill: new ol.style.Fill({
        //             color: "#41ff89"
        //         })
        //     })
        // });
        // baseSrc.addFeature(new ol.Feature({geometry: new ol.geom.Polygon(json)}));
        // map.addLayer(baseLyr);

        // map.addLayer(zt_ztlayers);
        //
        // sFeature = new Geo.View2D.Control.SelectFeature(allyw_layers, {
        //     onSelect: function (currentFeature) {
        //         if (eventTarget != null) {
        //             currentFeature.selected = "1";
        //             eventTarget.fire({
        //                 type: "clickSelect",
        //                 target: currentFeature
        //             });
        //         }
        //     },
        //     onUnselect: function (currentFeature) {
        //         if (eventTarget != null) {
        //             currentFeature.selected = "0";
        //             eventTarget.fire({
        //                 type: "clickUnSelect",
        //                 target: currentFeature
        //             });
        //             //eventTarget.fire2({
        //             //    type: "clickUnSelect",
        //             //    target: currentFeature
        //             //});
        //         }
        //     }
        // });
        //
        // qFeature = new Geo.View2D.Control.SelectFeature(allyw_layers,
        //     {
        //         onSelect: function (currentFeature) {
        //             if (eventTarget != null) {
        //                 currentFeature.selected = "1";
        //                 eventTarget.fire({
        //                     type: "clickSelect",
        //                     target: currentFeature
        //                 });
        //             }
        //         },
        //         onUnselect: function (currentFeature) {
        //             if (eventTarget != null) {
        //                 currentFeature.selected = "0";
        //                 eventTarget.fire({
        //                     type: "clickUnSelect",
        //                     target: currentFeature
        //                 });
        //             }
        //         },
        //         hover: true,
        //         toggle: false,
        //         multiple: false
        //     }
        // );
        //
        // kFeature = new Geo.View2D.Control.SelectFeature(allyw_layers, multipleSFOptions);
        //
        // map.addControl(kFeature);
        // map.addControl(sFeature);
        // map.addControl(qFeature);

        // var sketchSymbolizers = {
        //     "Line": {
        //         strokeWidth: 3,
        //         strokeOpacity: 1,
        //         strokeColor: "blue",
        //         strokeDashstyle: "dashed",
        //         fontSize: "12px"
        //     },
        //     "Polygon": {
        //         strokeWidth: 2,
        //         strokeOpacity: 1,
        //         strokeColor: "blue",
        //         fillColor: "red",
        //         fillOpacity: 0.3,
        //         fontSize: "12px"
        //     }
        // };
        // var style = new o.style.Style({
        //     fill: new ol.style.fill({
        //         color: "red",
        //     }),
        //     stroke:new ol.style.stroke({
        //         color: "blue",
        //         width: 3
        //     }),
        //     text:new ol.style.text({
        //         font: "font-size: 12px"
        //     })
        // });
        //
        // measureControls = {
        //     line: new ol.Control.Measure(
        //         ol.Handler.Path, {
        //             persist: true,
        //             handlerOptions: {
        //                 layerOptions: {
        //                     styleMap: style
        //                 }
        //             }
        //         }
        //     ),
        //     polygon: new ol.Control.Measure(
        //         ol.Handler.Polygon, {
        //             persist: true,
        //             handlerOptions: {
        //                 layerOptions: {
        //                     styleMap: styleMap
        //                 }
        //             }
        //         }
        //     )
        // };

        //
        // for (var key in measureControls) {
        //     control = measureControls[key];
        //     control.events.on({
        //         "measure": handleMeasurements,
        //         "measurepartial": handleMeasurements2
        //     });
        //     map.addControl(control);
        // }
        //

        // test123layer = new ol.layer.Vector({
        //     name: "test123layer",
        //     source: new ol.source.Vector(),
        //     style: Styles_jtb
        // });
        // vLayer_setline = new ol.layer.Vector({
        //     name: "vLayer_setline",
        //     source: new ol.source.Vector(),
        //     style: Styles_jtb
        // });
        // map.addLayer(test123layer);
        // map.addLayer(vLayer_setline);

        //
        // map.events.register("zoomend", this, function (e) {
        //     var mapzoom = map.getZoom();
        //     var mapextent = map.getExtent();
        //     var mapsize = map.size;
        //
        //     if (map.getZoom() > 9) {
        //         vlayer_photos.removeAllFeatures();
        //         vlayer_photos2.removeAllFeatures();
        //         var resoluion = 100 * (mapextent.right - mapextent.left) / mapsize.w;
        //         getPhotosData("getphotos", "photos", resoluion);
        //     } else {
        //         vlayer_photos.setVisible(false);
        //         vlayer_photos2.setVisible(false);
        //     }
        // });
        //
        //
        // //        map.events.register('click', map, function (e) {
        // //            var pixel = new ol.Pixel(e.xy.x, e.xy.y);
        // //            var lonlat = map.getCoordinateFromPixel(pixel);
        // //            //  lonlat.transform(new ol.Projection("EPSG:900913"), new ol.Projection("EPSG:4326")); //由900913坐标系转为4326
        // //            alert(lonlat.lon + ", " + lonlat.lat);
        // //        });
        //
        //
        // function handleMeasurements(event) {
        //     var geometry = event.geometry;
        //     var units = event.units;
        //     var order = event.order;
        //     var measure = event.measure;
        //     var out = "";
        //     if (order == 1) {
        //         out += "长度: " + measure.toFixed(3) + " " + units;
        //     } else {
        //         out += "面积: " + measure.toFixed(3) + " " + units + "2";
        //     }
        //     //  document.getElementById("").value(out);
        //
        //     // test123layer.removeAllFeatures();
        //
        //     //            geometry.fourChar = "111";
        //     //            geometry.action = "12";
        //     //            geometry.stream_status = "1";
        //     //            geometry.siteid = "123";
        //     //            geometry.attributes = {name:out,id:"123"};
        //     var len = 0;
        //     var pt;
        //     if (order == 1) {
        //         len = geometry.components.length - 1
        //         pt = geometry.components[len];
        //         pppoints = geometry.components;
        //     } else {
        //         len = geometry.components[0].components.length - 2;
        //         pt = geometry.components[0].components[len];
        //         pppoints = geometry.components[0].components;
        //     }
        //
        //
        //     var minLat = pt.y;
        //     var minLon = pt.x;
        //     //            var point1 = new Geo.Geometry.Point(minLon, minLat);
        //     //            var pointFeature1 = new Geo.Feature.Vector(point1);
        //
        //     //            pointFeature1.fourChar = "1";
        //     //            pointFeature1.action = "12";
        //     //            pointFeature1.stream_status = "1";
        //     //            pointFeature1.siteid = "123";
        //     //            pointFeature1.attributes.name = out;
        //     //            window.console.log(minLat + "," + minLon);
        //     //            test123layer.addFeatures([pointFeature1]);
        //     //test123layer.redraw();
        //     return out;
        // }
        //
        // function handleMeasurements2(event) {
        //     var geometry = event.geometry;
        //     var units = event.units;
        //     var order = event.order;
        //     var measure = event.measure;
        //     var out = "";
        //     if (order == 1) {
        //         out += "1长度: " + measure.toFixed(3) + " " + units;
        //     } else {
        //         out += "1面积: " + measure.toFixed(3) + " " + units + "2";
        //     }
        //     //  document.getElementById("").value(out);
        //
        //     var ilen = test123layer.features.length;
        //     for (var i = ilen - 1; i >= 0; i--) {
        //         var ff = test123layer.features[i];
        //         if (ff.fourChar == "2") {
        //             test123layer.removeFeatures(ff);
        //         }
        //     }
        //
        //     var len = 0;
        //     var pt;
        //     if (order == 1) {
        //         len = geometry.components.length - 1
        //         pt = geometry.components[len];
        //     } else {
        //         len = geometry.components[0].components.length - 2;
        //         pt = geometry.components[0].components[len];
        //     }
        //
        //
        //     var minLat = pt.y;
        //     var minLon = pt.x;
        //     var point1 = new Geo.Geometry.Point(minLon, minLat);
        //     var pointFeature1 = new Geo.Feature.Vector(point1);
        //
        //     pointFeature1.fourChar = "2";
        //     pointFeature1.action = "12";
        //     pointFeature1.stream_status = "1";
        //     pointFeature1.siteid = "123";
        //     pointFeature1.attributes.name = out;
        //     window.console.log("sdfsdf" + minLat + "," + minLon);
        //     test123layer.addFeatures([pointFeature1]);
        //
        //     //test123layer.redraw();
        //     return out;
        // }

        // this.toggleControl = function (element) {
        //     for (key in measureControls) {
        //         var control = measureControls[key];
        //         if (element == key) {
        //             control.activate();
        //             control.setImmediate(true);
        //         }
        //     }
        //     test123layer.setVisible(true);
        // }

        // this.testsss = function (callback) {
        //     if (typeof callback == Function) {
        //         callback();
        //     }
        // }

        // //        var select_feature_control = new ol.Control.SelectFeature(
        // //        vector_layer,
        // //        {
        // //            multiple: false,
        // //            toggle: true,
        // //            multipleKey: 'shiftKey'
        // //        }
        // //            );
        // //        map.addControl(select_feature_control);
        //
        //
        // var pointDraw = new Geo.View2D.Control.DrawFeature(vectors,
        //     ol.Handler.Point);
        //
        // var lineDraw = new Geo.View2D.Control.DrawFeature(vectors,
        //     ol.Handler.Path);
        //
        // var polygonDraw = new Geo.View2D.Control.DrawFeature(vectors,
        //     ol.Handler.Polygon);
        //
        // var regularDraw = new Geo.View2D.Control.DrawFeature(vectors,
        //     ol.Handler.RegularPolygon, {
        //         handlerOptions: {
        //             sides: 5
        //         }
        //     });
        // pointDraw.featureAdded = function (feature) {
        //     feature.style = {
        //         pointRadius: 6,
        //         stroke: true,
        //         strokeColor: "#00AA00",
        //         fill: true,
        //         fillOpacity: 0.4,
        //         fillColor: "#00AA00"
        //     };
        //     vectors.redraw();
        // };
        // polygonDraw.featureAdded = function (feature) {
        //     feature.style = {
        //         stroke: true,
        //         fill: true,
        //         fillOpacity: 0.4,
        //         fillColor: "#00FF00",
        //         strokeColor: "#00AA00"
        //     };
        //     vectors.redraw();
        //     //              alert(feature.geometry.components[0].getArea());
        //     testsss();
        // };
        // lineDraw.featureAdded = function (feature) {
        //     feature.style = {
        //         stroke: true,
        //         strokeColor: "#00AA00"
        //     };
        //     vectors.redraw();
        // };
        //
        // var mf = new Geo.View2D.Control.ModifyFeature(vectors);
        // controls = {
        //     clicks: sFeature,
        //
        //     rects: kFeature,
        //
        //     point: pointDraw,
        //
        //     line: lineDraw,
        //
        //     polygon: polygonDraw,
        //
        //     regular: regularDraw,
        //
        //     modify: mf,
        //
        //     drags: new ol.Control.DragFeature(vectors, {})
        // };
        //
        // function report(event) {
        //     msOBJ = event.feature;
        //     ol.Console.log(event.type, event.feature ? event.feature.id : event.components);
        // }
        //
        // vectors.events.on({
        //     "beforefeaturemodified": report,
        //     "featuremodified": report,
        //     "afterfeaturemodified": report,
        //     "vertexmodified": report,
        //     "sketchmodified": report,
        //     "sketchstarted": report,
        //     "sketchcomplete": report
        // });
        //
        // for (var key in controls) {
        //     map.addControl(controls[key]);
        // }
        //
        // map.setCenter(new Geo.LonLat(centerPoint.lon, centerPoint.lat), centerPoint.minzoom);
        //
        // mouseHD = new ol.Handler.Keyboard(mf, {
        //     "keydown": this.deleteFeature
        // });
        //
        // //be used when zoom is changing.  2018.3.6
        // var startzoom = 13;
        // var layerName = ["photo3", "photo4", "xhlxbyid", "sjcj", "gnqh", "xhss"];
        // //var layerName = ["photo3", "photo4", "xhlxbyid","sjcj"];
        // var layerArray = new Array();
        // for (i = 0; i < layerName.length; i++) {
        //     var layerobj = new Object();
        //     layerobj.name = layerName[i];
        //     layerobj.startzoom = startzoom;
        //     layerArray.push(layerobj);
        // }
        // map.events.on({
        //     "click": function (e) {
        //         if (isGetPositionFlag) {
        //             var str = "[Screen]:" + e.xy.x + "," + e.xy.y;
        //
        //             // 屏幕坐标向地图坐标的转换
        //             var lonlat = map.getLonLatFromViewPortPx(e.xy);
        //             str = "[Map]:" + lonlat.lat + "," + lonlat.lon;
        //             getPosition = lonlat;
        //             var fs = vLayer_com.features;
        //             var len = fs.length - 1;
        //             for (var i = len; i >= 0; i--) {
        //                 vLayer_com.removeFeatures(fs[i]);
        //             }
        //
        //             var point1 = new Geo.Geometry.Point(lonlat.lon, lonlat.lat);
        //             var pointFeature1 = new Geo.Feature.Vector(point1);
        //             pointFeature1.fourChar = "com_1";
        //             pointFeature1.stream_status = "1";
        //             pointFeature1.siteid = "1";
        //             pointFeature1.attributes.name = "";
        //
        //             vLayer_com.addFeatures([pointFeature1]);
        //
        //         }
        //         if (isGetPositionFlag2) {
        //             var str = "[Screen]:" + e.xy.x + "," + e.xy.y;
        //
        //             // 屏幕坐标向地图坐标的转换
        //             var lonlat = map.getLonLatFromViewPortPx(e.xy);
        //             str = "[Map]:" + lonlat.lat + "," + lonlat.lon;
        //             getPosition = lonlat;
        //             var fs = vLayer_setline.features;
        //             var len = fs.length - 1;
        //             for (var i = len; i >= 0; i--) {
        //                 vLayer_setline.removeFeatures(fs[i]);
        //             }
        //
        //             var point1 = new Geo.Geometry.Point(lonlat.lon, lonlat.lat);
        //             var pointFeature1 = new Geo.Feature.Vector(point1);
        //             pointFeature1.fourChar = "com_1";
        //             pointFeature1.stream_status = "1";
        //             pointFeature1.siteid = "1";
        //             pointFeature1.attributes.name = "";
        //
        //             vLayer_setline.addFeatures([pointFeature1]);
        //         }
        //     },
        //     "zoomend": function (e) {
        //
        //         var layer = vLayer_jgd;
        //         var features = layer.features;
        //         var array = new Array();
        //         for (var i = 0; i < features.length; i++) {
        //             array.push(features[i]);
        //         }
        //
        //         for (var i = 0; i < array.length; i++) {
        //
        //             if (map.zoom >= 9) {
        //                 array[i].attributes.name = array[i].fourChar;
        //             } else if (map.zoom < 9) {
        //                 array[i].attributes.name = "";
        //             }
        //         }
        //
        //         layer.removeAllFeatures();
        //         layer.addFeatures(array);
        //     },
        //     "moveend": function (e) {
        //         //alert(map.zoom);
        //         for (a = 0; a < layerArray.length; a++) {
        //             var zoom = map.zoom;
        //             var difference = zoom - layerArray[a].startzoom;
        //             if (layerArray[a].startzoom == zoom) {
        //                 continue;
        //             }
        //
        //             if (layerArray[a].name == "photo4") {
        //                 var len = gMap.getRenderableCount(layerArray[a].name);
        //                 if (len > 0) {
        //                     var layer = gMap.getsmtlayer(layerArray[a].name);
        //                     var features = layer.features;
        //                     var array = new Array();
        //                     for (var i = 0; i < features.length; i++) {
        //                         array.push(features[i]);
        //                     }
        //
        //                     for (var i = 0; i < array.length; i++) {
        //                         if (difference > 0) {
        //                             if (zoom >= 9) {
        //                                 array[i].attributes.backgroundWidth = array[i].data.backgroundWidth;
        //                                 array[i].attributes.size = array[i].data.size;
        //                                 array[i].attributes.fontSize = array[i].data.fontSize;
        //                                 array[i].attributes.labelYOffset = array[i].data.labelYOffset;
        //                                 array[i].attributes.backgroundXOffset = array[i].data.backgroundXOffset;
        //                                 array[i].attributes.backgroundYOffset = array[i].data.backgroundYOffset;
        //                                 array[i].attributes.graphicXOffset = array[i].data.graphicXOffset;
        //                                 array[i].attributes.graphicYOffset = array[i].data.graphicYOffset;
        //                             } else {
        //                                 array[i].attributes.backgroundWidth = array[i].attributes.backgroundWidth * Math.pow(2, difference);
        //                                 array[i].attributes.size = array[i].attributes.size * Math.pow(2, difference);
        //                                 array[i].attributes.fontSize = array[i].attributes.fontSize * Math.pow(2, difference);
        //                                 array[i].attributes.labelYOffset = array[i].attributes.labelYOffset * Math.pow(2, difference);
        //                                 array[i].attributes.backgroundXOffset = array[i].attributes.backgroundXOffset * Math.pow(2, difference);
        //                                 array[i].attributes.backgroundYOffset = array[i].attributes.backgroundYOffset * Math.pow(2, difference);
        //                                 array[i].attributes.graphicXOffset = array[i].attributes.graphicXOffset * Math.pow(2, difference);
        //                                 array[i].attributes.graphicYOffset = array[i].attributes.graphicYOffset * Math.pow(2, difference);
        //                             }
        //                         } else if (difference < 0) {
        //                             if (zoom >= 9) {
        //                                 array[i].attributes.backgroundWidth = array[i].data.backgroundWidth;
        //                                 array[i].attributes.size = array[i].data.size;
        //                                 array[i].attributes.fontSize = array[i].data.fontSize;
        //                                 array[i].attributes.labelYOffset = array[i].data.labelYOffset;
        //                                 array[i].attributes.backgroundXOffset = array[i].data.backgroundXOffset;
        //                                 array[i].attributes.backgroundYOffset = array[i].data.backgroundYOffset;
        //                                 array[i].attributes.graphicXOffset = array[i].data.graphicXOffset;
        //                                 array[i].attributes.graphicYOffset = array[i].data.graphicYOffset;
        //                             } else {
        //                                 array[i].attributes.backgroundWidth = array[i].attributes.backgroundWidth * Math.pow(0.5, -difference);
        //                                 array[i].attributes.size = array[i].attributes.size * Math.pow(0.5, -difference);
        //                                 array[i].attributes.fontSize = array[i].attributes.fontSize * Math.pow(0.5, -difference);
        //                                 array[i].attributes.labelYOffset = array[i].attributes.labelYOffset * Math.pow(0.5, -difference);
        //                                 array[i].attributes.backgroundXOffset = array[i].attributes.backgroundXOffset * Math.pow(0.5, -difference);
        //                                 array[i].attributes.backgroundYOffset = array[i].attributes.backgroundYOffset * Math.pow(0.5, -difference);
        //                                 array[i].attributes.graphicXOffset = array[i].attributes.graphicXOffset * Math.pow(0.5, -difference);
        //                                 array[i].attributes.graphicYOffset = array[i].attributes.graphicYOffset * Math.pow(0.5, -difference);
        //                             }
        //                         } else if (difference == 0) {
        //                             array[i].attributes.backgroundWidth = array[i].data.backgroundWidth;
        //                             array[i].attributes.size = array[i].data.size;
        //                             array[i].attributes.fontSize = array[i].data.fontSize;
        //                             array[i].attributes.labelYOffset = array[i].data.labelYOffset;
        //                             array[i].attributes.backgroundXOffset = array[i].data.backgroundXOffset;
        //                             array[i].attributes.backgroundYOffset = array[i].data.backgroundYOffset;
        //                             array[i].attributes.graphicXOffset = array[i].data.graphicXOffset;
        //                             array[i].attributes.graphicYOffset = array[i].data.graphicYOffset;
        //                         }
        //                     }
        //                     layerArray[a].startzoom = zoom;
        //                     layer.removeAllFeatures();
        //                     layer.addFeatures(array);
        //                 }
        //             }
        //             if (layerArray[a].name == "photo3") {
        //                 var len = gMap.getRenderableCount(layerArray[a].name);
        //                 if (len > 0) {
        //                     var layer = gMap.getsmtlayer(layerArray[a].name);
        //                     var features = layer.features;
        //                     var array = new Array();
        //                     for (var i = 0; i < features.length; i++) {
        //                         array.push(features[i]);
        //                     }
        //
        //                     for (var i = 0; i < array.length; i++) {
        //                         if (difference > 0) {
        //                             if (zoom >= 9) {
        //                                 array[i].attributes.graphicWidth = array[i].data.graphicWidth;
        //                                 array[i].attributes.graphicXOffset = array[i].data.graphicXOffset;
        //                                 array[i].attributes.graphicYOffset = array[i].data.graphicYOffset;
        //                             } else {
        //                                 array[i].attributes.graphicWidth = array[i].attributes.graphicWidth * Math.pow(2, difference);
        //                                 array[i].attributes.graphicXOffset = array[i].attributes.graphicXOffset * Math.pow(2, difference);
        //                                 array[i].attributes.graphicYOffset = array[i].attributes.graphicYOffset * Math.pow(2, difference);
        //                             }
        //                         } else if (difference < 0) {
        //                             if (zoom >= 9) {
        //                                 array[i].attributes.graphicWidth = array[i].data.graphicWidth;
        //                                 array[i].attributes.graphicXOffset = array[i].data.graphicXOffset;
        //                                 array[i].attributes.graphicYOffset = array[i].data.graphicYOffset;
        //                             } else {
        //                                 array[i].attributes.graphicWidth = array[i].attributes.graphicWidth * Math.pow(0.5, -difference);
        //                                 array[i].attributes.graphicXOffset = array[i].attributes.graphicXOffset * Math.pow(0.5, -difference);
        //                                 array[i].attributes.graphicYOffset = array[i].attributes.graphicYOffset * Math.pow(0.5, -difference);
        //                             }
        //                         } else if (difference == 0) {
        //                             array[i].attributes.graphicWidth = array[i].data.graphicWidth;
        //                             array[i].attributes.graphicXOffset = array[i].data.graphicXOffset;
        //                             array[i].attributes.graphicYOffset = array[i].data.graphicYOffset;
        //                         }
        //                     }
        //                     layerArray[a].startzoom = zoom;
        //                     layer.removeAllFeatures();
        //                     layer.addFeatures(array);
        //                 }
        //             }
        //             if (layerArray[a].name == "xhlxbyid") {
        //                 var len = gMap.getRenderableCount(layerArray[a].name);
        //                 if (len > 0) {
        //                     var layer = gMap.getsmtlayer(layerArray[a].name);
        //                     var features = layer.features;
        //                     var array = new Array();
        //                     for (var i = 0; i < features.length; i++) {
        //                         array.push(features[i]);
        //                     }
        //
        //                     for (var i = 0; i < array.length; i++) {
        //                         if (difference > 0) {
        //                             if (zoom >= 13) {
        //                                 if (typeof (array[i].data.name) == "undefined") {
        //                                     array[i].attributes.name = "";
        //                                 } else {
        //                                     array[i].attributes.name = array[i].data.name;
        //                                 }
        //                             } else if (zoom < 13) {
        //                                 array[i].attributes.name = "";
        //                             }
        //                         } else if (difference < 0) {
        //                             if (zoom >= 13) {
        //                                 if (typeof (array[i].data.name) == "undefined") {
        //                                     array[i].attributes.name = "";
        //                                 } else {
        //                                     array[i].attributes.name = array[i].data.name;
        //                                 }
        //                             } else if (zoom < 13) {
        //                                 array[i].attributes.name = "";
        //                             }
        //                         } else if (difference == 0) {
        //                             array[i].attributes.name = array[i].data.name;
        //                         }
        //                     }
        //                     layerArray[a].startzoom = zoom;
        //                     layer.removeAllFeatures();
        //                     layer.addFeatures(array);
        //                 }
        //             }
        //             if (layerArray[a].name == "sjcj") {
        //                 var len = gMap.getRenderableCount(layerArray[a].name);
        //                 if (len > 0) {
        //                     var layer = gMap.getsmtlayer(layerArray[a].name);
        //                     var features = layer.features;
        //                     var array = new Array();
        //                     for (var i = 0; i < features.length; i++) {
        //                         array.push(features[i]);
        //                     }
        //
        //                     for (var i = 0; i < array.length; i++) {
        //                         if (difference > 0) {
        //                             if (zoom >= 11) {
        //                                 if (typeof (array[i].data.name) == "undefined") {
        //                                     array[i].attributes.name = "";
        //                                 } else {
        //                                     array[i].attributes.name = array[i].data.name;
        //                                 }
        //                             } else if (zoom < 11) {
        //                                 array[i].attributes.name = "";
        //                             }
        //                         } else if (difference < 0) {
        //                             if (zoom >= 11) {
        //                                 if (typeof (array[i].data.name) == "undefined") {
        //                                     array[i].attributes.name = "";
        //                                 } else {
        //                                     array[i].attributes.name = array[i].data.name;
        //                                 }
        //                             } else if (zoom < 11) {
        //                                 array[i].attributes.name = "";
        //                             }
        //                         } else if (difference == 0) {
        //                             array[i].attributes.name = array[i].data.name;
        //                         }
        //                     }
        //                     layerArray[a].startzoom = zoom;
        //                     layer.removeAllFeatures();
        //                     layer.addFeatures(array);
        //                 }
        //             }
        //             if (layerArray[a].name == "jgd") {
        //
        //                 //var len = gMap.getRenderableCount(layerArray[a].name);
        //
        //                 //if (len > 0) {
        //                 //    var layer = gMap.getsmtlayer(layerArray[a].name);
        //                 //    var features = layer.features;
        //                 //    var array = new Array();
        //                 //    for (var i = 0; i < features.length; i++) {
        //                 //        array.push(features[i]);
        //                 //    }
        //
        //                 //    for (var i = 0; i < array.length; i++) {
        //                 //        if (difference > 0) {
        //                 //            if (zoom >= 10) {
        //                 //                array[i].attributes.name = array[i].data.name;
        //                 //            }
        //                 //            else if (zoom < 10) {
        //                 //                array[i].attributes.name = "";
        //                 //            }
        //                 //        }
        //                 //        else if (difference < 0) {
        //                 //            if (zoom >= 10) {
        //                 //                array[i].attributes.name = array[i].data.name;
        //                 //            }
        //                 //            else if (zoom < 10) {
        //                 //                array[i].attributes.name = "";
        //                 //            }
        //                 //        }
        //                 //        else if (difference == 0) {
        //                 //            array[i].attributes.name = array[i].data.name;
        //                 //        }
        //                 //    }
        //                 //    layerArray[a].startzoom = zoom;
        //                 //    layer.removeAllFeatures();
        //                 //    layer.addFeatures(array);
        //                 //}
        //             }
        //             if (layerArray[a].name == "xhss") {
        //                 var len = gMap.getRenderableCount(layerArray[a].name);
        //                 if (len > 0) {
        //                     var layer = gMap.getsmtlayer(layerArray[a].name);
        //                     var features = layer.features;
        //                     var array = new Array();
        //                     for (var i = 0; i < features.length; i++) {
        //                         array.push(features[i]);
        //                     }
        //
        //                     for (var i = 0; i < array.length; i++) {
        //                         if (difference > 0) {
        //                             if (zoom >= 10) {
        //                                 array[i].attributes.name = array[i].data.name;
        //                             } else if (zoom < 10) {
        //                                 array[i].attributes.name = "";
        //                             }
        //                         } else if (difference < 0) {
        //                             if (zoom >= 10) {
        //                                 array[i].attributes.name = array[i].data.name;
        //                             } else if (zoom < 10) {
        //                                 array[i].attributes.name = "";
        //                             }
        //                         } else if (difference == 0) {
        //                             array[i].attributes.name = array[i].data.name;
        //                         }
        //                     }
        //                     layerArray[a].startzoom = zoom;
        //                     layer.removeAllFeatures();
        //                     layer.addFeatures(array);
        //                 }
        //             }
        //
        //         }
        //     }
        // });

        // this.setMousePointerSwitcher();
    }
    ;

    //    this.SetZtdtVisible = function (layername, flag) {
    //        wms = GetExtendWms(layername, "wms", true);
    //        map.addLayer(wms);
    //居中
    this.makeCenter = function () {
        map.setCenter(new Geo.LonLat(centerPoint.lon, centerPoint.lat), centerPoint.minzoom);
    };

    function onAddFeature(feature) {
        alert("add");
    }

    this.deleteFeature = function () {
        var fs = vectors.features;
        var i = 0;
        var len = fs.length;
        var siteObjs = [];
        for (; i < len; i++) {
            var fea = fs[i];
            if (!fea.hasOwnProperty('renderIntent')) {
                siteObjs.push(fea);
                continue;
            }
            if (fea.renderIntent && fea.renderIntent == "select") {
                siteObjs.push(fea);
                continue;
            }
            if (!fea.state) {
                siteObjs.push(fea);
                continue;
            }
        }
        vectors.removeFeatures(siteObjs);
        vectors.redraw();
    }

    this.clearFeature = function () {
        //        vectors.removeAllFeatures();
        //RemovePointsSearch(obj);
        for (key in measureControls) {
            control = measureControls[key];
            //map.removeControl(control);
            control.cancel();
            test123layer.setVisible(false);
            test123layer.removeAllFeatures();
            // map.removeLayer(test123layer);
            control.deactivate();
        }
    }


    //使所有的修改要素控件失效。
    this.deactiveModifyControls = function () {
        for (key in controls) {
            var control = controls[key];
            control.deactivate();
        }
    }


    /**
     * 增加元素框选、鼠标移入、移出事件控件。 这里都通过OpenLayers API中的selectFeature控件来实现。
     * 同时只能有一个selectFeature控件起效。
     */
    this.activateClickFeatureControl = function () {
        // 鼠标移出，移入事件控件。
        kFeature.deactivate();
        qFeature.deactivate();
        this.deactiveModifyControls();
        sFeature.activate();
    };

    /**
     * 添加框选控件。
     */
    this.activateRectFeatureControl = function () {
        // 框选控件
        sFeature.deactivate();
        qFeature.deactivate();
        this.deactiveModifyControls();
        kFeature.activate();
    };

    this.activateQiPaoFeatureControl = function () {
        // 框选控件
        sFeature.deactivate();
        kFeature.deactivate();
        this.deactiveModifyControls();
        qFeature.activate();
    };

    /**
     * 增加鼠标信息显示控件。
     */
    this.addMousePosition = function (styleName) {
        const mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(8),
            projection: displayProjection,
            // ssy position
            // projection: "EPSG:3857",
            // projection: "EPSG:4490",
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'ol-mouse-position',
            target: document.getElementById('mouse-position'),
            undefinedHTML: '&nbsp;'
        });
        mousePositionControl.element.style.borderRadius = "5px 5px 5px 5px";
        mousePositionControl.element.style.background = "#38403987";
        mousePositionControl.element.style.color = "#33f8ff";
        map.addControl(mousePositionControl);
        //
        // const mousePositionControl_3857 = new ol.control.MousePosition({
        //     coordinateFormat: ol.coordinate.createStringXY(8),
        //     // projection: displayProjection,
        //     // ssy position
        //     projection: "EPSG:3857",
        //     // projection: "EPSG:4490",
        //     // comment the following two lines to have the mouse position
        //     // be placed within the map.
        //     className: 'ol-mouse-position',
        //     target: document.getElementById('mouse-position'),
        //     undefinedHTML: '&nbsp;'
        // });
        // mousePositionControl_3857.element.style.borderRadius = "5px 5px 5px 5px";
        // mousePositionControl_3857.element.style.background = "#38403987";
        // mousePositionControl_3857.element.style.color = "#33f8ff";
        // mousePositionControl_3857.element.style.top = "30px";
        // map.addControl(mousePositionControl_3857);

    };

    var getSelectIconStyle = function (act, pointFeature) {
        if (act == "unSelect") {
            if (pointFeature.stream_status == "0") {
                pointFeature.style = style_error[0];
            } else if (pointFeature.stream_status == "1") {
                pointFeature.style = style_ok[0];
            } else if (pointFeature.stream_status == "2") {
                pointFeature.style = style_problem[0];
            }
        } else if (act == "select") {
            if (pointFeature.stream_status == "0") {
                pointFeature.style = style_error[1];
            } else if (pointFeature.stream_status == "1") {
                pointFeature.style = style_ok[1];
            } else if (pointFeature.stream_status == "2") {
                pointFeature.style = style_problem[1];
            }
        }
    };

    this.getFeature = function (fourchar) {
        var lls = allyw_layers;
        for (var j = 0, len1 = lls.length; j < len1; j++) {
            var fs = lls[j].features;
            for (var i = 0, len = fs.length; i < len; i++) {
                if (fs[i].hasOwnProperty("fourChar")
                    && fs[i].fourChar == fourchar) {
                    return {
                        feature: fs[i],
                        layer: lls[j]
                    };
                }
            }
        }
        return null;
    };
    this.getFeature2 = function (siteid) {
        var lls = allyw_layers;
        for (var j = 0, len1 = lls.length; j < len1; j++) {
            var fs = lls[j].features;
            for (var i = 0, len = fs.length; i < len; i++) {
                if (fs[i].hasOwnProperty("siteid")
                    && fs[i].siteid == siteid) {
                    return {
                        feature: fs[i],
                        layer: lls[j]
                    };
                }
            }
        }
        return null;
    };

    this.checkDeleteedFeatures = function (siteArray) {

        var fourChar = null;
        var flag = 0;

        var lls = allyw_layers;
        for (var j = 0, len1 = lls.length; j < len1; j++) {
            var fs = lls[j].features;
            for (var i = 0, len = fs.length; i < len; i++) {
                if (fs[i].hasOwnProperty("fourChar")) {
                    fourChar = fs[i].fourChar;
                    flag = 0;
                    for (var k = 0; k < siteArray.length; k++) {
                        if (siteArray[k].fourChar == fourChar) {
                            flag = 1;
                            break;
                        }
                    }
                    if (flag == 0) {
                        lls[j].removeFeatures(fs[i]);
                    }
                }
            }
        }
    }

    /**
     * 设置图层的显示与隐藏。
     */
    this.setLayerVisible = function (layername, flag) {
        var layer1 = null;
        layer1 = this.getsmtlayer(layername);
        if (layer1)
            layer1.setVisible(flag);

        if (layername === 'lw') {
            if (flag) {
                var isYes = $('#gnssLegend')[0].checked;
            }
        }

        if (layername == "blh")
            layers_blh.setVisible(flag);
    }

    /**
     * 添加基准站要素信息。
     */
    this.addSiteFeature = function (siteObj) {
        var layer1 = null
        layer1 = this.getsmtlayer(siteObj.action);
        var point1 = new Geo.Geometry.Point(siteObj.lon, siteObj.lat);
        var pointFeature1 = new Geo.Feature.Vector(point1);
        pointFeature1.fourChar = siteObj.fourChar;
        pointFeature1.action = siteObj.action;
        pointFeature1.stream_status = siteObj.stream_status;
        pointFeature1.siteid = siteObj.siteid;
        pointFeature1.attributes.name = siteObj.siteName;
        pointFeature1.attributes.fourChar = siteObj.fourChar;
        //资源采集
        pointFeature1.attributes.img = siteObj.img;
        //巡护路线图标大小
        if (siteObj.action == "xhlxbyid") {
            pointFeature1.attributes.size = siteObj.size;
            pointFeature1.attributes.pic = siteObj.pic;
            pointFeature1.attributes.fontSize = siteObj.fontSize;

            //pointFeature1.data.fontSize = siteObj.fontSize;
            //pointFeature1.data.name = siteObj.siteName;
        }
        if (siteObj.action == "sjcj" && siteObj.checkimg == "1") {//
            //pointFeature1.data.name = siteObj.siteName;
            vlayer_photos3.setVisible(true);
            vlayer_photos4.setVisible(true);
            //pointFeature1.attributes.pic = siteObj.pic;

            var pt = new ol.Geometry.Point(siteObj.lon, siteObj.lat);
            var pt2 = new ol.Geometry.Point(siteObj.lon, siteObj.lat);

            var feature_point = new ol.Feature.Vector(pt,
                {
                    label: "",
                    pic: "http://www.hclbs.com/webgis/swf/photo_back.png",
                    //img: "http://www.hclbs.com/" + siteObj.pic,
                    img: siteObj.pic,
                    size: 50,
                    fontSize: 12,
                    backgroundWidth: 60,
                    backgroundXOffset: -32,
                    backgroundYOffset: -78,
                    graphicXOffset: -27,
                    graphicYOffset: -73,
                    labelXOffset: -20,
                    labelYOffset: 78
                }
            );
            feature_point.action = siteObj.action;
            feature_point.fourChar = siteObj.fourChar;
            feature_point.siteid = siteObj.siteid;
            vlayer_photos4.addFeatures([feature_point]);
            var feature_point2 = new ol.Feature.Vector(pt2,
                {
                    fjid: siteObj.siteName,
                    graphicWidth: 10,
                    graphicXOffset: -5,
                    graphicYOffset: -18
                });
            feature_point2.action = siteObj.action;
            feature_point2.siteid = siteObj.siteid;

            vlayer_photos3.addFeatures([feature_point2]);
        }
        pointFeature1.data.name = siteObj.siteName;
        layer1.addFeatures([pointFeature1]);
    };
    /**
     * 获取处于选中状态的基准站要素。
     *
     * @return
     */
    this.getSelectedFeatures = function () {
        var lls = allyw_layers;
        var ss = new Array();
        for (var j = 0, len1 = lls.length; j < len1; j++) {
            var fs = lls[j].features;
            for (var i = 0, len = fs.length; i < len; i++) {
                if (fs[i].hasOwnProperty("selected") && fs[i].selected == "1") {
                    ss.push(fs[i]);
                }
            }
        }
        return ss;
    };

    this.getRectLonLat = function () {
        var ss = gMap.getSelectedFeatures();
        if (ss == null || ss.length == 0)
            return null;
        var minLat = 0, minLon = 0;
        maxLat = 0, maxLon = 0;
        for (var i = 0; i < ss.length; i++) {
            var s = ss[i];
            if (i == 0) {
                minLat = s.geometry.y;
                minLon = s.geometry.x;
                maxLat = s.geometry.y;
                maxLon = s.geometry.x;
            } else {
                if (s.geometry.y < minLat) {
                    minLat = s.geometry.y;
                }
                if (s.geometry.x < minLon) {
                    minLon = s.geometry.x;
                }
                if (s.geometry.y > maxLat) {
                    maxLat = s.geometry.y;
                }
                if (s.geometry.x > maxLon) {
                    maxLon = s.geometry.x;
                }
            }
        }
        return [minLon, minLat, maxLon, maxLat];
    };


    //获取点的经纬度
    this.getLonLatSearch = function () {

        // vectors.
        var str = "";
        //        var fs = vectors.features;
        //        //panduan
        //        if (fs == null || fs.length == 0)
        //            return null;
        //        var s = fs[0];
        //        if (s.geometry.components[0]) {
        //            var arr = s.geometry.components[0].components;
        //            {
        //                for (var j = 0; j < arr.length; j++) {
        //                    var pt = arr[j];
        //                    var minLat = pt.y;
        //                    var minLon = pt.x;
        //                    str += minLon + "," + minLat + " ";
        //                }
        //            }
        //        }


        if (pppoints && pppoints.length > 0) {

            for (var j = 0; j < pppoints.length; j++) {
                var pt = pppoints[j];
                var minLat = pt.y;
                var minLon = pt.x;
                str += minLon + "," + minLat + " ";
            }
        }

        return str;
        // setMousePositionStart();
    };
    //移除原来的图层
    this.RemovePointsSearch = function (obj) {
        // vectors.
        //        var fs = vectors.features;
        //        var length = fs.length;
        //        for (var i = length - 1; i >= 0; i--) {
        //            var s = fs[i];
        //            vectors.removeFeatures(s);
        //        }
        //        if (pppoints && pppoints.length > 0) {
        //            var length = pppoints.length;
        //            for (var j = length - 1; j >= 0; j--) {
        //                var pt = pppoints[j];

        //            }
        //        }

        control = measureControls[obj];
        //map.removeControl(control);
        control.cancel();
        test123layer.setVisible(false);
        test123layer.removeAllFeatures();
        // map.removeLayer(test123layer);
        control.deactivate();
    };
    /**
     * 添加元素鼠标事件。
     *
     * @param type
     * @param handler
     * @return
     */
    this.addEventHandler = function (type, handler) {
        if (eventTarget == null) {
            eventTarget = new EventTarget();
        }
        eventTarget.addHandler(type, handler);
    };

    this.addEventHandler2 = function (eve) {
        if (eventTarget == null) {
            eventTarget = new EventTarget();
        }
        eventTarget.fire(eve);
    };

    var popup;

    /**
     * 弹出浮动窗口。
     *
     * @param feature
     * @param htmlStr
     * @param wClosehandler
     * @return
     */
    this.popUpMessageWindow = function (feature, htmlStr, onPopupClose) {
        popup = new Geo.View2D.Popup.FramedCloud("chicken", feature.geometry
                .getBounds().getCenterLonLat(), null, htmlStr, null, false,
            onPopupClose);

        feature.popup = popup;
        map.addPopup(popup);
    };

    this.popUpMessageWindow2 = function (y, x, htmlStr, onPopupClose) {
        //popup = new Geo.View2D.Popup.FramedCloud("chicken", feature.geometry
        //    .getBounds().getCenterLonLat(), null, htmlStr, null, false,
        //    onPopupClose);

        popup = new ol.Popup.FramedCloud("chicken",
            [x, y],
            [400, 400],
            htmlStr, null,
            false, onPopupClose);
        //feature.popup = popup;
        map.addPopup(popup);
    };

    /**
     * 移除浮动窗口。
     *
     * @param feature
     * @return
     */
    this.removeMessageWindow = function (feature) {
        // if (feature == null) { removeAllMessageWindow();return; }
        if (feature != null && feature.popup != null) {
            map.removePopup(feature.popup);
            feature.popup.destroy();
            feature.popup = null;
        } else {
            this.removeAllMessageWindow();
        }
    };

    this.removeAllMessageWindow = function () {
        var layerArray = new Array();
        for (i = 0; i < map.popups.length; i++) {
            layerArray.push(map.popups[i]);
        }
        for (i = 0; i < layerArray.length; i++) {
            map.removePopup(layerArray[i]);
        }

    };

    this.getsmtlayer = function (layername) {
        var layer1 = null;
        if (layername == "cz") {
            layername = "jmd";
        }
        if (layername == "bhz") {
            layer1 = vLayer_bhz;
        } else if (layername == "jb") {
            layer1 = vLayer_jb;
        } else if (layername == "jz") {
            layer1 = vLayer_jz;
        } else if (layername == "xcp") {
            layer1 = vLayer_xcp;
        } else if (layername == "bhd") {
            layer1 = vLayer_bhd;
        } else if (layername == "lwt") {
            layer1 = vLayer_lwt;
        } else if (layername == "gs") {
            layer1 = vLayer_gs;
        } else if (layername == "sjcj") {
            layer1 = vLayer_sjcj;
        } else if (layername == "ywcj") {
            layer1 = vLayer_ywcj;
        } else if (layername == "xmsjgl") {
            layer1 = vLayer_xmsjgl;
        } else if (layername == "gytd") {
            layer1 = vLayer_gytd;
        } else if (layername == "hwxj") {
            layer1 = vLayer_hwxj;
        } else if (layername == "txjz") {
            layer1 = vLayer_txjz;
        } else if (layername == "yd") {
            layer1 = vLayer_yd;
        } else if (layername == "qxz") {
            layer1 = vLayer_qxz;
        } else if (layername == "bhz") {
            layer1 = vLayer_bhz;
        } else if (layername == "lyd") {
            layer1 = vLayer_lyd;
        } else if (layername == "jgd") {
            layer1 = vLayer_jgd;
        } else if (layername == "dz") {
            layer1 = vLayer_dz;
        } else if (layername == "sk") {
            layer1 = vLayer_sk;
        } else if (layername == "qxz") {
            layer1 = vLayer_qxz;
        } else if (layername == "jmd") {
            layer1 = vLayer_jmd;
        } else if (layername == "yd") {
            layer1 = vLayer_yd;
        } else if (layername == "hwxj") {
            layer1 = vLayer_hwxj;
        } else if (layername == "dm") {
            layer1 = vLayer_dm;
        } else if (layername == "xmsjgl") {
            layer1 = vLayer_xmsjgl;
        } else if (layername == "com") {
            layer1 = vLayer_com;
        } else if (layername == "xb") {
            layer1 = vLayer_xb;
        } else if (layername == "xhss") {
            layer1 = vLayer_xhss;
        } else if (layername == "smtxb_ldsuyq") {
            layer1 = layersmtxb_ldsuyq;
        } else if (layername == "smtxb_ldsiyq") {
            layer1 = layersmtxb_ldsiyq;
        } else if (layername == "smtxb_lmsuyq") {
            layer1 = layersmtxb_lmsuyq;
        } else if (layername == "smtxb_lmsiyq") {
            layer1 = layersmtxb_lmsiyq;
        } else if (layername == "smtxb_nl") {
            layer1 = layersmtxb_nl;
        } else if (layername == "lqt") {
            layer1 = vLayer_lq;
        } else if (layername == "gnqh") {
            layer1 = vLayer_gnqh;
        } else if (layername == "jcsj") {
            layer1 = vLayer_jcsj
        } else if (layername == "jtb") {
            layer1 = vLayer_jtb;
        } else if (layername == "bdzy") {
            layer1 = vLayer_bdzy;
        } else if (layername == "xhlxbyid") {
            layer1 = vLayer_xhlxbyid;
        } else if (layername == "xz") {
            layer1 = vLayer_xz;
        } else if (layername == "spjk") {
            layer1 = vLayer_spjk;
        } else if (layername == "xhzs") {
            layer1 = vLayer_xhzs;
        } else if (layername == "photo") {
            layer1 = vlayer_photos;
        } else if (layername == "photo2") {
            layer1 = vlayer_photos2;
        } else if (layername == "photo3") {
            layer1 = vlayer_photos3;
        } else if (layername == "photo4") {
            layer1 = vlayer_photos4;
        } else if (layername == "tianditulabel") {
            layer1 = layer_Anno;
        } else if (layername == "dldm") {
            layer1 = layer_dldm;
        } else if (layername == "yx") {
            layer1 = layer_yx;
        } else if (layername == "dx") {
            layer1 = layer_dx;
        } else if (layername == "sl") {
            layer1 = layer_sl;
        } else if (layername == "ggyx") {
            layer1 = layer_ggyx;
        } else if (layername == "ggsl") {
            layer1 = layer_ggsl;
        } else if (layername == "ggdx") {
            layer1 = layer_ggdx;
        } else if (layername == "ggdldm") {
            layer1 = layer_ggdldm;
        } else if (layername == "bjkk") {
            layer1 = layer_bjkk;
        } else if (layername == "lw") {
            layer1 = vLayer_lw;
        }
        return layer1;
    };

    this.setMousePositionStart = function () {
        isGetPositionFlag = true;
    };

    this.setMousePositionEnd = function () {
        isGetPositionFlag = false;
    };

    this.getPositionLon = function () {
        return getPosition.lon;
    };

    this.getPositionLat = function () {
        return getPosition.lat;

    };

    this.removeAllPt = function (layername) {
        var layer = this.getsmtlayer(layername);
        var fs = layer.features;
        if (fs != null) {
            var len = fs.length - 1;
            for (var i = len; i >= 0; i--) {
                layer.removeFeatures(fs[i]);
            }
        }
        return true;
    };

    this.getRenderableCount = function (layername) {
        var len = 0;
        var layer = this.getsmtlayer(layername);
        var fs = layer.features;
        if (fs != null) {
            len = fs.length;
        }
        return len;
    };

    this.gotoLatLonBZ = function (lon, lat) {
        removeAllPt("com");
        var point1 = new Geo.Geometry.Point(lon, lat);
        var pointFeature1 = new Geo.Feature.Vector(point1);
        pointFeature1.fourChar = "com_1";
        pointFeature1.stream_status = "1";
        pointFeature1.siteid = "1";
        pointFeature1.attributes.name = "";
        vLayer_com.addFeatures([pointFeature1]);

        map.setCenter(new Geo.LonLat(lon, lat), 15);
    }

    this.gotoLatLon = function (lon, lat, zoom) {
        if (undefined == zoom)
            zoom = 10;
        map.setCenter(new Geo.LonLat(lon, lat), zoom);
    }

    this.zoomIn = function () {
        if (map.getView().getZoom() < map.getView().getMaxZoom()) {
            map.getView().setZoom(map.getView().getZoom() + 1);
        }
    }

    this.zoomOut = function () {
        if (map.getView().getZoom() > map.getView().getMinZoom()) {
            map.getView().setZoom(map.getView().getZoom() - 1);
        }
    }

    //小班图层
    this.createSLXBPolygon = function (value, action) {
        this.setLayerVisible("xb", true);
        var strValues = value.split("|");
        var x1 = 0;
        var x2 = 1000;
        var y1 = 0;
        var y2 = 1000;
        for (var k = 0; k < strValues.length; k++) {
            var strValue = strValues[k].split(";");

            var strName = strValue[0];
            var strPts = strValue[1];
            var y = parseFloat(strValue[2]);
            var dlat = parseFloat(y);
            var x = parseFloat(strValue[3]);
            var dlon = parseFloat(x);
            var XM = strValue[4];
            var XZM = strValue[5];
            var CM = strValue[6];
            var LBH = strValue[7];
            var XBH = strValue[8];
            var XXBH = strValue[9];

            var sPts = strPts.split(" "); //经纬度格式：y,x y,x

            var xbid = "xb" + "_" + strName;
            var fourChar = "xb_" + xbid + "_p";

            this.createPolygon(vLayer_xb, "xb", sPts, fourChar, xbid, strName);

            var sObj = new Object();
            sObj.lon = dlon;
            sObj.lat = dlat;
            sObj.fourChar = XBH;
            sObj.status = 1;
            sObj.siteName = xbid;
            sObj.stream_status = 1
            //sObj.siteid = xbid;
            sObj.siteid = xbid;
            sObj.action = "xb";
            this.addSiteFeature(sObj);

            if (y1 < dlat)
                y1 = dlat;
            if (x1 < dlon)
                x1 = dlon;
            if (y2 > dlat)
                y2 = dlat;
            if (x2 > dlon)
                x2 = dlon;
        }
        var xx = (x1 + x2) / 2;
        var yy = (y1 + y2) / 2;

        if (action == "xball") {
            map.setCenter(new Geo.LonLat(centerPoint.lon, centerPoint.lat), centerPoint.minzoom);
        } else {
            map.setCenter(new Geo.LonLat(xx, yy), 15);
        }


    }

    //删除小班图
    this.DelSLXBPolygon = function (value) {
        var strValues = value.split("|");
        for (var k = 0; k < strValues.length; k++) {
            var strValue = strValues[k].split(";");

            var strName = strValue[0];
            var strPts = strValue[1];
            var y = strValue[2];
            var dlat = y;
            var x = strValue[3];
            var dlon = x;
            var XM = strValue[4];
            var XZM = strValue[5];
            var CM = strValue[6];
            var LBH = strValue[7];
            var XBH = strValue[8];
            var XXBH = strValue[9];

            var sPts = strPts.split(" "); //经纬度格式：y,x y,x

            var xbid = "xb" + "_" + strName;
            var fourChar = "xb_" + xbid + "_p";

            var pointChar = xbid;

            //1。删除图形
            //2.删除点
            //vLayer_xb.setVisible(false);

            var fobj = this.getFeature(fourChar);
            if (fobj !== null) {
                fobj.layer.removeFeatures(fobj.feature);
            } else {

            }

            var pobj = this.getFeature2(pointChar);
            if (pobj !== null) {
                pobj.layer.removeFeatures(pobj.feature);
            } else {

            }

            //vLayer_xb.removeFeatures(sObj.feature);
        }
    }

    //画图层
    this.createPolygon = function (vlayer, action, spts, fourChar, id, name) {
        var layer1 = null
        layer1 = this.getsmtlayer(action);
        var points = new Array();
        for (var i = 0; i < spts.length; i++) {
            var p = spts[i].split(',');
            points.push(new ol.Geometry.Point(parseFloat(p[0]), parseFloat(p[1])));
        }
        var feature_polygon = new ol.Feature.Vector(
            new ol.Geometry.Polygon(new ol.Geometry.LinearRing(
                points
            )),
            {
                'location': 'Fanghorn Forest',
                'description': 'Land of the Ents'
            }
        );


        feature_polygon.fourChar = fourChar;
        feature_polygon.stream_status = "1";
        //feature_polygon.siteid = id;
        feature_polygon.siteid = id;
        feature_polygon.action = action;
        //feature_polygon.attributes.name = fourChar;
        feature_polygon.attributes.name = "";
        feature_polygon.attributes.fourChar = "";

        layer1.addFeatures([feature_polygon]);
    }

    ///创建照片墙
    this.createPhotos = function (value) {
        var strValues = value.split("|");
        var lat;
        var lon;
        for (var k = 0; k < strValues.length; k++) {
            var strValue = strValues[k].split(";");
            var lstlj = strValue[4];
            var fjid = strValue[3];
            var glid = strValue[6];
            var fourChar = "photo_" + fjid + "_p";
            var lat;
            var lon;
            var lat = parseFloat(strValue[8]);
            if (lat > 50) {
                lat = parseFloat(strValue[7]);
                lon = parseFloat(strValue[8]);
            } else {
                lon = parseFloat(strValue[7]);
            }
            var pt = new ol.Geometry.Point(lon, lat);
            var pt2 = new ol.Geometry.Point(lon, lat);
            var feature_point = new ol.Feature.Vector(pt,
                {
                    fjid: fjid,
                    action: "photo",
                    stream_status: "1",
                    lstlj: lstlj
                }
            );
            feature_point.fourChar = fourChar;
            feature_point.glid = glid;
            feature_point.siteid = fjid;
            vlayer_photos.addFeatures([feature_point]);

            var feature_point2 = new ol.Feature.Vector(pt2,
                {
                    fjid: fjid,
                    action: "photo",
                    stream_status: "1",
                    lstlj: lstlj
                }
            );
            vlayer_photos2.addFeatures([feature_point2]);
        }
        vlayer_photos.setVisible(true);
        vlayer_photos2.setVisible(true);
    }

    this.createPolyline = function (obj) {
        // console.log(obj)
        var layer1 = null
        layer1 = this.getsmtlayer(obj.action);//图层标记
        var points = [];
        for (var i = 0; i < obj.sPts.length; i++) {
            var p = obj.sPts[i].split(',');
            points.push([Number(p[1]), Number(p[2])]);
        }
        var feature_line = new ol.Feature({geometry: new ol.geom.LineString(points)});

        feature_line.lgType = obj.type;
        if (obj.type === '高速公路') {
            feature_line.color = '#b398da'
            feature_line.width = 7
            feature_line.opacity = 0.8
        } else if (obj.type === '国道' || obj.type === '省道') {
            feature_line.color = '#f0df78'
            feature_line.width = 5
            feature_line.opacity = 0.8
        } else if (obj.type === '小油路') {
            feature_line.color = '#ff0000'
            feature_line.width = 3
            feature_line.opacity = 0.8
        } else if (obj.type === '土路') {
            feature_line.color = '#000000'
            feature_line.width = 3
            feature_line.opacity = 0.8
        } else if (obj.type === '沙漠地带路') {
            feature_line.color = '#a7a7a7'
            feature_line.width = 3
            feature_line.opacity = 0.8
        } else {
            feature_line.lgType = '未知';
            feature_line.color = '#11ff00'
            feature_line.width = 3
            feature_line.opacity = 0.8
        }

        layer1.getSource().addFeature(feature_line);
        return feature_line;
    }

    this.colorDiv_w = 30;
    this.colorDiv_h = 20;
    this.createLineLegend = function (lineFeature, legendMap) {
        if (!legendMap.has(lineFeature.lgType) || legendMap.get(lineFeature.lgType) == null) {
            var divDOM = document.createElement("div");
            // colorDiv.style.height = this.colorDiv_h + "px";
            // colorDiv.style.width = this.colorDiv_w + "px";

            var lineHtml = '<svg width="' + this.colorDiv_w + '" height="' + this.colorDiv_h + '">';
            lineHtml += '<polyline points="5,15,28,15" fill="none" stroke="' + lineFeature.color +
                '" stroke-opacity="' + lineFeature.opacity + '" stroke-width="' + lineFeature.width + '"';
            lineHtml += ' stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="none"></polyline></svg>';
            lineHtml += '<span>&#12288;' + lineFeature.lgType + '</span>';
            divDOM.innerHTML = lineHtml;

            legendMap.set(lineFeature.lgType, divDOM);
        }
    }

    this.legendMap = new Map();
    this.legendVisCount = 0;
    this.createLegend = function (type, legendMap) {
        var divDOM = document.createElement("div");
        divDOM.className = 'oneLegend';
        divDOM.style.display = 'none';
        legendMap.forEach(function (value) {
            if (value) {
                divDOM.appendChild(value);
            }
        });
        this.legendMap.set(type, divDOM);
        var legenDOM = document.getElementById('gnssLegend');
        legenDOM.appendChild(divDOM);
        var layer1 = null
        layer1 = this.getsmtlayer(type);//图层标记
        if (layer1.getVisible()) {
            this.setLegendVisible(type, true);
        }
    }

    this.setLegendVisible = function (type, isVis) {
        var divDOM = null;
        if (this.legendMap.has(type)) {
            divDOM = this.legendMap.get(type);
        } else {
            return;
        }
        if (isVis) {
            divDOM.style.display = '';
            this.legendVisCount++;
            if (this.legendVisCount >= this.legendMap.size - 1) {
                this.legendVisCount = this.legendMap.size - 1;
            }
        } else {
            divDOM.style.display = 'none';
            this.legendVisCount--;
            if (this.legendVisCount <= 0) {
                this.legendVisCount = 0;
            }
        }
    }

    //画多边型和名称:功能区划、图幅图层、乡镇区划
    this.createPolygon2 = function (obj) {
        var layer1 = null
        var color = "#80FF80";
        var xoffset = 0;
        var yoffset = 0;
        layer1 = this.getsmtlayer(obj.action);//图层标记
        var pt = null;
        if (obj.x && obj.y) {
            new ol.geom.Point([obj.x, obj.y]);
        }
        var points = [];
        for (var i = 0; i < obj.sPts.length; i++) {
            var p = obj.sPts[i].split(',');
            points.push([Number(p[0]), Number(p[1])]);
        }
        var feature_line = new ol.Feature({geometry: new ol.geom.Polygon([points])});

        feature_line.fourChar = obj.action;
        feature_line.stream_status = "1";
        feature_line.action = obj.action;
        if (obj.action == "gnqh" || obj.action == "xz" || obj.action == 'jtb') {
            feature_line.name = obj.name;
            feature_line.fourChar = obj.name;
        } else {
            feature_line.name = "";
            feature_line.fourChar = "";
        }
        //功能区划
        if (obj.name == "核心区") {
            color = "#80FF80";
        } else if (obj.name == "缓冲区") {
            color = "#FFFF00";
        } else if (obj.name == "实验区") {
            color = "#FF0000";
        }

        //乡镇区划
        else if (obj.name == "限制性生态红线") {
            color = "#d312f0";
        } else if (obj.name == "禁止性生态红线") {
            color = "#fb1919";
        } else if (obj.name == "横石塘") {
            color = "#16DCA7";
        } else if (obj.name == "英红") {
            color = "#78258F";
        } else if (obj.action == "xz") {
            color = "#b81212";
        } else if (obj.action == "jtb") {
            color = "#006a00";
        } else {
            color = "#405ffd";
        }

        feature_line.color = color;
        feature_line.xoffset = xoffset;
        feature_line.yoffset = yoffset;

        layer1.getSource().addFeature(feature_line);

        if (pt != null) {
            var feature_point = new ol.Feature({geometry: pt});
            feature_point.fourChar = obj.name;
            feature_point.name = "";
            vLayer_jgd.getSource().addFeature(feature_point);
        }
    }

    this.CreateG7 = function () {
        var pt = new ol.Geometry.Point(99.401, 41.928);
        var feature_point2 = new Geo.Feature.Vector(pt);
        feature_point2.fourChar = "";
        feature_point2.attributes.name = "";
        vLayer_sk.addFeatures([feature_point2]);

        var pt2 = new ol.Geometry.Point(101.733, 42.009);
        var feature_point = new Geo.Feature.Vector(pt2);
        feature_point.fourChar = "";
        feature_point.attributes.name = "";
        vLayer_sk.addFeatures([feature_point]);

        var pt3 = new ol.Geometry.Point(104.005, 41.298);
        var feature_point3 = new Geo.Feature.Vector(pt3);
        feature_point3.fourChar = "";
        feature_point3.attributes.name = "";
        vLayer_sk.addFeatures([feature_point3]);
    }
    //画线
    //vlayer, action, spts, fourChar, id
    this.createLine = function (vlayer, action, spts, color) {
        var layer1 = null
        layer1 = this.getsmtlayer(action);
        var points = new Array();
        for (var i = 0; i < spts.length; i++) {
            var p = spts[i].split(';');
            points.push(new ol.Geometry.Point(p[1], p[0]));
        }
        var feature_line = new ol.Feature.Vector(new ol.Geometry.LineString(points));

        feature_line.stream_status = "1";
        //feature_line.siteid = name;
        feature_line.action = action;
        feature_line.siteName = "";
        feature_line.attributes.name = "";
        feature_line.attributes.color = color;

        vlayer.addFeatures([feature_line]);
    }

    this.createLine2 = function (vlayer, action, pts, color) {
        var layer1 = null
        layer1 = this.getsmtlayer(action);
        var points = new Array();
        for (var i = 0; i < pts.length; i++) {
            var p = pts[i];
            points.push(new ol.Geometry.Point(p.lon, p.lat));
        }
        var feature_line = new ol.Feature.Vector(new ol.Geometry.LineString(points));

        feature_line.stream_status = "1";
        //feature_line.siteid = name;
        feature_line.action = action;
        feature_line.siteName = "";
        feature_line.attributes.name = "";
        feature_line.attributes.color = color;

        vlayer.addFeatures([feature_line]);
    }

    //林权图
    this.createLQTPolygon = function (value) {
        this.setLayerVisible("lqt", true);
        var strValues = value.split("|");
        var x1 = 0;
        var x2 = 1000;
        var y1 = 0;
        var y2 = 1000;
        for (var k = 0; k < strValues.length; k++) {
            var strValue = strValues[k].split(";");

            var strName = strValue[0];

            var strPts = strValue[1];
            var y = parseFloat(strValue[2]);
            var dlat = y;
            var x = parseFloat(strValue[3]);
            var dlon = x;

            var id = strValue[4];


            var sPts = strPts.split(" "); //经纬度格式：y,x y,x

            var lqid = id;
            var fourChar = strName + "_p";

            this.createPolygon(vLayer_lq, "lqt", sPts, fourChar, lqid, strName);

            var sObj = new Object();
            sObj.lon = dlon;
            sObj.lat = dlat;
            sObj.fourChar = id;
            sObj.name = strName;
            sObj.status = 1;
            sObj.siteName = strName;
            sObj.stream_status = 1
            //sObj.siteid = xbid;
            sObj.siteid = id;

            sObj.action = "lqt";
            this.addSiteFeature(sObj);

            if (y1 < dlat)
                y1 = dlat;
            if (x1 < dlon)
                x1 = dlon;
            if (y2 > dlat)
                y2 = dlat;
            if (x2 > dlon)
                x2 = dlon;
        }
        var xx = (x1 + x2) / 2;
        var yy = (y1 + y2) / 2;
        //map.setCenter(new Geo.LonLat(xx, yy), 15);
    }

    //删除林权图
    this.DelLQTPolygon = function (value) {
        var strValues = value.split("|");
        for (var k = 0; k < strValues.length; k++) {
            var strValue = strValues[k].split(";");

            var strName = strValue[0];
            var city_name = strValue[1];
            var cwhmc = strValue[2];
            var cwh = strValue[3];
            var strPts = strValue[4];
            var y = parseFloat(strValue[5]);
            var dlat = y;
            var x = parseFloat(strValue[6]);
            var dlon = x;
            var mi = strValue[7];
            var id = strValue[8];
            var fzr = strValue[9];
            var ldsqr = strValue[10];

            var sPts = strPts.split(" "); //经纬度格式：y,x y,x

            //var xbid = LBH + "-" + XBH + "-" + XXBH;
            //var fourChar = "xb_" + xbid + "_p";

            var lqid = id;
            var fourChar = strName + "_p";

            var pointChar = strName;

            //1。删除图形
            //2.删除点
            //vLayer_xb.setVisible(false);

            var fobj = this.getFeature(fourChar);
            if (fobj !== null) {
                fobj.layer.removeFeatures(fobj.feature);
            } else {

            }

            var pobj = this.getFeature(pointChar);
            if (pobj !== null) {
                pobj.layer.removeFeatures(pobj.feature);
            } else {

            }

            //vLayer_xb.removeFeatures(sObj.feature);
        }
    }

    //巡护路线
    this.createXHLXPolygon = function (value, action) {
        this.setLayerVisible("xhlxbyid", true);
        var strValues = value.split("|");

        //起点
        var qdurl = [webPath + "swf/qd.png"];
        var start = strValues[0];
        var startStr = start.split(";");
        var startY = startStr[0];
        var startX = startStr[1];

        //终点
        var zdurl = [webPath + "swf/zd.png"];
        var end = strValues[strValues.length - 9];
        var endStr = end.split(";");
        var endY = endStr[0];
        var endX = endStr[1];

        //巡护人
        var xhperson = strValues[strValues.length - 7];

        //随机数产生路线的颜色
        //#C3D7C0   #8CC480     #D8B6C0     #BBA9A0     #D387EA
        //var random = parseInt(1000000 * Math.random());
        //var color = "#" + random;
        //var color = "#000040";
        var color = "rgb(0,191,255)";

        //画线
        this.createLine(vLayer_xhlxbyid, "xhlxbyid", strValues, color);

        //画点
        for (var k = 0; k < strValues.length - 8; k++) {
            var strValue = strValues[k].split(";");

            //var xhddurl = [webPath + "swf/xhdd.png"];
            var xhddurl = [webPath + "swf/bj.png"];
            var y = parseFloat(strValue[0]);
            var dlat = y;
            var x = parseFloat(strValue[1]);
            var dlon = x;
            var date = strValue[2];
            var time = date.split(" ");

            var sObj = new Object();
            sObj.lon = dlon;
            sObj.lat = dlat;
            sObj.fourChar = action;
            //sObj.siteName = "";
            sObj.status = 1;
            sObj.stream_status = 1
            sObj.action = "xhlxbyid";

            //起点
            if (k == 0) {
                sObj.img = qdurl;
                sObj.size = 25;
                sObj.siteName = xhperson + "[" + time[1] + "]";
            }
            //终点
            else if (k == strValues.length - 9) {
                sObj.img = zdurl;
                sObj.size = 25;
                sObj.siteName = xhperson + "[" + time[1] + "]";
            } else {
                if (k % 10 == 0) {
                    sObj.img = xhddurl;
                    sObj.siteName = time[1];
                } else {
                    sObj.img = "";
                    sObj.siteName = "";
                }
                sObj.size = 5;

            }
            //            sObj.img = xhddurl;
            //            sObj.size = 5;

            this.addSiteFeature(sObj);
        }
        var x1 = parseFloat(startX);
        var x2 = parseFloat(endX);
        var y1 = parseFloat(startY);
        var y2 = parseFloat(endY);
        var xx = (x1 + x2) / 2;
        var yy = (y1 + y2) / 2;
        map.setCenter(new Geo.LonLat(xx, yy), 16);
    }

    this.createXHLXPolygon2 = function (value, action) {
        this.setLayerVisible("xhlxbyid", true);
        var strValues = value.split("|");

        //起点
        var qdurl = ["/webgis/" + "swf/qd.png"];
        var start = strValues[0];
        var startStr = start.split(";");
        var startY = startStr[0];
        var startX = startStr[1];

        //终点
        var zdurl = ["/webgis/" + "swf/zd.png"];
        var end = strValues[strValues.length - 9];
        var endStr = end.split(";");
        var endY = endStr[0];
        var endX = endStr[1];

        //巡护人
        var xhperson = strValues[strValues.length - 7];


        //var color = "black";
        var color = "rgb(0,191,255)";

        //画线
        this.createLine(vLayer_xhlxbyid, "xhlxbyid", strValues, color);

        //画点
        for (var k = 0; k < strValues.length - 8; k++) {
            var strValue = strValues[k].split(";");

            //var xhddurl = [webPath + "swf/xhdd.png"];
            var xhddurl = [webPath + "swf/bj.png"];
            var y = parseFloat(strValue[0]);
            var dlat = y;
            var x = parseFloat(strValue[1]);
            var dlon = x;
            var date = strValue[2];
            //   var time = date.split(" ");

            var sObj = new Object();
            sObj.lon = dlon;
            sObj.lat = dlat;
            sObj.fourChar = '';
            sObj.siteName = "";
            sObj.status = 1;
            sObj.stream_status = 1
            sObj.action = "xhlxbyid";

            sObj.backgroundXOffset = 0;
            sObj.backgroundYOffset = 0;
            sObj.graphicXOffset = 0;
            sObj.graphicYOffset = -25;
            sObj.labelXOffset = 0;
            sObj.labelYOffset = 0;
            //起点
            if (k == 0) {
                sObj.img = qdurl;
                sObj.size = 25;
                //   sObj.siteName = xhperson + "[" + time[1] + "]";
                sObj.siteName = '';
            }
            //终点
            else if (k == strValues.length - 9) {
                sObj.img = zdurl;
                sObj.size = 25;
                //    sObj.siteName = xhperson + "[" + time[1] + "]";
                sObj.siteName = '';
            } else {
                if (k % 10 == 0) {
                    sObj.img = xhddurl;
                    //   sObj.siteName = time[1];
                    sObj.siteName = '';
                } else {
                    sObj.img = "";
                    sObj.siteName = "";
                }
                sObj.size = 5;

            }
            //            sObj.img = xhddurl;
            //            sObj.size = 5;

            this.addSiteFeature(sObj);
        }
        var x1 = parseFloat(startX);
        var x2 = parseFloat(endX);
        var y1 = parseFloat(startY);
        var y2 = parseFloat(endY);
        var xx = (x1 + x2) / 2;
        var yy = (y1 + y2) / 2;
        map.setCenter(new Geo.LonLat(x1, y1), 15);
    }


    this.createXHLXPolygonEdit = function (qd, zd, zjds, action) {
        this.setLayerVisible("xhlxbyid", true);
        removeAllPt("xhlxbyid");

        //起点
        var qdurl = ["/webgis/" + "swf/qd.png"];
        var startY = qd.lat;
        var startX = qd.lon;

        //终点
        var zdurl = ["/webgis/" + "swf/zd.png"];
        var endY = zd.lat;
        var endX = zd.lat;


        //var color = "black";
        var color = "rgb(0,191,255)";

        var qdflag = false, zdflag = false;
        var pts = new Array();
        if (parseFloat(qd.lon) && parseFloat(qd.lat)) {
            var tempqd = {lon: qd.lon, lat: qd.lat};
            pts.push(tempqd);
            qdflag = true;
        }

        for (var i = 0; i < zjds.length; i++) {
            var temp = {lon: zjds[i].lon, lat: zjds[i].lat};
            pts.push(temp);
        }

        if (parseFloat(zd.lon) && parseFloat(zd.lat)) {
            var tempzd = {lon: zd.lon, lat: zd.lat};
            pts.push(tempzd);
            zdflag = true;
        }

        //画线
        this.createLine2(vLayer_xhlxbyid, "xhlxbyid", pts, color);
        //画点
        if (qdflag)
            this.addSiteFeature(createXLSiteFearture(qd, qdurl));

        if (zdflag)
            this.addSiteFeature(createXLSiteFearture(zd, zdurl));

        //        var x1 = parseFloat(startX);
        //        var x2 = parseFloat(endX);
        //        var y1 = parseFloat(startY);
        //        var y2 = parseFloat(endY);
        //        var xx = (x1 + x2) / 2;
        //        var yy = (y1 + y2) / 2;
        //        map.setCenter(new Geo.LonLat(xx, yy), 16);

    }


    function createXLSiteFearture(p, url) {

        var sObj = new Object();
        sObj.lon = p.lon;
        sObj.lat = p.lat;
        sObj.fourChar = '';
        sObj.siteName = "";
        sObj.status = 1;
        sObj.stream_status = 1
        sObj.action = "xhlxbyid";

        sObj.backgroundXOffset = 0;
        sObj.backgroundYOffset = 0;
        sObj.graphicXOffset = 0;
        sObj.graphicYOffset = -25;
        sObj.labelXOffset = 0;
        sObj.labelYOffset = 0;

        sObj.img = url;
        sObj.size = 25;
        sObj.siteName = '';
        return sObj;
    }


    //巡护路线(带上报图片)
    this.createXHLXPolygon3 = function (value, action) {
        this.setLayerVisible("xhlxbyid", true);
        var strValues = value.split("|");

        //起点
        var qdurl = [webPath + "swf/qd.png"];
        var start = strValues[0];
        var startStr = start.split(";");
        var startY = startStr[0];
        var startX = startStr[1];

        //终点
        var zdurl = [webPath + "swf/zd.png"];
        var end = strValues[strValues.length - 9];
        var endStr = end.split(";");
        var endY = endStr[0];
        var endX = endStr[1];

        //巡护人
        var xhperson = strValues[strValues.length - 7];

        //随机数产生路线的颜色
        //#C3D7C0   #8CC480     #D8B6C0     #BBA9A0     #D387EA
        //var random = parseInt(1000000 * Math.random());
        //var color = "#" + random;
        //var color = "#000040";
        var color = "rgb(0,191,255)";

        var x1 = parseFloat(startX);
        var x2 = parseFloat(endX);
        var y1 = parseFloat(startY);
        var y2 = parseFloat(endY);
        //var xx = (x1 + x2) / 2;
        //var yy = (y1 + y2) / 2;
        //map.setCenter(new Geo.LonLat(xx, yy), 13);
        map.setCenter(new Geo.LonLat(x1, y1), 16);


        //画线
        this.createLine(vLayer_xhlxbyid, "xhlxbyid", strValues, color);

        //画点
        for (var k = 0; k < strValues.length - 8; k++) {
            var strValue = strValues[k].split(";");

            //var xhddurl = [webPath + "swf/xhdd.png"];
            var xhddurl = [webPath + "swf/bj.png"];
            var y = parseFloat(strValue[0]);
            var dlat = y;
            var x = parseFloat(strValue[1]);
            var dlon = x;
            var date = strValue[2];
            var time = date.split(" ");

            var sObj = new Object();
            sObj.lon = dlon;
            sObj.lat = dlat;
            sObj.fourChar = action;
            //sObj.siteName = "";
            sObj.status = 1;
            sObj.stream_status = 1
            sObj.action = "xhlxbyid";
            sObj.fontSize = 12;
            //sObj.backgroundXOffset = 0;
            //sObj.backgroundYOffset = 0;
            //sObj.graphicXOffset = 0;
            //sObj.graphicYOffset = 0;
            //sObj.labelXOffset = 15;
            //sObj.labelYOffset = -3;

            var pt = new ol.Geometry.Point(dlon, dlat);
            var pt2 = new ol.Geometry.Point(dlon, dlat);
            vlayer_photos3.setVisible(true);
            vlayer_photos4.setVisible(true);
            //起点
            if (k == 0) {
                sObj.img = qdurl;
                sObj.size = 25;
                sObj.siteName = xhperson + "[" + time[1] + "]";
                if (strValue[3] != "" && strValue[5] == "1") {
                    var feature_point = new ol.Feature.Vector(pt,
                        {
                            action: "photo4",
                            label: time[1],
                            pic: "http://www.hclbs.com/webgis/swf/photo_back.png",
                            //img: "http://www.hclbs.com/" + strValue[3],
                            img: strValue[3],
                            size: 50,
                            fontSize: 12,
                            backgroundWidth: 60,
                            backgroundXOffset: -32,
                            backgroundYOffset: -70,
                            graphicXOffset: -27,
                            graphicYOffset: -65,
                            labelXOffset: -20,
                            labelYOffset: 78
                        }
                    );
                    feature_point.action = action + "_photo";
                    feature_point.fourChar = strValue[4];
                    vlayer_photos4.addFeatures([feature_point]);

                    var feature_point2 = new ol.Feature.Vector(pt2,
                        {
                            fjid: sObj.siteName,
                            graphicWidth: 10,
                            graphicXOffset: -5,
                            graphicYOffset: -10
                        });
                    vlayer_photos3.addFeatures([feature_point2]);
                }
            }
            //终点
            else if (k == strValues.length - 9) {
                sObj.img = zdurl;
                sObj.size = 25;
                sObj.siteName = xhperson + "[" + time[1] + "]";
                if (strValue[3] != "" && strValue[5] == "1") {
                    var feature_point = new ol.Feature.Vector(pt,
                        {
                            action: "photo4",
                            label: time[1],
                            pic: "http://www.hclbs.com/webgis/swf/photo_back.png",
                            //img: "http://www.hclbs.com/" + strValue[3],
                            img: strValue[3],
                            size: 50,
                            fontSize: 12,
                            backgroundWidth: 60,
                            backgroundXOffset: -32,
                            backgroundYOffset: -70,
                            graphicXOffset: -27,
                            graphicYOffset: -65,
                            labelXOffset: -20,
                            labelYOffset: 78
                        }
                    );
                    feature_point.action = action + "_photo";
                    feature_point.fourChar = strValue[4];
                    vlayer_photos4.addFeatures([feature_point]);

                    var feature_point2 = new ol.Feature.Vector(pt2,
                        {
                            fjid: sObj.siteName,
                            graphicWidth: 10,
                            graphicXOffset: -5,
                            graphicYOffset: -10
                        });
                    vlayer_photos3.addFeatures([feature_point2]);
                }
            } else {
                sObj.size = 5;
                var checkimg;
                if (k % 10 == 0) {
                    sObj.img = xhddurl;
                    sObj.siteName = time[1];
                    //checkimg = this.CheckImgExists(strValue[3]);
                    if (strValue[3] != "" && strValue[5] == "1") {
                        sObj.siteName = "";

                        var feature_point = new ol.Feature.Vector(pt,
                            {
                                action: "photo4",
                                label: time[1],
                                pic: "http://www.hclbs.com/webgis/swf/photo_back.png",
                                //img: "http://www.hclbs.com/" + strValue[3],
                                img: strValue[3],
                                size: 50,
                                fontSize: 12,
                                backgroundWidth: 60,
                                backgroundXOffset: -32,
                                backgroundYOffset: -70,
                                graphicXOffset: -27,
                                graphicYOffset: -65,
                                labelXOffset: -20,
                                labelYOffset: 78
                            }
                        );
                        feature_point.action = action + "_photo";
                        feature_point.fourChar = strValue[4];
                        vlayer_photos4.addFeatures([feature_point]);

                        var feature_point2 = new ol.Feature.Vector(pt2,
                            {
                                fjid: sObj.siteName,
                                graphicWidth: 10,
                                graphicXOffset: -5,
                                graphicYOffset: -10
                            });
                        vlayer_photos3.addFeatures([feature_point2]);
                    }
                } else {
                    sObj.img = "";
                    sObj.siteName = "";
                    //checkimg = this.CheckImgExists(strValue[3]);
                    if (strValue[3] != "" && strValue[5] == "1") {
                        sObj.img = xhddurl;

                        var feature_point = new ol.Feature.Vector(pt,
                            {
                                action: "photo4",
                                label: time[1],
                                pic: "http://www.hclbs.com/webgis/swf/photo_back.png",
                                //img: "http://www.hclbs.com/" + strValue[3],
                                img: strValue[3],
                                size: 50,
                                fontSize: 12,
                                backgroundWidth: 60,
                                backgroundXOffset: -32,
                                backgroundYOffset: -70,
                                graphicXOffset: -27,
                                graphicYOffset: -65,
                                labelXOffset: -20,
                                labelYOffset: 78
                            }
                        );
                        feature_point.action = action + "_photo";
                        feature_point.fourChar = strValue[4];
                        vlayer_photos4.addFeatures([feature_point]);

                        var feature_point2 = new ol.Feature.Vector(pt2,
                            {
                                fjid: sObj.siteName,
                                graphicWidth: 10,
                                graphicXOffset: -5,
                                graphicYOffset: -10
                            });
                        vlayer_photos3.addFeatures([feature_point2]);
                    }
                }
            }

            this.addSiteFeature(sObj);
        }
    }

    this.setPointTop = function (layername, id) {
        var layer1;
        var tempfeature;
        layer1 = this.getsmtlayer(layername);
        for (i = 0; i < layer1.features.length; i++) {
            if (layer1.features[i].siteid == id) {
                tempfeature = layer1.features[i];
                layer1.removeFeatures(layer1.features[i]);
                break;
            }
        }
        layer1.addFeatures([tempfeature]);
    }

    this.setPointTop2 = function (layername, id) {
        var layer1;
        var tempfeature;
        var tempPhoto4;
        var tempPhoto3;
        layer1 = this.getsmtlayer(layername);
        for (i = 0; i < layer1.features.length; i++) {
            if (layer1.features[i].siteid == id) {
                tempfeature = layer1.features[i];
                layer1.removeFeatures(layer1.features[i]);
                break;
            }
        }
        layer1.addFeatures([tempfeature]);

        for (i = 0; i < vlayer_photos4.features.length; i++) {
            if (vlayer_photos4.features[i].siteid == id) {
                tempPhoto4 = vlayer_photos4.features[i];
                vlayer_photos4.removeFeatures(vlayer_photos4.features[i]);
                break;
            }
        }
        vlayer_photos4.addFeatures([tempPhoto4]);

        for (i = 0; i < vlayer_photos3.features.length; i++) {
            if (vlayer_photos3.features[i].siteid == id) {
                tempPhoto3 = vlayer_photos3.features[i];
                vlayer_photos3.removeFeatures(vlayer_photos3.features[i]);
                break;
            }
        }
        vlayer_photos3.addFeatures([tempPhoto3]);

    }

    this.CheckImgExists = function (imgurl) {
        var ImgObj = new Image(); //判断图片是否存在
        ImgObj.src = imgurl;
        //没有图片，则返回-1
        if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
            return 1;
        } else {
            return 0;
        }
    }

    //基础数据管理的图层隐藏
    this.setlayerVisibleAll = function () {
        for (var i = 0; i < allyw_layers.length; i++) {
            var layer = allyw_layers[i];
            if (layer != null) {
                layer.setVisible(false);
            }
        }
    }
    //专题的图层隐藏
    this.setlayerVisibleZT = function () {
        for (var i = 0; i < zt_ztlayers.length; i++) {
            var layer = zt_ztlayers[i];
            if (layer != null) {
                layer.setVisible(false);
            }
        }
    }

    //单击获取经纬度(tianditu2.html)
    this.getLatLon = function () {
        map.events.register('click', map, function (e) {
            var pixel = new ol.Pixel(e.xy.x, e.xy.y);
            var lonlat = map.getCoordinateFromPixel(pixel);
            //  lonlat.transform(new ol.Projection("EPSG:900913"), new ol.Projection("EPSG:4326")); //由900913坐标系转为4326
            parent.setLonLat(lonlat.lon, lonlat.lat);
        });
    }

    //切换影像图和矢量图
    this.switchyxandsl = function () {
        try {
            var isyx = layer_yx.getVisibility();
            var issl = layer_sl.getVisibility();
            if (issl) {
                //map.addLayer(layer_sl);
                //map.removeLayer(layer_yx);
                layer_sl.setVisible(false);
                //layer_yx.setVisible(false);
            } else {
                //layer_yx.setVisible(true);
                layer_sl.setVisible(true);
            }
        } catch (e) {
            //map.addLayer(layer_yx);
            //map.removeLayer(layer_sl);
        }
    }

    //控制地名标注的显示和隐藏
    this.switchAnno = function () {
        var isvisible = layer_Anno.getVisibility();
        if (isvisible) {
            layer_Anno.setVisible(false);
        } else {
            layer_Anno.setVisible(true);
        }
    }
}

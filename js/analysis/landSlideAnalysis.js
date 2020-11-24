/**
 * 作    者：StampGIS Team
 * 创建日期：2017年11月07日
 * 描    述：滑坡分析
 * 注意事项：该文件方法仅为滑坡分析使用
 * 遗留bug ：无
 * 修改日期：2017年11月07日
 *****************************************************************/
var earth = null;
var demArr = [];
var legalDemArr = [];
var thisProject = null;
var tempPolygon = null;
$(function(){
    // 工程改变时 初始化
    $("#project").change(function(){
        $("#beforSlide").empty();
        $("#afterSlide").empty();
        initBeforSlide();
        initAfterSlide();
    });
    // 滑坡后地形 改变事件
    $("#beforSlide").change(function(){
        var beforDem = $("#beforSlide").val();
        var afterDem = $("#afterSlide").val();
        if(beforDem == afterDem){
            var beforIndex =  $('option:selected', '#beforSlide').index();
            initAfterSlide(beforIndex);
        }else{
            return;
        }
    });
    // 滑坡前地形 改变事件
    $("#afterSlide").change(function(){
        var beforDem = $("#beforSlide").val();
        var afterDem = $("#afterSlide").val();
        if(beforDem == afterDem){
            var afterIndex =  $('option:selected', '#afterSlide').index();
            initAfterSlide(afterIndex);
        }else{
            return;
        }
    });
    // 开始分析
    $("#btnStart").click(function(){
        earth.Event.OnAnalysisFinished = function (res) {
            var fillVolume = res.Fill;
            var fillArea = res.FillArea;
            var slideVolume = res.Excavation;
            var slideArea = res.ExcavationArea;
            if(fillVolume){
                $("#fillVolume").val(fillVolume.toFixed(2));
            }
            if(fillArea){
                $("#fillArea").val(fillArea.toFixed(2));
            }
            if(slideVolume){
                $("#slideVolume").val(slideVolume.toFixed(2));
            }
            if(slideArea){
                $("#slideArea").val(slideArea.toFixed(2));
            }
        };
        earth.Event.OnCreateGeometry = function(p,cType){
            if(p.Count < 3){
                alert("请至少画三个点");
                return;
            }
            earth.ShapeCreator.Clear();
            if(tempPolygon){
                earth.DetachObject(tempPolygon);
                tempPolygon = null;
            }
            tempPolygon = earth.Factory.CreateElementPolygon(earth.Factory.CreateGUID(), "分析面");
            tempPolygon.BeginUpdate();
            tempPolygon.SetExteriorRing(p);
            tempPolygon.LineStyle.LineWidth = 1;
            tempPolygon.LineStyle.LineColor = 0xffff0000;
            tempPolygon.FillStyle.FillColor = 0x2500ff00;
            tempPolygon.AltitudeType = 1;
            tempPolygon.EndUpdate();
            earth.AttachObject(tempPolygon);
            var beforDem = $("#beforSlide").val();
            var afterDem = $("#afterSlide").val();
            earth.Analysis.ComparedLandSlide(p,beforDem,afterDem);
        }
        earth.ShapeCreator.CreatePolygon();
    });
    window.onunload = function(){
        earth.ShapeCreator.Clear();
        if(tempPolygon){
            earth.DetachObject(tempPolygon);
            tempPolygon = null;
        }
    }
    $("#clear").click(function(){
        earth.ShapeCreator.Clear();
        if(tempPolygon){
            earth.DetachObject(tempPolygon);
            tempPolygon = null;
        }
        if(earth.htmlBallon){
            earth.htmlBallon.DestroyObject();
            earth.htmlBallon = null;
        }
    });
})

function getEarth(earthObj){
    earth = earthObj;
    demArr = earth.demArr;
    var projectId = earth.projectId;
    initProject(demArr);
    var projectId = $("#project").val();
    if(!projectId){
        alert("请先配置至少有两个DEM图层的工程!");
        $("#btnStart").attr("disabled", true);
        return
    }
    initBeforSlide();
    initAfterSlide();
}
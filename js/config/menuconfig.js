/**
 * 作       者：StampGIS Team
 * 创建日期：2017年7月22日
 * 描        述：菜单配置文件
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2017年11月8日
 ******************************************/

var STAMP = STAMP || {};
STAMP.menuConfig = {
    "menu": [{
        "tag": "1",
        "id": "top",
        "name": "首页",
        "title": "首页",
        "src": "images/top/inactiveIcons/top.png",
        "funcname": "堡垒户",
        "functitle": "堡垒户",
        "funcsrc": "images/tools/坐标定位.png",
        "item": [{
            "tag": "301",
            "id": "PatrolMonitor",
            "name": "堡垒户",
            "title": "堡垒户",
            "src": "images/tools/视野分析.png"
        }, {
            "tag": "601",
            "id": "VisitMonitor",
            "name": "民警",
            "title": "民警",
            "src": "images/tools/GPS监控.png"
        }]
    }, {
        "id": "patrol",
        "name": "居边护边",
        "title": "居边护边",
        "tag": "4",
        "src": "images/top/inactiveIcons/patrol.png",
        "item": [{
            "tag": "301",
            "id": "PatrolTrack",
            "name": "巡逻轨迹",
            "title": "巡逻轨迹",
            "src": "images/tools/视野分析.png"
        }, {
            "tag": "302",
            "id": "PatrolTask",
            "name": "巡逻任务",
            "title": "巡逻任务",
            "src": "images/tools/历史管理.png"
        }, {
            "tag": "303",
            "id": "EventManagement",
            "name": "事件管理",
            "title": "事件管理",
            "src": "images/tools/视域分析.png"
        }, {
            "tag": "304",
            "id": "PatrolAnalysis",
            "name": "统计分析",
            "title": "统计分析",
            "src": "images/tools/视域分析.png"
        }, {
            "tag": "305",
            "id": "PatrolTraceManage",
            "name": "轨迹管理",
            "title": "轨迹管理",
            "src": "images/tools/视域分析.png"
        }, {
            "tag": "306",
            "id": "CycleEvaluate",
            "name": "周期评定",
            "title": "周期评定",
            "src": "images/tools/视域分析.png"
        }, {
            "tag": "307",
            "id": "PatrolRoute",
            "name": "巡逻路线",
            "title": "巡逻路线",
            "src": "images/tools/视域分析.png"
        }]
    }, {
        "id": "police",
        "name": "民警走访",
        "title": "民警走访",
        "tag": "7",
        "src": "images/top/inactiveIcons/police.png",
        "item": [{
            "tag": "602",
            "id": "VisitTrack",
            "name": "走访轨迹",
            "title": "走访轨迹",
            "src": "images/tools/视野分析.png"
        }, {
            "tag": "603",
            "id": "VisitTask",
            "name": "走访任务",
            "title": "走访任务",
            "src": "images/tools/地表距离.png"
        }, {
            "tag": "604",
            "id": "VisitAnalysis",
            "name": "统计分析",
            "title": "统计分析",
            "src": "images/tools/地表距离.png"
        }, {
            "tag": "605",
            "id": "VisitRecording",
            "name": "走访记录",
            "title": "走访记录",
            "src": "images/tools/历史管理.png"
        }, {
            "tag": "606",
            "id": "VisitTraceManage",
            "name": "轨迹管理",
            "title": "轨迹管理",
            "src": "images/tools/视域分析.png"
        }, {
            "tag": "607",
            "id": "VisitRoute",
            "name": "走访路线",
            "title": "走访路线",
            "src": "images/tools/视域分析.png"
        }]
    }, {
        "id": "datamng",
        "name": "人口管理",
        "title": "人口管理",
        "tag": "5",
        "src": "images/top/inactiveIcons/makido.png",
        "item": [
        {
        "tag": "403",
        "id": "rktj",
        "name": "人口统计",
        "title": "人口统计",
        "src": "images/tools/历史管理.png"
        },
        {
        "tag": "400",
        "id": "mhzx",
        "name": "常住人口",
        "title": "常住人口",
        "src": "images/tools/历史管理.png"
        },
        {
        "tag": "401",
        "id": "zzrk",
        "name": "暂住人口",
        "title": "暂住人口",
        "src": "images/tools/漫游.png"
        },
        {
            "tag": "399",
            "id": "Muster",
            "name": "重点人口",
            "title": "重点人口",
            "src": "images/tools/历史管理.png"
        }]
    }, {
        "id": "place",
        "name": "场所管理",
        "title": "场所管理",
        "tag": "7",
        "src": "images/top/inactiveIcons/video.png",
        "item": [
        {
            "tag": "708",
            "id": "CSTJ",
            "name": "场所统计",
            "title": "场所统计",
            "src": "images/tools/历史管理.png"
        },{
            "tag": "701",
            "id": "SBDW",
            "name": "涉爆单位",
            "title": "涉爆单位",
            "src": "images/tools/历史管理.png"
        }, {
            "tag": "702",
            "id": "QSWDW",
            "name": "企事业单位",
            "title": "企事业单位",
            "src": "images/tools/历史管理.png"
        }, {
            "tag": "703",
            "id": "TZHY",
            "name": "特种行业",
            "title": "特种行业",
            "src": "images/tools/历史管理.png"
        }, {
            "tag": "704",
            "id": "SYWD",
            "name": "商业网点",
            "title": "商业网点",
            "src": "images/tools/历史管理.png"
        }, {
            "tag": "705",
            "id": "CZFW",
            "name": "出租房屋",
            "title": "出租房屋",
            "src": "images/tools/历史管理.png"
        }, {
            "tag": "706",
            "id": "YQYF",
            "name": "营区营房数据",
            "title": "营区营房数据",
            "src": "images/tools/历史比对.png"
        }, {
            "tag": "707",
            "id": "TYSJ",
            "name": "其它场所",
            "title": "其它场所",
            "src": "images/tools/历史比对.png"
        }]
    }, {
        "tag": "2",
        "id": "view",
        "name": "三维展示",
        "title": "三维展示",
        "src": "images/top/inactiveIcons/view.png",
        "item": [{
            "tag": "104",
            "id": "ViewPointManagement",
            "name": "视点管理",
            "title": "视点管理",
            "src": "images/tools/视点.png"
        }, {
            "tag": "101",
            "id": "ViewFlyMode",
            "name": "飞行路径",
            "title": "飞行路径",
            "src": "images/tools/路径.png"
        }, {
            "tag": "102",
            "id": "ViewPersonMode",
            "name": "场景漫游",
            "title": "场景漫游",
            "src": "images/tools/漫游.png"
        }, {
            "tag": "103",
            "id": "surround",
            "name": "环绕浏览",
            "title": "环绕浏览",
            "src": "images/tools/漫游.png"
        }, {
            "tag": "104",
            "id": "ViewPointManagement",
            "name": "视点管理",
            "title": "视点管理",
            "src": "images/tools/视点.png"
        }, {
            "tag": "114",
            "id": "layerTrans",
            "name": "模型透明",
            "title": "模型透明",
            "src": "images/tools/模型透明.png"
        }, {
            "tag": "201",
            "id": "mHorizontalDist",
            "name": "水平距离",
            "title": "水平距离测量",
            "src": "images/tools/水平距离.png"
        }, {
            "tag": "202",
            "id": "mHeight",
            "name": "垂直距离",
            "title": "垂直距离测量",
            "src": "images/tools/垂直距离.png"
        }, {
            "tag": "203",
            "id": "mLineLength",
            "name": "空间距离",
            "title": "空间距离测量",
            "src": "images/tools/空间距离.png"
        }, {
            "tag": "204",
            "id": "mPathLength",
            "name": "地表距离",
            "title": "地表距离",
            "src": "images/tools/地表距离.png"
        }, {
            "tag": "205",
            "id": "mArea",
            "name": "水平面积",
            "title": "水平面积",
            "src": "images/tools/水平面积.png"
        }, {
            "tag": "206",
            "id": "mSurfaceArea",
            "name": "地表面积",
            "title": "地表面积",
            "src": "images/tools/地表面积.png"
        }, {
            "tag": "207",
            "id": "mSpatialArea",
            "name": "空间面积",
            "title": "空间面积",
            "src": "images/tools/空间面积.png"
        }, {
            "tag": "208",
            "id": "mVerticalArea",
            "name": "立面面积",
            "title": "立面面积",
            "src": "images/tools/立面面积.png"
        }, {
            "tag": "209",
            "id": "pointToline",
            "name": "点-折线",
            "title": "点-折线",
            "src": "images/tools/点-折线.png"
        }, {
            "tag": "210",
            "id": "pointToZline",
            "name": "点-直线",
            "title": "点-直线",
            "src": "images/tools/点-直线.png"
        }, {
            "tag": "211",
            "id": "lineToline",
            "name": "线线距离",
            "title": "线线距离",
            "src": "images/tools/线线距离.png"
        }, {
            "tag": "212",
            "id": "SurfacesToSurfaces",
            "name": "面面距离",
            "title": "面面距离",
            "src": "images/tools/面面距离.png"
        }, {
            "tag": "213",
            "id": "PointToSurfaces",
            "name": "点面距离",
            "title": "点面距离",
            "src": "images/tools/点面距离.png"
        }, {
            "tag": "214",
            "id": "LineToSurfaces",
            "name": "线面距离",
            "title": "线面距离",
            "src": "images/tools/线面距离.png"
        }, {
            "tag": "215",
            "id": "mPlaneAngle",
            "name": "平面角度",
            "title": "平面角度",
            "src": "images/tools/平面角度.png"
        }]
    }, {
        "id": "video",
        "name": "视频管理",
        "title": "视频管理",
        "tag": "6",
        "src": "images/top/inactiveIcons/video.png",
        "item": [{
            "tag": "501",
            "id": "VideoMonitor",
            "name": "视频监控",
            "title": "视频监控",
            "src": "images/tools/监控.png"
        }, {
            "tag": "502",
            "id": "VideoMeeting",
            "name": "远程调解",
            "title": "远程调解",
            "src": "images/tools/动画.png"
        }, {
            "tag": "503",
            "id": "Desert110",
            "name": "大漠110",
            "title": "大漠110",
            "src": "images/tools/视点管理.png"
        }]
    }, {
        "id": "closed",
        "name": "闭环管理",
        "title": "闭环管理",
        "tag": "6",
        "src": "images/top/inactiveIcons/video.png",
        "item": [{
            "tag": "501",
            "id": "Foreper",
            "name": "外来人员管理",
            "title": "外来人员管理",
            "src": "images/tools/监控.png"
        }, {
            "tag": "502",
            "id": "vehicle",
            "name": "外来车辆管理",
            "title": "外来车辆管理",
            "src": "images/tools/动画.png"
        }, {
            "tag": "502",
            "id": "security",
            "name": "边检站（卡口）管理",
            "title": "边检站（卡口）管理",
            "src": "images/tools/动画.png"
        }]
    }, {
        //   "id": "oa",
        //   "name": "智能办公",
        //   "title": "智能办公",
        //   "tag": "8",
        //   "src": "images/top/inactiveIcons/statistics.png",
        //   "item": [{
        //     "tag": "701",
        //     "id": "mytj",
        //     "name": "消息发布",
        //     "title": "消息发布",
        //     "src": "images/tools/每月统计.png"
        //   }, {
        //     "tag": "701",
        //     "id": "mytj",
        //     "name": "消息接收",
        //     "title": "消息接收",
        //     "src": "images/tools/每月统计.png"
        //   }]
        // },        {
        "id": "config",
        "name": "系统设置",
        "title": "系统设置",
        "tag": "9",
        "src": "images/top/inactiveIcons/config.png",
        "item": [{
            "tag": "803",
            "id": "bmgl",
            "name": "部门管理",
            "title": "部门管理",
            "src": "images/tools/部门管理.png"
        }, {
            "tag": "802",
            "id": "yhgl",
            "name": "堡垒户",
            "title": "堡垒户管理",
            "src": "images/tools/用户管理.png"
        }, {
            "tag": "804",
            "id": "policl",
            "name": "民警",
            "title": "民警管理",
            "src": "images/tools/用户管理.png"
        }, {
            "id": "DingDing",
            "name": "钉钉办公",
            "title": "钉钉办公",
            "tag": "7",
            "src": "images/top/inactiveIcons/police.png"
        }]
        // }, {
        //     "id": "Usercontol",
        //     "name": "个人中心",
        //     "title": "个人中心",
        //     "tag": "10",
        //     "src": "images/top/inactiveIcons/config.png",
        //     // "item": [{
        //     //   "tag": "804",
        //     //   "id": "myUser ",
        //     //   "name": "部门管理",
        //     //   "title": "部门管理",
        //     //   "src": "images/tools/部门管理.png"
        //     // }]
    }]
}

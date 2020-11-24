/**
 * 作       者：StampGIS Team
 * 创建日期：2017年7月22日
 * 描        述：配置文件
 * 注意事项：
 * 遗留bug：0
 * 修改日期：2017年11月8日
 ******************************************/
var formNameData=[
	{//1
		name:"边防部队",
		formName:"部门",
		prefix:"DepartmentInfo",
	},
	{//2
		name:"堡垒户",
		formName:"堡垒户",
		prefix:"FortressInfo",
	},
	{//3
		name:"企事业单位",
		formName:"企事业单位_基本情况",
		prefix:"QsydwDwjbqk",
	},
	{//4
		name:"涉爆单位",
		formName:"涉爆单位_基本情况",
		prefix:"SbdwJbqk",
	},
	{//5
		name:"特种行业",
		formName:"特种行业_特种行业登记",
		prefix:"TzhyTzhydjb",
	},
	{//6
		name:"商业网点",
		formName:"商业网点_商业网点登记",
		prefix:"SywdSywddjb",
	},
	{//7
		name:"出租房屋",
		formName:"出租房屋_出租房屋治安管理审批",
		prefix:"CzfwCzfwzaglspb",
	},
	{//8
		name:"常住人口",
		formName:"人口管理_常住人口信息",
		prefix:"RkglCzrkxxb",
	},
	{//9
		name:"暂住人口",
		formName:"人口管理_暂住人口登记",
		prefix:"RkglZzrkdjb",
	},
	{//10
		name:"其它场所",
		formName:"其它场所",
		prefix:"GeneralData",
	}
];

var params = {
	ip: "http://192.168.8.50", //加载球地址
	serviceIp: "http://39.104.61.47:8092", //数据服务地址
	// serviceIp: "http://192.168.8.166:8092", //数据服务地址

	//serviceIp: "http://192.168.8.188:8092", //数据服务地址
	pictureLoadingFailedUrl: "/file/cover/picture_loading_failed.jpg",//图片加载失败展示
	audioLoadingFailedUrl: "/file/cover/audio_loading_failed.jpg",//视频加载失败展示
	videoLoadingFailedUrl: "/file/cover/video_loading_failed.jpg",//音频加载失败展示
	otherLoadingFailedUrl: "/file/cover/other_loading_failed.jpg",//其他文件加载失败展示
	screen: 0, //数据配置文件索引
	transparency: 100, //球透明度（1-100)
	username: "",//权限用户名
	password: "",//权限密码
	token: "",//权限秘钥
	//下面是摄像头参数设置
	isSimulationCamera: true, //是否开启模拟摄像头，只针对GB28181功能，true为使用模拟摄像头，false为不使用模拟摄像头
	camearaMaxTilt: 90,//最大俯仰角度
	camearaMaxRotation: 350,//最大旋转角度
	cameraDefaultHeight: 20,//默认的摄像机安装高度
	cameraDefaultHeading: 0 //摄像机起始朝向：0是正北，90是正东，180是正南，270是正西
};
window.params = params;

//LocalSearch返回数据类型
var localSearchDataType = {
	"xml": 1,
	"xmlWithMesh": 4,
	"json": 5,
	"jsonWithMesh": 6
};

var STAMP_config = {};
//顶部标题栏配置
STAMP_config.topInfo = {
	logo: "images/GuoHui.png",
	// titleImg: "", //系统标题图片
	// titleImg: "./images/GuoHui.png", //系统标题图片
	titleText: "阿拉善盟智慧边境" //系统标题文字
};

STAMP_config.constants = {
	TRACKFILE: "\\track\\trackList", // 飞行路线
	ANIMFILE: "\\visit\\visit", // 动画
	CAMERAFILE: "\\camera\\camera", // 摄像机
	VIEWPOINTFILE: '\\viewpoint\\viewpoint', // 视点
	USERDATA: '\\userdata\\' // 用户数据
};

//默认显示的管线字段
STAMP_config.LineProperty={
	DLLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		"US_VENTNUM",	//电缆条数
		"US_HOLETOL",	//总孔数
		"US_HOLEUSE",	//已用孔数
		"US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	DXLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_VENTNUM",	//电缆条数
		"US_HOLETOL",	//总孔数
		"US_HOLEUSE",	//已用孔数
		"US_PSVALUE",	//电压值
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	JSLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	PSLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_FLOWDIR",	//流向
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	RQLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	RLLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	GYLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_PRESSUR",	//压力
		"US_FLOWDIR",	//流向
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	],
	DEFAULTLINE:[
		"US_KEY",		//编号
		"US_LTTYPE",	//埋设方式
		"US_PMATER",	//材质
		"US_SIZE",		//管径
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_STATUS"		//更新状态
	]
};

//默认显示的管点字段
STAMP_config.PointProperty = {
	WELLPOINT:[
		"US_KEY",		//编号
		"X",			//X坐标
		"Y",			//Y坐标
		"US_PT_ALT",	//地面高程
		"US_PT_TYPE",	//特征
		"US_ATTACHMENT",//附属物
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_UPDATE",	//更新状态
		"US_WELL",		//井类型
		"US_WDIA",		//井直径
		"US_NDEEP",		//井脖深
		"US_WDEEP",		//井底深
		"US_PLATE",		//井盖类型
		"US_PSIZE",		//井盖规格
		"US_PMATER",	//井盖材质
		"US_WMATER",	//井材质
		"US_ANGLE",		//旋转角度
		"US_OFFSET"		//偏心井点号
	],
	DEFAULTPOINT:[
		"US_KEY",		//编号
		"X",			//X坐标
		"Y",			//Y坐标
		"US_PT_ALT",	//地面高程
		"US_PT_TYPE",	//特征
		"US_ATTACHMENT",//附属物
		"US_ROAD",		//所在道路
		"US_OWNER",		//权属单位
		"US_BD_TIME",	//建设年代
		"US_UPDATE"		//更新状态
	]
};

var Operation = {};
//中文
function getZhLanguage() {
  Operation = {
    //ui字段
    //页面
    ui_todogoods: "待办事项",
    ui_address: "地址",
    ui_photo: "照片",
    ui_location: "位置",
    ui_selectSub: "选择变电所",
    ui_subHolder: "请输入变电所名称或编号",
    ui_subHolderNoCode: "请输入变电所名称",
    //通用
    ui_loading: "正在加载...",
    ui_back: "返回",
    ui_cancel: "取消",
    ui_neterror: "网络异常",
    ui_confirm: "确定",
    ui_All: "全部",
    ui_query: "查询",
    ui_upload: "上传",
    ui_dateselecttip: "请选择正确的查询时间",
    ui_month: "月",
    ui_SelectAll: "全选",
    ui_UnselectAll: "全不选",
    //deviceClass
    ui_edit: "编辑",
    ui_hidenodevice: "隐藏无设备分类",
    ui_showalldevice: "显示所有设备分类",
    ui_addnewdevice: "新增额外设备分类",
    ui_quit: "退出",
    ui_up: "上移",
    ui_down: "下移",
    ui_suresort: "确定排序",
    ui_rename: "重命名",
    ui_copy: "复制",
    ui_delete: "删除",
    ui_renamesuccess: "重命名成功",
    ui_sortsuccess: "排序成功",
    ui_suretodel: "确定删除吗？",
    ui_upperlevel: "上一级",
    //addDeviceCLass
    ui_selectcategory: "请选择需要新增的设备分类",
    // AutoloadDetail
    ui_add: "新增",
    ui_save: "保存",
    ui_savesuccess: "保存成功！",
    ui_nodevice: "暂无设备信息，请增加相关信息！",
    ui_nosave: "当前设备暂未保存！",
    ui_addFail: "新增失败！",
    ui_delFail: "删除失败！",
    ui_delsuccess: "删除成功！",
    ui_deviceName: "设备命名",
    ui_copyFail: "复制失败！",
    ui_copySuccess: "复制成功！",
    //allPatrolRecord
    ui_Patrolrecord: "巡检记录",
    ui_today: "今日",
    ui_yday: "昨日",
    ui_curr: "当月",
    ui_Uult: "上月",
    ui_timeSelect: "时间选择",
    ui_startTime: "开始时间",
    ui_endTime: "截止日期",
    ui_taskstate: "任务状态",
    ui_Substationname: "变电所名称",
    ui_enterkeywords: "请输入关键字",
    ui_PatroltaskNumber: "巡检任务单号：",
    ui_PatrolStartTime: "巡检开始时间：",
    ui_FindDefect: "本次发现缺陷：",
    ui_Untreated: "个  未处理：",
    ui_unit: "个",
    // allDefectPage
    ui_DefectPage: "缺陷记录",
    ui_Defectstate: "缺陷状态",
    ui_Severitygrade: "严重等级",
    ui_Devname: "设备名称：",
    ui_DefectExplain: "缺陷描述：",
    ui_SpecificLoc: "具体位置：",
    ui_categories: "缺陷类别：",
    ui_Emergenylevel: "紧急程度：",
    ui_dealState: "处理状态：",
    ui_findTime: "发现时间：",
    // selectPhoto
    ui_photo: "照片",
    ui_location: "位置",
    //todoItem
    ui_taskType: "任务类型",
    ui_taskTypeSelect: "任务类型筛选",
    //taskDetail
    ui_taskDetail: "任务详情",
    ui_taskNumber: "任务单号:",
    ui_tasktyper: "任务类型:",
    ui_Subname: "变电所名称:",
    ui_Originator: "发起人:",
    ui_Principal: "负责人:",
    ui_StarPlanTime: "计划开始时间:",
    ui_endPlanTime: "计划完成时间:",
    ui_TaskContent: "任务内容:",
    ui_TaskStartTime: "任务开始时间:",
    ui_TaskFinishTime: "任务完成时间:",
    ui_Totaldefect: "缺陷总数:",
    ui_defectUntreatNum: "缺陷未处理数:",
    ui_TaskResult: "任务执行结果:",
    ui_TaskRemarks: "任务备注",
    ui_Entertexthere: "在此输入文字...",
    ui_Implementationsituation: "执行情况",
    ui_Implement: "执行",
    ui_submit: "提交",
    ui_register: "签到",
    ui_ImplementDetail: "执行明细",
    ui_attention: "注意！",
    ui_executionprompt: "单个任务仅一份巡检单，一份巡检单仅且只能一个人保存，多人同时保存可能相互覆盖。",
    //报警
    ui_Alarm: "报警",

    //patrolContent
    ui_Subinspection: "变电所巡检",
    ui_selectSub: "选择设备分组",
    //patrolContent
    ui_showOnlydevice: "仅显示有设备分类",
    ui_DefectRegist: "缺陷登记",
    ui_hasnosave: "当前巡检信息尚未保存，确定要离开吗？",
    ui_nodeviceInThis: "此分组下无设备！",
    ui_noDeviceRecord: "暂无巡检单记录！",
    ui_morethansixpic: "最多上传6张图片",
    ui_selectDefectLoc: "请选择缺陷位置！",
    ui_uploadSuccess: "上传成功",
    ui_noDefectRecord: '没有该缺陷详情记录！',
    ui_noSaveWantOut: '消息尚未保存，确定退出吗？',
    ui_noSaveWantDelete: '确定要删除已保存的图片？',
    ui_fillrequireditems: '请填入必填项',
    ui_gotowebpagedevice: "可前往网页端设备管理->设备定义->选择(",
    ui_patrolinformationadd: ")分组->巡检信息添加巡检项",
    ui_Thefileformatmustbe: "文件格式必须为：png/jpg/jpeg",
    ui_defectPoision: "缺陷位置：",

    //missionManager
    ui_submitTask: "提交任务",
    ui_Executor: "执行人:",
    ui_Executorsituation: "执行情况:",
    ui_checkTime: "签到时间:",
    ui_checkSite: "签到地点:",
    ui_OffsetDistance: "偏差距离:",
    ui_submitTime: "提交时间:",
    ui_Remark: "任务备注:",
    ui_trajectory: "轨迹追踪:",
    ui_Trackquery: "轨迹查询",
    //文档分类
    ui_FileList: "文档分类",
    //变电所消缺单
    ui_SubstationDefect: "变电所缺陷单",
    ui_Description: "描述：",
    ui_detriment: "缺陷危害：",
    ui_Specificlocation: "具体位置：",
    ui_categorie: "缺陷类别：",
    ui_Urgency: "紧急程度：",
    ui_EliminationPeriod: "消缺期限：",
    ui_DealStateForDefect: "处理状态：",
    ui_FindTimeForDefect: "发现时间：",
    //缺陷信息
    ui_DefectInfo: "缺陷信息",
    ui_SeverityGrade: "严重等级：",
    ui_Scenephotos: "现场照片：",
    ui_RectifyPhoto: "整改照片：",
    ui_suggestion: "处理建议：",
    ui_CustomerComments: "客户意见：",
    ui_Situation: "处理情况：",
    ui_MissingPersonnel: "消缺人员：",
    ui_SolveTime: "消缺时间：",
    //用户报告
    ui_UserReport: "用户报告",
    ui_rightButton: "点击右上角按钮筛选！",
    ui_subSelectTip: "请筛选并点击查询按钮！",
    //Autoload
    ui_nodata: "暂无相关数据",
    ui_yes: "是",
    ui_no: "否",
    ui_cannotcopy: "无可复制的设备。",
    ui_cannotdel: "无可删除的设备。",
    ui_suredel: "确认删除",
    ui_question: "吗？",
    ui_devicetemplate: "暂无设备模板信息，请前往网页端添加！",
    //todoitems
    ui_todo: "待办",
    ui_doing: "在办",
    ui_done: "办毕",
    ui_goods: "事项",
    ui_xunjian: "巡检",
    ui_xiaoque: "消缺",
    ui_taskid: "任务单号",
    ui_plandonetime: "计划完成时间",
    ui_donetime: "实际完成时间",
    //missionDetail
    ui_seeDetail: "查看明细",
    ui_openTask: "开启任务",
    ui_siteSign: "现场签到",
    ui_doTask: "执行任务",
    ui_taskSubmit: "提交任务",
    ui_doingDetail: "执行明细",
    ui_notCheck: "未签到",
    ui_checked: "已签到",
    ui_submitted: "已提交",
    ui_noAllCommit: "执行人员未全部提交，",
    ui_submitTaskTip: "确定要提交并结束任务吗？",
    ui_submitTaskSuccessTip: "提交成功，该任务已结束！",
    ui_openTaskTip: "请先开启该任务！",
    ui_signinTip: "请先现场签到！",
    ui_openTraceTip: "是否要开启轨迹记录功能？",
    ui_localErrorTip: "无法获取位置，请检查网络并确保定位授权。",
    ui_gpsTip: "获取位置超时,建议打开GPS定位服务。",
    ui_signSuccessTip: "签到成功！",
    ui_uploadTaskTip: "确定要提交任务吗？",
    ui_uploadTaskSuccessTip: "任务提交成功！",
    ui_endTraceTip: "该任务已结束，是否关闭轨迹记录功能？",
    ui_plannedDone: "按时完成",
    ui_overLimitDone: "超时完成",
    ui_unDone: "未完成",
    //missionmanage
    ui_meter: "米",
    ui_noStartTimeTraceTip: "该执行人尚未开启任务，无法查询其轨迹。",
    ui_defectAdvice1: "待客户答复",
    ui_defectAdvice2: "同意处理",
    ui_defectAdvice3: "其他",
    ui_defectAdvice4: "不同意处理",
    ui_defectState0: "未处理",
    ui_defectState2: "待处理",
    ui_defectState3: "待客户停电处理",
    ui_defectState4: "待线路停电处理",
    ui_defectState5: "其他",
    ui_defectState1: "已处理",
    ui_uploadPicTip: "最多上传6张图片！",
    ui_solvePerson: "消缺人员：",
    ui_solvedTime: "消缺时间：",
    ui_customerSign: "客户签名",
    ui_errorTitle: "页面无响应",
    ui_errorTip: "页面无响应，请检查网络连接。",
    //alarmsDetails
    ui_MeterName: "仪表名称：",
    ui_EventType: "事件类型：",
    ui_alarmConfirm: "确认状态",
    ui_alarmConfirmed: "已确认",
    ui_alarmUnconfirmed: "未确认",
    ui_manager: "管理",
    ui_MarkConfirmed: "标为已确认",
    ui_MarkUnconfirmed: "标为未确认",
    ui_Overshootvalue: "越限值:",
    //版本历史
    ui_updateHistory: "版本历史",
    ui_version: "版本",
    ui_mainUpdate: "主要更新",
    ui_updateTime: "更新时间：",
    ui_versionLog: "版本更新功能",
    //
    ui_MessageType: "消息类型",
    ui_dangerLevel1: "一般",
    ui_dangerLevel2: "重大",
    ui_dangerLevel3: "紧急",
    ui_subscribe: "订阅",
    ui_successfully: "成功",
    ui_identify: "辨识标准",
    //报警详情页
    ui_alarmDetail: "报警详情",
    ui_alarmEndTime: "结束时间:",
    ui_alarmMeterId: "仪表编号:",
    ui_alarmMeterName: "仪表名称:",
    ui_alarmParamId: "参数编号:",
    ui_alarmParamName: "参数名称:",
    ui_alarmType: "报警类型:",
    ui_type: "类型:",
    ui_detail: "详情:",
    ui_alarmValue: "报警值:",
    ui_limitValue: "限定值:",
    ui_time: "时间:",
    ui_alarmDeviceId: "设备编号:",
    ui_alarmDeviceName: "设备名称:",
    ui_fConfirmstatus: "确认状态:",
    ui_fConfirmuserid: "确认人:",
    ui_fConfirmtime: "确认时间:",
    //设备分类
    ui_devicesort: "设备分类",
    ui_classPath: "分类路径：",
    ui_allSelect: "全部订阅",
    ui_allNoSelect: "全部退订",
    ui_selectNotifyTitle: "消息通知",
    //照明
    ui_lightingDetail: "照明详情",
    ui_hasComfirm:"确认",
    //code码
    code_200: "请求成功，插入成功",
    code_201: "主外键异常",
    code_401: "需要客户端进行身份验证，需要客户端登录",
    code_105: "新增项不允许出现在包含设备设备详情或者巡检项详情的项下",
    code_101: "请删除子项",
    code_500: "服务异常",
    code_1000: "数据库pagecustom 表数据异常",
    code_10001: "信息填写有误",
    code_300: "appKey重复",
    code_301: "文件上传失败",
    code_302: "请添加图片",
    code_303: "删除失败，没有此图片",
    code_107: "新增项业务类型需要与父级业务类型一致",
    code_108: "没有此菜单",
    code_109: "此菜单未初始化排序值",
    code_120: "没有可改变的菜单",
    code_125: "更新视频信息错误",
    code_126: "删除视频信息错误",
    code_127: "文件找不到",
    code_128: "启用的版本出错",
    code_129: "没有此id的版本",
    code_130: "更新失败",
    code_140: "删除安卓版本信息失败",
    code_141: "插入安卓版本信息失败",
    code_142: "数据库api版本数据出现错误",
    code_143: "不支持此设备",
    code_0: "登录失败",
    code_1: "获取用户错误，请重新登录",
    code_145: "反馈提交失败，请重新提交",
    code_146: "更新用户信息失败",
    code_147: "没有权限，请去配置权限",
    code_304: "请输入fSubid",
    code_305: "变电所已存在",
    code_306: "该变电所的编号或名称已存在",
    code_307: "数据初始化失败",
    code_308: "删除失败",
    code_309: "增加失败",
    code_310: "不是任务管理员",
    code_144: "请检查用户名和用户密码，登录失败",
    code_311: "不在此任务人员清单中",
    code_312: "请先签到",
    code_313: "此账号没有权限签名",
    code_314: "重复签到",
    code_315: "当前变电所没有缺陷",
    code_316: "当前没有设备",
    code_317: "当前变电所没有设备",
    code_318: "当前任务已经有巡检单",
    code_319: "负责人不能是执行人",
    code_320: "当前角色及其下级角色下存在用户",
    code_321: "当前用户组及其下级用户组下存在用户",
    code_322: "当前组织机构及其下级组织机构下存在变电所",
    code_323: "当前组织机构及其下级组织机构下存在角色",
    code_324: "当前组织机构及其下级组织机构下存在用户组",
    code_325: "当前区域及其下级区域下存在变电所",
    code_326: "H5文件上传失败",
    code_327: "插入失败，该公司名称已存在",
    code_328: "插入失败，请重试（公司编号重复）",
    code_329: "请先添加文档",
    code_330: "日期格式化失败",
    code_331: "文件名已经存在",
    code_332: "文件大小不能超过10M",
    code_333: "数据库记录删除失败",
    code_334: "文件不存在",
    code_335: "该用户被禁用，请通知管理员开启使用权限",
    code_336: "不能禁用当前登录用户",
    code_700: "刷新token",
    code_205: "该设备存在记录",
    code_338: "用户名已存在",
    code_339: "萤石云appKey不存在",
    code_340: "萤石云appKey和appSecret不匹配",
    code_341: "网络配置错误",
    code_342: "自定义名称重复",
    code_343: "自定义报表计算项名称已存在",
    code_344: "该变电所下网关名称已经存在",
    code_345: "插入失败，网关代码重复",
    code_346: "萤石云appKey不能为空",
    code_347: "萤石云appSecret不能为空",
    code_600: "您使用的软件授权已过期",
    code_348: "当前用户没有变电所权限",
    code_349: "此变电所下已经有该仪表名称",
    code_350: "该变电所已经有该仪表code码",
    code_351: "该变电所已经有该仪表名称",
    code_352: "该回路编号已经存在",
    code_353: "该变压器编号已存在",
    code_354: "admin角色名称不能修改",
    code_355: "admin角色不能删除",
    code_356: "admin用户登录名不能修改",
    code_357: "admin用户不能删除",
    code_358: "删除失败，请登录有管理员权限的账号",
    code_359: "用户登录名已存在",
    code_360: "首页当前配置已为默认配置",
    code_361: "未配置萤石云appkey与secret信息",
    code_362: "该文档类别已存在",
    code_363: "当前用户未配角色",
    code_364: "非admin角色，操作权限不足",
    code_365: "该变电所没有组织机构",
    code_366: "变电所数量达到上限",
    code_367: "仪表数量达到上限",
    code_368: "没有此变电所",
    code_369: "没有查询到该变电所的组织机构信息",
    code_370: "admin用户不能被禁用",
    code_371: "不能修改admin用户的组织机构或角色",
    code_372: "用户没有所选的全部变电所",
    code_373: "该模板及其下级模板已有变电所在使用",
    code_374: "该变电所编号超出范围，不能使用自动生成",
    code_375: "系统中存在编号为10109999变电所，无法自动生成，请联系管理员",
    code_376: "该变电所下，该网关下的仪表编号已存在",
    code_5000: "请求失败，服务器异常",
    code_377: "该变电所id可用",
    code_378: "该变电所id不可用",
    code_379: "该条数据主键已存在",
    code_380: "设备重名",
    code_381: "该变电所没有设备分组",
    code_382: "该变电所当前设备分组下已存在同名设备，建议修改",
    code_other: "操作失败",
    code_fail: "服务器异常",
  };
}

//英文
function getEnLanguage() {
  Operation = {
    //ui字段
    //页面
    ui_todogoods: "To-do",
    ui_address: "Address",
    ui_photo: "Photo",
    ui_location: "Location",
    ui_selectSub: "Select a substation",
    ui_subHolder: "Please enter the substation name or number",
    ui_subHolderNoCode: "Please enter the substation name",
    //通用
    ui_loading: "Loading...",
    ui_back: "Back",
    ui_cancel: "Cancel",
    ui_confirm: "confirm",
    ui_All: "ALL",
    ui_query: "Query",
    ui_upload: "Upload",
    ui_dateselecttip: "Please select the correct query time",
    ui_month: "month",
    ui_SelectAll: "SelectAll",
    ui_UnselectAll: "UnselectAll",
    //deviceClass
    ui_edit: "Edit",
    ui_hidenodevice: "Hide No Device",
    ui_showalldevice: "Show All Device",
    ui_addnewdevice: "Add New Device",
    ui_quit: "Quit",
    ui_up: "Up",
    ui_down: "Down",
    ui_suresort: "Sure sort",
    ui_rename: "Rename",
    ui_copy: "Copy",
    ui_delete: "Del",
    ui_renamesuccess: "Rename Success",
    ui_sortsuccess: "Sort Success",
    ui_suretodel: "Are you sure to delete？",
    ui_upperlevel: "Upper level",
    //addDeviceCLass
    ui_selectcategory: "Select New Category",
    // AutoloadDetail
    ui_add: "Add",
    ui_save: "Save",
    ui_savesuccess: "Save Success",
    ui_nodevice: "No device information, please add!",
    ui_nosave: "Device is not saved yet!",
    ui_addFail: "Add fail！",
    ui_delFail: "Delete fail！",
    ui_delsuccess: "Delete success！",
    ui_deviceName: "Device Name",
    ui_copyFail: "Copy Fail！",
    ui_copySuccess: "Copy Success！",
    //allPatrolRecord
    ui_Patrolrecord: "Patrol Record",
    ui_today: "today",
    ui_yday: "yday",
    ui_curr: "curr.",
    ui_Uult: "Uult.",
    ui_timeSelect: "Select Time",
    ui_startTime: "StartTime",
    ui_endTime: "EndTime",
    ui_taskstate: "Task State",
    ui_Substationname: "Substation Name",
    ui_enterkeywords: "Please enter keywords",
    ui_PatroltaskNumber: "PatrolTaskNumber:",
    ui_PatrolStartTime: "PatrolStartTime:",
    ui_FindDefect: "FindDefect:",
    ui_Untreated: "   Untreated:",
    ui_unit: "",
    // allDefectPage
    ui_DefectPage: "Defect Page",
    ui_Defectstate: "Defect state",
    ui_Severitygrade: "Severity grade",
    ui_Devname: "DeviceName:",
    ui_DefectExplain: "Explain:",
    ui_SpecificLoc: "Location:",
    ui_categories: "Categories:",
    ui_Emergenylevel: "level:",
    ui_dealState: "State:",
    ui_findTime: "FindTime:",
    // selectPhoto
    ui_photo: "Photo",
    ui_location: "Location",
    //todoItem
    ui_taskType: "TaskType",
    ui_taskTypeSelect: "TaskTypeSelect",
    //taskDetail
    ui_taskDetail: "Task Detail",
    ui_taskNumber: "TaskNum:",
    ui_tasktyper: "TaskType:",
    ui_Subname: "Substation:",
    ui_Originator: "Originator:",
    ui_Principal: "Principal:",
    ui_StarPlanTime: "PlanStartTime:",
    ui_endPlanTime: "PlanEndTime:",
    ui_TaskContent: "TaskContent:",
    ui_TaskStartTime: "TaskStartTime:",
    ui_TaskFinishTime: "TaskEndTime:",
    ui_Totaldefect: "Totaldefect:",
    ui_defectUntreatNum: "DefectUntreat:",
    ui_TaskResult: "TaskResult:",
    ui_TaskRemarks: "Task Remarks",
    ui_Entertexthere: "Enter text here...",
    ui_Implementationsituation: "Implementation",
    ui_Implement: "Execute",
    ui_submit: "Submit",
    ui_register: "Register",
    ui_ImplementDetail: "Execute Detail",
    ui_attention: "Attention",
    ui_executionprompt: "There is only one patrol sheet for a single task, one patrol sheet can only be saved by one person, and multiple people may overwrite each other.",
    //报警
    ui_Alarm: "Alarm",
    ui_alarmConfirm: "Confirm Status",
    ui_alarmConfirmed: "Confirmed",
    ui_alarmUnconfirmed: "Unconfirmed",
    ui_manager: "Manage",
    ui_MarkConfirmed: "MarkConfirmed",
    ui_MarkUnconfirmed: "MarkUnconfirmed",
    //版本历史
    ui_updateHistory: "Version History",
    ui_version: "Version ",
    ui_mainUpdate: " major update",
    ui_updateTime: "Updated:",
    ui_versionLog: "Version Update Function",
    //patrolContent
    ui_Subinspection: "Substation inspection",
    //patrolContent
    ui_showOnlydevice: "Show only device",
    ui_DefectRegist: "Defect Regist",
    ui_hasnosave: "The current patrol information has not been saved. Are you sure you want to leave?",
    ui_nodeviceInThis: "No devices under this group!",
    ui_noDeviceRecord: "No Device Record！",
    ui_morethansixpic: "Upload up Max Six pictures",
    ui_selectDefectLoc: "Please select defect location!",
    ui_uploadSuccess: "Upload Success",
    ui_noDefectRecord: 'No Defect Record！',
    ui_noSaveWantOut: 'The message has not been saved. Are you sure you want to exit?',
    ui_noSaveWantDelete: 'Are you sure you want to delete the saved picture?',
    ui_fillrequireditems: 'Please fill in the required items',
    ui_gotowebpagedevice: "You can go to webpage device management -> device definition -> select(",
    ui_patrolinformationadd: ")Group - > patrol information add patrol item",
    ui_Thefileformatmustbe: "The file format must be:png/jpg/jpeg",
    ui_defectPoision: "Defect location：",
    //missionManager
    ui_submitTask: "Submit Task",
    ui_Executor: "Executor",
    ui_Executorsituation: "Situation",
    ui_checkTime: "CheckTime",
    ui_checkSite: "CheckSite",
    ui_OffsetDistance: "Offsetloc",
    ui_submitTime: "SubmitTime",
    ui_Remark: "Remarks",
    ui_trajectory: "Trajectory",
    ui_Trackquery: "Track Query",
    //文档分类
    ui_FileList: "File List",
    //变电所消缺单
    ui_SubstationDefect: "Substation Defect",
    ui_Description: "Description:",
    ui_detriment: "detriment:",
    ui_Specificlocation: "Specificlocation:",
    ui_categorie: "Categorie:",
    ui_Urgency: "Urgency:",
    ui_EliminationPeriod: "EliminationPeriod：",
    ui_DealStateForDefect: "ProcessingState:",
    ui_FindTimeForDefect: "FindTime:",
    //缺陷信息
    ui_DefectInfo: "Defect Info",
    ui_Defectlocation: "Defectlocation",
    ui_SeverityGrade: "SeverityGrade:",
    ui_Scenephotos: "ScenePhotos:",
    ui_RectifyPhoto: "RectifyPhoto:",
    ui_suggestion: "suggestion:",
    ui_CustomerComments: "CustomerIdea:",
    ui_Situation: "Situation:",
    ui_MissingPersonnel: "SolvePersonnel:",
    ui_SolveTime: "SolveTime:",
    //用户报告
    ui_UserReport: "User Report",
    ui_rightButton: "Click the top right button to filter!",
    ui_subSelectTip: "Please filter and click the query button!",
    //Autoload
    ui_nodata: "No related data",
    ui_yes: "Yes",
    ui_no: "No",
    ui_cannotcopy: "No devices to copy.",
    ui_cannotdel: "No devices can be removed.",
    ui_suredel: "Are you sure to delete the device",
    ui_question: "?",
    ui_devicetemplate: "No device template information, please go to the web page to add!",
    //todoitems
    ui_todo: "To-do",
    ui_doing: "Doing",
    ui_done: "Done",
    ui_goods: "items",
    ui_xunjian: "Inspection",
    ui_xiaoque: "Disappear",
    ui_taskid: "TaskNum",
    ui_plandonetime: "PlanEndTime",
    ui_donetime: "TaskEndTime",
    //missionDetail
    ui_seeDetail: "View details",
    ui_openTask: "Open task",
    ui_siteSign: "Sign in",
    ui_doTask: "Perform task",
    ui_taskSubmit: "Submit Task",
    ui_doingDetail: "Execute detail",
    ui_notCheck: "Not checked in",
    ui_checked: "Checked in",
    ui_submitted: "Submitted",
    ui_noAllCommit: "Not all the executives have submitted,",
    ui_submitTaskTip: "Are you sure to submit and end the task?",
    ui_submitTaskSuccessTip: "Submit successfully, the task has ended!",
    ui_openTaskTip: "Please start the task first!",
    ui_signinTip: "Please sign in first!",
    ui_openTraceTip: "Do you want to turn on track recording?",
    ui_localErrorTip: "Unable to get location, check network and make sure location authorization.",
    ui_gpsTip: "Timeout for obtaining location, it is recommended to turn on GPS positioning service.",
    ui_signSuccessTip: "Sign in successfully!",
    ui_uploadTaskTip: "Are you sure to submit the task?",
    ui_uploadTaskSuccessTip: "Task submitted successfully!",
    ui_endTraceTip: "This task is over. Do you want to turn off the track record?",
    ui_plannedDone: "Complete on time",
    ui_overLimitDone: "Timeout completion",
    ui_unDone: "Unfinished",
    //missionmanage
    ui_meter: "meters",
    ui_noStartTimeTraceTip: "The executor has not started the task and cannot query its track.",
    ui_defectAdvice1: "Pending customer response",
    ui_defectAdvice2: "Consent to deal",
    ui_defectAdvice3: "Others",
    ui_defectAdvice4: "Disagree",
    ui_defectState0: "Unprocessed",
    ui_defectState2: "Pending",
    ui_defectState3: "Wait for customer power failure",
    ui_defectState4: "Wait for line power failure",
    ui_defectState5: "Others",
    ui_defectState1: "Processed",
    ui_uploadPicTip: "Upload up to 6 pictures!",
    ui_solvePerson: "Disappear person:",
    ui_solvedTime: "Disappear time:",
    ui_customerSign: "Customer signature",
    ui_errorTitle: "Page is not responding",
    ui_errorTip: "The page is not responding, please check the network connection.",
    //alarmsDetails
    ui_MeterName: "MeterName：",
    ui_EventType: "EventType：",
    //
    ui_MessageType: "Message Type",

    ui_dangerLevel1: "General",
    ui_dangerLevel2: "Major",
    ui_dangerLevel3: "Urgent",
    ui_subscribe: "Subscribe",
    ui_successfully: "Successfully",
    ui_identify: "Identify standard",
    //报警详情页
    ui_alarmDetail: "Alarm details",
    ui_alarmEndTime: "EndTime:",
    ui_alarmMeterId: "MeterId:",
    ui_alarmMeterName: "MeterName:",
    ui_alarmParamId: "ParamId:",
    ui_alarmParamName: "ParamName:",
    ui_alarmType: "AlarmType:",
    ui_type: "Type:",
    ui_detail: "Detail:",
    ui_alarmValue: "AlarmValue:",
    ui_limitValue: "LimitValue:",
    ui_time: "Time:",
    ui_alarmDeviceId: "DeviceID:",
    ui_alarmDeviceName: "DeviceName:",
    ui_Overshootvalue: "OvershootValue:",
    ui_fConfirmstatus: "ConfirmStatus:",
    ui_fConfirmuserid: "ConfirmuserName:",
    ui_fConfirmtime: "ConfirmTime:",
    //设备分类
    ui_devicesort: "Device Sort",
    ui_classPath: "ClassPath:",
    ui_allSelect: "Subscribe all",
    ui_allNoSelect: "Unsubscribe all",
    ui_selectNotifyTitle: "Notification",
    //照明
    ui_lightingDetail: "Lighting details",
    ui_hasComfirm:"Confirm",
    //code码
    code_200: "Request succeeds, insert success",
    code_201: "Primary foreign key exception",
    code_401: "The client needs to be authenticated, the client needs to log",
    code_105: "New items are not allowed in the entry contains details of equipment or inspection equipment item details",
    code_101: "Please delete the child",
    code_500: "Service Exception",
    code_1000: "Pagecustom database table data anomalies",
    code_10001: "Information filled in incorrectly",
    code_300: "appKey repeat",
    code_301: "File upload failed",
    code_302: "Please add a picture",
    code_303: "Delete failed, not this picture",
    code_107: "New item type of business needs to be consistent with the parent service type",
    code_108: "Without this menu",
    code_109: "This menu is not initialized sort value",
    code_120: "There is no change in the menu",
    code_125: "Error updating video",
    code_126: "Delete video error",
    code_127: "File Not Found",
    code_128: "Enabled version of the error",
    code_129: "There is no version of this id",
    code_130: "Update failed",
    code_140: "Failed to delete Android version information",
    code_141: "Plug Ruan Zhuo version information failed",
    code_142: "Api version of the database data errors",
    code_143: "This device is not supported",
    code_0: "Login failed",
    code_1: "Obtain user error, please sign in again",
    code_145: "Failure to submit feedback, please resubmit",
    code_146: "Failed to update user information",
    code_147: "Do not have permission, please go to configure permissions",
    code_304: "Please enter fSubid",
    code_305: "Substation already exists",
    code_306: "Number or name of the substation already exists",
    code_307: "Data initialization failed",
    code_308: "failed to delete",
    code_309: "Increase failure",
    code_310: "Not a task manager",
    code_144: "Check the user name and password, the login fails",
    code_311: "This task is not in the list of staff",
    code_312: "Please sign",
    code_313: "This account does not have permission signature",
    code_314: "Repeat sign",
    code_315: "The current substation is not defective",
    code_316: "There are currently no devices",
    code_317: "There is no equipment in the current substation",
    code_318: "The current mission has a single inspection",
    code_319: "It is not responsible for the executor",
    code_320: "Currently exist under the user role and its subordinate role",
    code_321: "The presence of the user currently subordinate user group and user group",
    code_322: "The presence of substations under the current organization and its subordinate organizations",
    code_323: "The presence of the organization and its subordinate role under the current organizational structure",
    code_324: "User groups exist under the current organization and its subordinate organizations",
    code_325: "Substation region exists under the current region and its subordinate",
    code_326: "H5 file upload failed",
    code_327: "Insert fails, the company name already exists",
    code_328: "Insert failed, please try again (Company Number repeat)",
    code_329: "Please add a document",
    code_330: "Date formatting failed",
    code_331: "Filename already exists",
    code_332: "File size can not exceed 10M",
    code_333: "Failed to delete database records",
    code_334: "file does not exist",
    code_335: "The user is disabled, please notify the administrator open permissions",
    code_336: "You can not disable the currently logged on user",
    code_700: "Refresh token",
    code_205: "The device already exists",
    code_338: "Username already exists",
    code_339: "EZVIZ appKey does not exist",
    code_340: "EZVIZ appKey and appSecret do not match",
    code_341: "Network configuration error",
    code_342: "Repeat custom name",
    code_343: "Custom report calculated item name already exists",
    code_344: "This substation gateway name already exists",
    code_345: "Insertion fails, the gateway code repeat",
    code_346: "EZVIZ appKey can not be empty",
    code_347: "EZVIZ appSecret can not be empty",
    code_600: "You use software license has expired",
    code_348: "The current user does not have permission to substation",
    code_349: "This substation has been the instrument name",
    code_350: "The substation has been the instrument code code",
    code_351: "The substation has been the instrument name",
    code_352: "The loop number already exists",
    code_353: "The transformer number already exists",
    code_354: "admin role names can not be modified",
    code_355: "admin role can not be deleted",
    code_356: "admin user login name can not be modified",
    code_357: "admin users can not delete",
    code_358: "Deletion failed, please log in with administrator privileges account",
    code_359: "User login name already exists",
    code_360: "Home current configuration as the default configuration",
    code_361: "EZVIZ appkey and secret information is not configured",
    code_362: "The document category already exists",
    code_363: "Not with the current user role",
    code_364: "Non-admin role, lack of operating authority",
    code_365: "The substation has no organization",
    code_366: "The number of substations reaches the upper limit",
    code_367: "The number of instruments reaches the upper limit",
    code_368: "Without this substation",
    code_369: "You can not find any information on the organization of the substation",
    code_370: "admin user can not be disabled",
    code_371: "You can not modify the admin user organization or role",
    code_372: "All the user has not selected substation",
    code_373: "The template and its subordinate template has been used in a substation",
    code_374: "The substation number is out of range, can not be used to automatically generate",
    code_375: "Present in the system numbered 10,109,999 substation, can not be automatically generated, please contact the administrator",
    code_376: "In this substation, meter number at the gateway already exists",
    code_5000: "The request failed server abnormal",
    code_377: "The substation id available",
    code_378: "The substation is unavailable id",
    code_379: "Primary key of the record already exists",
    code_380: "Equipment same name",
    code_381: "The substation equipment is no packet",
    code_382: "The current substation equipment under the same name already exists in the device grouping, proposed changes",
    code_other: "Operation failed",
    code_fail: "Server exception",
  };
}
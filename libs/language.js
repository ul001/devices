var Operation={};
//中文
function getZhLanguage(){
    Operation={
//ui字段
//页面
        ui_todogoods:'待办事项',
        ui_address:'地址',
        ui_photo:'照片',
        ui_location:'位置',
        ui_selectSub:'选择变电所',
        ui_subHolder:'请输入变电所名称或编号',
//通用
        ui_loading:'正在加载...',
        ui_back:'返回',
        ui_cancel:'取消',
        ui_neterror:'网络异常',

//code码        
        code_200:'请求成功，插入成功',
        code_201:'主外键异常',
        code_401:'需要客户端进行身份验证，需要客户端登录',
        code_105:'新增项不允许出现在包含设备设备详情或者巡检项详情的项下',
        code_101:'请删除子项',
        code_500:'服务异常',
        code_1000:'数据库pagecustom 表数据异常',
        code_10001:'信息填写有误',
        code_300:'appKey重复',
        code_301:'文件上传失败',
        code_302:'请添加图片',
        code_303:'删除失败，没有此图片',
        code_107:'新增项业务类型需要与父级业务类型一致',
        code_108:'没有此菜单',
        code_109:'此菜单未初始化排序值',
        code_120:'没有可改变的菜单',
        code_125:'更新视频信息错误',
        code_126:'删除视频信息错误',
        code_127:'文件找不到',
        code_128:'启用的版本出错',
        code_129:'没有此id的版本',
        code_130:'更新失败',
        code_140:'删除安卓版本信息失败',
        code_141:'插入安卓版本信息失败',
        code_142:'数据库api版本数据出现错误',
        code_143:'不支持此设备',
        code_0:'登录失败',
        code_1:'获取用户错误，请重新登录',
        code_145:'反馈提交失败，请重新提交',
        code_146:'更新用户信息失败',
        code_147:'没有权限，请去配置权限',
        code_304:'请输入fSubid',
        code_305:'变电所已存在',
        code_306:'该变电所的编号或名称已存在',
        code_307:'数据初始化失败',
        code_308:'删除失败',
        code_309:'增加失败',
        code_310:'不是任务管理员',
        code_144:'请检查用户名和用户密码，登录失败',
        code_311:'不在此任务人员清单中',
        code_312:'请先签到',
        code_313:'此账号没有权限签名',
        code_314:'重复签到',
        code_315:'当前变电所没有缺陷',
        code_316:'当前没有设备',
        code_317:'当前变电所没有设备',
        code_318:'当前任务已经有巡检单',
        code_319:'负责人不能是执行人',
        code_320:'当前角色及其下级角色下存在用户',
        code_321:'当前用户组及其下级用户组下存在用户',
        code_322:'当前组织机构及其下级组织机构下存在变电所',
        code_323:'当前组织机构及其下级组织机构下存在角色',
        code_324:'当前组织机构及其下级组织机构下存在用户组',
        code_325:'当前区域及其下级区域下存在变电所',
        code_326:'H5文件上传失败',
        code_327:'插入失败，该公司名称已存在',
        code_328:'插入失败，请重试（公司编号重复）',
        code_329:'请先添加文档',
        code_330:'日期格式化失败',
        code_331:'文件名已经存在',
        code_332:'文件大小不能超过10M',
        code_333:'数据库记录删除失败',
        code_334:'文件不存在',
        code_335:'该用户被禁用，请通知管理员开启使用权限',
        code_336:'不能禁用当前登录用户',
        code_700:'刷新token',
        code_205:'该设备存在记录',
        code_338:'用户名已存在',
        code_339:'萤石云appKey不存在',
        code_340:'萤石云appKey和appSecret不匹配',
        code_341:'网络配置错误',
        code_342:'自定义名称重复',
        code_343:'自定义报表计算项名称已存在',
        code_344:'该变电所下网关名称已经存在',
        code_345:'插入失败，网关代码重复',
        code_346:'萤石云appKey不能为空',
        code_347:'萤石云appSecret不能为空',
        code_600:'您使用的软件授权已过期',
        code_348:'当前用户没有变电所权限',
        code_349:'此变电所下已经有该仪表名称',
        code_350:'该变电所已经有该仪表code码',
        code_351:'该变电所已经有该仪表名称',
        code_352:'该回路编号已经存在',
        code_353:'该变压器编号已存在',
        code_354:'admin角色名称不能修改',
        code_355:'admin角色不能删除',
        code_356:'admin用户登录名不能修改',
        code_357:'admin用户不能删除',
        code_358:'删除失败，请登录有管理员权限的账号',
        code_359:'用户登录名已存在',
        code_360:'首页当前配置已为默认配置',
        code_361:'未配置萤石云appkey与secret信息',
        code_362:'该文档类别已存在',
        code_363:'当前用户未配角色',
        code_364:'非admin角色，操作权限不足',
        code_365:'该变电所没有组织机构',
        code_366:'变电所数量达到上限',
        code_367:'仪表数量达到上限',
        code_368:'没有此变电所',
        code_369:'没有查询到该变电所的组织机构信息',
        code_370:'admin用户不能被禁用',
        code_371:'不能修改admin用户的组织机构或角色',
        code_372:'用户没有所选的全部变电所',
        code_373:'该模板及其下级模板已有变电所在使用',
        code_374:'该变电所编号超出范围，不能使用自动生成',
        code_375:'系统中存在编号为10109999变电所，无法自动生成，请联系管理员',
        code_376:'该变电所下，该网关下的仪表编号已存在',
        code_5000:'请求失败，服务器异常',
        code_377:'该变电所id可用',
        code_378:'该变电所id不可用',
        code_379:'该条数据主键已存在',
        code_380:'设备重名',
        code_381:'该变电所没有设备分组',
        code_382:'该变电所当前设备分组下已存在同名设备，建议修改',
        code_other:'操作失败',
    
    }
}

//英文
function getEnLanguage(){
    Operation={
//ui字段
//页面
    ui_todogoods:'To-do',
    ui_address:'Address',
    ui_photo:'Photo',
    ui_location:'Location',
    ui_selectSub:'Select a substation',
    ui_subHolder:'Please enter the substation name or number',
//通用
    ui_loading:'Loading...',
    ui_back:'Back',
    ui_cancel:'Cancel',
    
//code码
    code_200:'Request succeeds, insert success',
    code_201:'Primary foreign key exception',
    code_401:'The client needs to be authenticated, the client needs to log',
    code_105:'New items are not allowed in the entry contains details of equipment or inspection equipment item details',
    code_101:'Please delete the child',
    code_500:'Service Exception',
    code_1000:'Pagecustom database table data anomalies',
    code_10001:'Information filled in incorrectly',
    code_300:'appKey repeat',
    code_301:'File upload failed',
    code_302:'Please add a picture',
    code_303:'Delete failed, not this picture',
    code_107:'New item type of business needs to be consistent with the parent service type',
    code_108:'Without this menu',
    code_109:'This menu is not initialized sort value',
    code_120:'There is no change in the menu',
    code_125:'Error updating video',
    code_126:'Delete video error',
    code_127:'File Not Found',
    code_128:'Enabled version of the error',
    code_129:'There is no version of this id',
    code_130:'Update failed',
    code_140:'Failed to delete Android version information',
    code_141:'Plug Ruan Zhuo version information failed',
    code_142:'Api version of the database data errors',
    code_143:'This device is not supported',
    code_0:'Login failed',
    code_1:'Obtain user error, please sign in again',
    code_145:'Failure to submit feedback, please resubmit',
    code_146:'Failed to update user information',
    code_147:'Do not have permission, please go to configure permissions',
    code_304:'Please enter fSubid',
    code_305:'Substation already exists',
    code_306:'Number or name of the substation already exists',
    code_307:'Data initialization failed',
    code_308:'failed to delete',
    code_309:'Increase failure',
    code_310:'Not a task manager',
    code_144:'Check the user name and password, the login fails',
    code_311:'This task is not in the list of staff',
    code_312:'Please sign',
    code_313:'This account does not have permission signature',
    code_314:'Repeat sign',
    code_315:'The current substation is not defective',
    code_316:'There are currently no devices',
    code_317:'There is no equipment in the current substation',
    code_318:'The current mission has a single inspection',
    code_319:'It is not responsible for the executor',
    code_320:'Currently exist under the user role and its subordinate role',
    code_321:'The presence of the user currently subordinate user group and user group',
    code_322:'The presence of substations under the current organization and its subordinate organizations',
    code_323:'The presence of the organization and its subordinate role under the current organizational structure',
    code_324:'User groups exist under the current organization and its subordinate organizations',
    code_325:'Substation region exists under the current region and its subordinate',
    code_326:'H5 file upload failed',
    code_327:'Insert fails, the company name already exists',
    code_328:'Insert failed, please try again (Company Number repeat)',
    code_329:'Please add a document',
    code_330:'Date formatting failed',
    code_331:'Filename already exists',
    code_332:'File size can not exceed 10M',
    code_333:'Failed to delete database records',
    code_334:'file does not exist',
    code_335:'The user is disabled, please notify the administrator open permissions',
    code_336:'You can not disable the currently logged on user',
    code_700:'Refresh token',
    code_205:'The device already exists',
    code_338:'Username already exists',
    code_339:'EZVIZ appKey does not exist',
    code_340:'EZVIZ appKey and appSecret do not match',
    code_341:'Network configuration error',
    code_342:'Repeat custom name',
    code_343:'Custom report calculated item name already exists',
    code_344:'This substation gateway name already exists',
    code_345:'Insertion fails, the gateway code repeat',
    code_346:'Fluorite cloud appKey can not be empty',
    code_347:'Fluorite cloud appSecret can not be empty',
    code_600:'You use software license has expired',
    code_348:'The current user does not have permission to substation',
    code_349:'This substation has been the instrument name',
    code_350:'The substation has been the instrument code code',
    code_351:'The substation has been the instrument name',
    code_352:'The loop number already exists',
    code_353:'The transformer number already exists',
    code_354:'admin role names can not be modified',
    code_355:'admin role can not be deleted',
    code_356:'admin user login name can not be modified',
    code_357:'admin users can not delete',
    code_358:'Deletion failed, please log in with administrator privileges account',
    code_359:'User login name already exists',
    code_360:'Home current configuration as the default configuration',
    code_361:'EZVIZ appkey and secret information is not configured',
    code_362:'The document category already exists',
    code_363:'Not with the current user role',
    code_364:'Non-admin role, lack of operating authority',
    code_365:'The substation has no organization',
    code_366:'The number of substations reaches the upper limit',
    code_367:'The number of instruments reaches the upper limit',
    code_368:'Without this substation',
    code_369:'You can not find any information on the organization of the substation',
    code_370:'admin user can not be disabled',
    code_371:'You can not modify the admin user organization or role',
    code_372:'All the user has not selected substation',
    code_373:'The template and its subordinate template has been used in a substation',
    code_374:'The substation number is out of range, can not be used to automatically generate',
    code_375:'Present in the system numbered 10,109,999 substation, can not be automatically generated, please contact the administrator',
    code_376:'In this substation, meter number at the gateway already exists',
    code_5000:'The request failed server abnormal',
    code_377:'The substation id available',
    code_378:'The substation is unavailable id',
    code_379:'Primary key of the record already exists',
    code_380:'Equipment same name',
    code_381:'The substation equipment is no packet',
    code_382:'The current substation equipment under the same name already exists in the device grouping, proposed changes',
    code_other:'Operation failed',
    };
}
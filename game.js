(() => {
'use strict';

const SAVE_KEY = 'huaiwan_orphanage_save_v11';
const LEGACY_SAVE_KEYS = [];
const SETTINGS_KEY = 'huaiwan_orphanage_settings_v11';
const LEGACY_SETTINGS_KEYS = ['huaiwan_orphanage_settings_v10','huaiwan_orphanage_settings_v9','huaiwan_orphanage_settings_v8','huaiwan_orphanage_settings_v7','huaiwan_orphanage_settings_v6','huaiwan_orphanage_settings_v5','huaiwan_orphanage_settings_v4','huaiwan_orphanage_settings_v3','huaiwan_orphanage_settings_v2'];

const locations = [
  ['prologue','院门外'],['lobby','门厅'],['activity','活动室'],['wardrobe','服装室'],['dorm','二层寝室'],['records','记录柜'],['office','值班室'],
  ['laundry','洗衣房'],['stairs','南楼梯'],['supplement','事故补记'],['rebuild','把那一晚排回来'],['rainnight','那一晚'],['exit','离开']
];

const anchorConfig = {
  temp_place:{location:'activity',names:['临时睡人的地方','临调床位','集中等待区'], additions:[
    '',
    '完整页补出了三个临时位置：活动室折叠床、活动室靠门观察位、二层原寝室。暴雨那晚临时调床以后，床号已经不能直接代表孩子实际待的位置',
    '整晚这里都只是临时集中点，孩子换过干衣，睡的位置也跟着临调页变过一次'
  ]},
  cloth_tags:{location:'wardrobe',names:['剪下来的布签','换衣桌','腕带准备桌'], additions:[
    '',
    '领用单写着 18:34，剪裁条则落在 18:41——库存衣先发出去，旧布签才从湿衣上剪下来；',
    '两条位置底带拿反后，姓名布签被拆下重新缝回对应底带。等返工便条也接上，这张桌子的用途才从零散针线变成一条完整经过'
  ]},
  empty_bed:{location:'dorm',names:['空出来的床','临时调床','生活记录来源'], additions:[
    '',
    '04 床当天上午便已停用，空床和暴雨夜的去向不能直接划等号；小满事故前就被临时调到活动室，空床和当晚的“失踪”没有关系。',
    '后来核对腕带时，寝室照护页反而成了最可靠的旁证之一。'
  ]},
  papers:{location:'records',names:['没写完整的纸','三份交接','事故补记'], additions:[
    '',
    '把顺序排开以后，两张交接写的是同一次返工：一张记孩子暂留，一张记位置底带拿反。',
    '正式报告把这次错配压成“二次核对无误”，内部补记却留下了返工、停留与重新确认的过程；'
  ]},
  laundry_table:{location:'laundry',names:['红线和剪刀','缝腕带的地方','腕带核对桌'], additions:[
    '',
    '湿衣换掉以后，能跟着本人移动的只有重新缝好的腕带。剪刀与红线本来就是日常针线物资，当晚只是被临时拿来拆线、重缝和制作腕带',
    '两条位置底带拿反以后，也是在这张桌边重新核对、拆线再缝。'
  ]},
  two_children:{location:'laundry',names:['两个孩子被留下','重新核对腕带'], additions:[
    '',
    '留下重核的是小满和豆豆：姓名布签属于本人，缝上的位置底带却互相颠倒，所以她们才被留在桌边重新核对'
  ]},
  backdoor:{location:'stairs',names:['封住的后门','后勤坡道','撤离出口'], additions:[
    '',
    '19:18 后门钥匙被借出，此时南楼梯已经停用，正门水位也不再适合推车；活动室东侧的后勤内梯仍能下到洗衣房，洗衣房外的坡道也可推车通行，时间上正好接在钥匙借出之后；',
    '门厅与南楼梯都不能走以后，这里成了当晚实际使用的撤离出口。'
  ]}
};

const records = {
  entry_rules:{title:'清点登记说明',meta:'现代 / 拆除前移交',body:[
    '能辨认的纸质材料登记标题、日期、来源位置；不做现场修复',
    '可移交学校的普通教育史旧物单独装箱；建筑拆除相关材料留给拆除队；无法确认去向的暂存',
    '每离开一处，补写清点时间与经手人；未签经手人的行不计入正式移交记录','破损严重但仍能辨读的材料，不现场拆订；装袋后在箱单备注“原状保存”'
  ]},
  box_labels:{title:'三只纸箱标签',meta:'现代 / 门厅',lines:['A箱：学校接收——普通教学与儿童生活旧物','B箱：拆除队——建筑、钥匙、维修、施工相关','C箱：待确认——来源或去向不明']},
  canteen_scrap:{title:'《晚饭临时分配条》',meta:'十九年前 / 活动室柜内 / 日常记录',lines:['17:20　低龄组米饭 12 份，另留白粥 2 份','小满不要香菜；豆豆只肯用黄色杯','缺小勺 1 把，晚些从二层取','背面有人算了两道乘法，第二道写错后涂掉']},
  shoe_box_note:{title:'《鞋柜小纸条》',meta:'十九年前 / 二层寝室 / 生活杂项',lines:['乔晚宁（乔乔）：鞋带一对，右边那根总松','贺成安（阿成）：左鞋后跟又开线，暂贴胶布','小满：拖鞋穿反一次，被何秋芹换回','纸角画了一只很不像猫的猫']},
  phone_repair_slip:{title:'《值班室电话报修条》',meta:'十九年前 / 两周前 / 值班室',lines:['故障：听筒杂音，偶尔断线','维修：更换卷线；机身继续使用','签收栏只写了“司徒”两个字','背面夹着一张糖纸，已经褪成灰色']},
  temp_bed_partial:{title:'《临时床位调整》受潮页',meta:'十九年前 / 18:30 后',lines:['低龄组暂移活动室，折叠床另记','……04 床……停……','……靠门……观察……']},
  activity_misc:{title:'活动室柜内杂物',meta:'现代 / 活动室柜内',lines:['一盒彩色粉笔，只剩白色和绿色','两张旧贴纸背面写着“借蜡笔要还”','一只没有盖子的塑料水杯，底部刻着“成”']},
  stock_form:{title:'《库存衣物领用单》',meta:'十九年前 / 18:34',lines:['18:34　领库存短袖 18 件、长裤 16 条、薄外套 7 件','领用原因：一层进水，低龄组与活动室临时安置儿童换干衣','毛巾 12 条一并领走；拖鞋数量不足，沿用各组原有库存','经手：邹雪梅','页脚另记：130 码长裤少 2 条，次日补库']},
  wet_clothes:{title:'《湿衣收拢表》',meta:'十九年前 / 18:37',lines:['18:37 起，湿衣按楼层暂装编织袋','二层袋口扎蓝绳；活动室袋口未扎，后补标记','部分衣物姓名布签仍可辨，裤脚与袖口普遍进水','备注：先送洗衣房，不得继续穿','一只黄色塑料杯误装进袋，已取出放值班桌']},
  cutting_note:{title:'《后勤剪裁条》',meta:'十九年前 / 18:41',lines:['18:41　开始剪取仍可辨认的姓名布签，另存','字迹已经散开的不强认，单独压在盘边','布签先放搪瓷盘；临时位置先写在白棉布底带上，再把姓名布签缝到对应底带；盘底积水要勤擦','剪刀归还洗衣房针线柜','经手栏写得很重：邹雪梅']},
  flood_note:{title:'《一层进水简记》',meta:'十九年前 / 18:12—18:27',lines:['18:12　旧河道水位涨，院墙排水口回流','18:18　门厅铺毛巾、抬低处纸箱','18:21　外沿进水，靠门区域不再堆物','18:27　低龄组先移二层','旁注：雨势继续加大，电话联系街道未接通一次']},
  bed_repair:{title:'《床架维修单》',meta:'十九年前 / 当日上午',lines:['二层 04 床：床板裂，停用','床垫已移至储物角，不得临时铺回','维修材料预计下周到；先用活动室折叠床顶替','值班人员已知，交班时再提醒一次','维修人签名只剩姓：赵']},
  night_care:{title:'《夜间照护页》',meta:'十九年前 / 事故当日',lines:['林小满：原二层，因 04 床停用，晚间改活动室折叠床','乔晚宁（乔乔）：二层原寝室','贺成安（阿成）：二层原寝室','豆豆：新入院，当晚安排活动室靠门观察位；登记名陈雨宁']},
  daily_issue:{title:'《当日物品领用条》',meta:'十九年前 / 下午',lines:['小满：薄毯 1','乔乔：鞋带 1 对','阿成：毛巾袋 1','豆豆：临时洗漱杯 1，备注“只认小名”']},
  temp_bed_full:{title:'《临时床位调整》完整页',meta:'十九年前 / 17:50',lines:['活动室折叠床 1：林小满','活动室靠门观察位：陈雨宁（豆豆）','二层原寝室：乔晚宁（乔乔）、贺成安（阿成）等','04 床：维修停用']},
  handover_pan:{title:'司徒琴交接',meta:'十九年前 / 当晚手写',lines:['低龄上楼后换干衣','腕带先按原布签做','18:56 两名儿童暂留换衣桌，重新核对','南楼梯停用后改后勤口']},
  handover_zou:{title:'邹雪梅交接',meta:'十九年前 / 当晚手写',lines:['湿衣收拢后剪可辨布签','布签放盘，盘底有水，字更花','两条位置底带拿反，已拆线重缝','后门钥匙 19:18 取']},
  handover_he:{title:'何秋芹值班末页',meta:'十九年前 / 当晚手写',lines:['低龄组先移二层','换衣后在活动室等','乔乔说两条腕带位置不对','19:16 南楼梯裂响，人员回撤']},
  wristband_a:{title:'临时腕带抄记 A',meta:'十九年前 / 18:49',lines:['姓名布签：林小满','位置底带：活动室靠门观察位','缝制时间：18:49','材料：白棉布，红粗线','抄记人末笔过重，位置栏有一处擦痕']},
  wristband_b:{title:'临时腕带抄记 B',meta:'十九年前 / 18:49',lines:['姓名布签：陈雨宁','位置底带：活动室折叠床','缝制时间：18:49','材料：白棉布，红粗线','姓名后另添小字“豆豆”，墨色较浅']},
  doudou_name:{title:'新入院生活说明',meta:'十九年前 / 豆豆',lines:['登记名：陈雨宁','目前只稳定回应“小名：豆豆”','突然叫登记全名时常无反应，交接须说明']},
  stairs_closed:{title:'《南楼梯维修页》',meta:'十九年前 / 19:16',lines:['19:16　半层墙体裂缝扩大，扶手一侧掉灰','南楼梯立即停止通行；二层人员原路回撤','不得从二层继续向门厅下撤','楼梯口临时放木凳作拦挡，后续改用绳','页角沾泥，最后一行只写到“别推车”']},
  lobby_water:{title:'《门厅水位简记》',meta:'十九年前 / 19:12',lines:['19:02　门厅积水过鞋底','19:12　外门内侧持续进水','推车已无法从正门通过']},
  back_key:{title:'《后门钥匙登记》',meta:'十九年前 / 19:18',lines:['19:18　洗衣房后门钥匙借出','借用：邹雪梅','19:52　未归；次日补记已交物业']},
  slope_access:{title:'《后勤坡道通行说明》',meta:'旧日常文件',lines:['二层活动室东侧有后勤内梯可下到洗衣房；洗衣房后门外接后勤坡道','坡道宽度可过送衣推车','雨天注意防滑；不得堆放纸箱']},
  identity_observations:{title:'《低龄组生活观察页》',meta:'十九年前 / 当周',lines:[
    '林小满：不喜欢腕上绑东西；换衣后常把袖口卷到手肘',
    '陈雨宁（豆豆）：刚入院，只稳定回应“小名：豆豆”；叫登记名时常不抬头',
    '乔晚宁（乔乔）：能认出同寝室孩子的床位与生活用品，喜欢替老师纠正名单',
    '贺成安（阿成）：左鞋后跟磨偏，走快时会拖一步'
  ]},
  clothing_followup:{title:'《换衣后复核便条》',meta:'十九年前 / 18:52',lines:[
    '新衣不得继续沿用原床位衣物判断身份',
    '腕带完成前，低龄组留在活动室，不得自行回寝室拿东西',
    '对不上者先停在换衣桌旁，查临调床位与生活照护页'
  ]},
  passage_shift:{title:'《后勤通道值班补页》',meta:'十九年前 / 19:20',lines:[
    '后勤内梯可下至洗衣房；洗衣房后门开，坡道无堆物',
    '送衣推车先行清空，儿童从内侧靠墙通过',
    '正门水深继续上涨，不再从门厅转移物资'
  ]},
  gym_receive:{title:'《临时体育馆接收页》',meta:'十九年前 / 19:54',lines:[
    '到场儿童按原组别重新点名；登记名与小名并记',
    '腕带与接收页不一致者不得直接划“已到”',
    '乔晚宁（乔乔）、林小满、陈雨宁（豆豆）、贺成安（阿成）均有第二次核对记录'
  ]},
  teacher_margin:{title:'司徒琴页边短记',meta:'事故后 / 未装订',lines:[
    '乔乔问我“写了吗”',
    '我补写：两条位置底带拿反，已重缝',
    '这行后来没有抄进正式报告'
  ]},
  official_report:{title:'正式事故报告',meta:'事故后 / 打印件',lines:['事由：持续强降雨造成一层进水及南侧楼梯结构隐患','处置：低龄组先行调整位置，工作人员按值班分工转移物资与人员','转移：儿童与工作人员经后勤通道离开旧楼，送往临时体育馆','核对：转移前完成二次核对，登记无误','结果：无人员失踪及伤亡；旧楼后续封闭','打印页脚：第三日下午定稿，附页另存']},
  supp_pan:{title:'司徒琴补记',meta:'事故后第 3 日 / 手写',lines:['18:56 前后，两条临时腕带的位置底带曾拿反','乔乔先提出，小满与豆豆留在桌边重核','姓名布签属于本人，拆线后照临调页重新缝到对应位置','我先以为孩子戴错，后确认是我拿错了两条位置底带']},
  supp_zou:{title:'邹雪梅补记',meta:'事故后第 4 日 / 手写',lines:['湿布签都放一个搪瓷盘，盘底有水','两块字花得厉害，我没有分开压','两条写好位置的底带拿反，姓名布签拆下后重缝']},
  supp_he:{title:'何秋芹末页补写',meta:'事故后一周 / 原值班本',lines:['南楼梯裂响时我停了一下，乔乔叫我','孩子从活动室穿洗衣房去后门','体育馆又核一次，名单齐']},
  activity_roll:{title:'低龄组临时点名纸',meta:'十九年前 / 活动室柜内',lines:['低龄组 12 人，傍晚临时集中活动室','小满：已调折叠床；豆豆：靠门观察','乔乔、阿成：原寝室，晚间仍随低龄组活动','页角有人用铅笔写：“晚饭后再点一次”']},
  borrow_book:{title:'旧借用簿',meta:'旧日常记录 / 活动室',lines:['3 月 11 日　乔乔借蓝蜡笔 2 支，已还','3 月 13 日　小满借儿童剪刀 1 把，老师代还','4 月 2 日　阿成借胶水，盖子丢失','备注：豆豆刚来，不让她自己拿剪刀']},
  thread_ledger:{title:'《针线领用簿》',meta:'旧日常后勤',lines:['红色粗棉线：每月常规领用，用于厚布、床单边、腕带','白线：薄衣修补','黑线：工作服','邹雪梅连续三月备注“厚布好拉，别换细线”']},
  donation_sizes:{title:'捐赠衣物尺码清单',meta:'十九年前 / 当日下午',lines:['110 码上衣 7 件；120 码上衣 8 件；130 码上衣 6 件','长裤尺码混放，未按儿童姓名预分','备注：库存衣只按尺码发放，不代表原持有人']},
  night_misc:{title:'《晚间小事本》',meta:'十九年前 / 事故当日',lines:['17:42　小满又问 04 床什么时候修好；说活动室有人打呼','17:48　豆豆找不到洗漱杯，只肯用黄色那只','17:53　乔乔提醒阿成鞋后跟又开线','18:01　准备晚饭，雨势变大']},
  shift_strip:{title:'《当晚值班时间条》',meta:'十九年前 / 18:30 后',lines:['司徒琴：18:30 起在活动室，负责低龄组清点与临时登记','邹雪梅：洗衣房、后勤库往返，负责干衣与针线','何秋芹：先带低龄组上二层，随后回活动室照看换衣','三人值班时段重叠']},
  back_halfline:{title:'交接页背面的半句话',meta:'十九年前 / 字迹残缺',lines:['……先别让她们回寝室','……查临调页','其余字迹被水泡开，无法确认主语与姓名']},
  alias_board:{title:'《登记名 / 小名对照》',meta:'十九年前 / 值班室',lines:['陈雨宁——小名“豆豆”，新入院','林小满——无常用小名','乔晚宁——平时都叫“乔乔”','贺成安——平时都叫“阿成”']},
  group_note:{title:'《换衣后分组便条》',meta:'十九年前 / 值班室',lines:['低龄组换干衣后先留活动室','临调地点以当日晚间调整页为准，不按原床号','腕带内容若与临调页冲突，先停在换衣桌旁重新核','未核完，不回寝室拿个人物品']},
  desk_log:{title:'值班室桌面简记',meta:'现代 / 清点现场',lines:['电话机无接线；白板已拆','旧搪瓷杯 1，只作值夜用品','圆珠笔 4 支，均已干涸','未发现与事故当晚新增有关的物件']},
  rework_note:{title:'《腕带返工便条》',meta:'十九年前 / 18:58 后',lines:['两条腕带拆线重缝，位置底带按临调页重新对应','旧线不要再用，防止松脱','旁注只有一个“乔”字，不能确认是姓名还是经手简称']},
  needle_box:{title:'针线柜清点页',meta:'十九年前 / 后勤',lines:['粗红棉线 2 卷半；白线 4 卷；黑线 1 卷','大号针 7 枚，小号针 11 枚','剪刀 2 把，事故次日清点均在','无特殊器械']},
  cart_note:{title:'《送衣推车移位条》',meta:'十九年前 / 19:22',lines:['19:22　送衣推车先推至坡道雨棚外','目的：空出洗衣房后门内侧通道','备注：地面太滑，儿童靠墙走']},
  report_flow:{title:'《事故材料装订流转条》',meta:'事故后 / 行政归档',lines:['次日上午：收集值班本、后勤页、门钥匙登记；缺一张洗衣房便条','第 2 日下午：补收体育馆接收页，编号附后','第 3 日上午：形成事故报告正文','第 3 日下午：正文打印、签字，装订一式两份','其后补记：单独归档；正文已定，不再重排','流转末格空白，没有再写经手人']}
};

const defaultState = () => ({
  version:11,started:false,
  unlocked:{prologue:true,lobby:false,activity:false,wardrobe:false,dorm:false,records:false,office:false,laundry:false,stairs:false,supplement:false,rebuild:false,rainnight:false,exit:false},
  unreadLocations:{prologue:false,lobby:false,activity:false,wardrobe:false,dorm:false,records:false,office:false,laundry:false,stairs:false,supplement:false,rebuild:false,rainnight:false,exit:false},
  visitedLocations:['prologue'],
  records:[], puzzles:{}, attempts:{}, hints:{}, puzzleSeenAt:{}, formDrafts:{}, drafts:{}, inspectedP4:[],
  anchors:Object.fromEntries(Object.keys(anchorConfig).map(k=>[k,{state:0,unread:false}])),
  currentLocation:'prologue', returnLocation:null, scrollPositions:{},
  settings:{fontScale:1,reduceMotion:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false},
  startedAt:Date.now(), lastSavedAt:0
});

let state = defaultState();
let lastDialogFocus = null;
let observer = null;
let toastTimer = null;
let recordSearchText = '';

const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>[...root.querySelectorAll(s)];

function loadSettings(){
  try{
    const raw=localStorage.getItem(SETTINGS_KEY)||LEGACY_SETTINGS_KEYS.map(k=>localStorage.getItem(k)).find(Boolean)||'null';
    const saved=JSON.parse(raw); if(saved) Object.assign(state.settings,saved);
  }catch{}
}
function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(state.settings));}
function save(){state.lastSavedAt=Date.now();localStorage.setItem(SAVE_KEY,JSON.stringify(state));updateContinue();}
function normalizeLoadedState(saved){
  const fresh=defaultState();
  const merged={...fresh,...saved,version:11};
  merged.unlocked={...fresh.unlocked,...(saved.unlocked||{})};
  merged.unreadLocations={...fresh.unreadLocations,...(saved.unreadLocations||{})};
  merged.anchors={...fresh.anchors,...(saved.anchors||{})};
  merged.settings={...fresh.settings,...(saved.settings||{})};
  merged.visitedLocations=Array.isArray(saved.visitedLocations)?saved.visitedLocations:['prologue',saved.currentLocation].filter(Boolean);
  merged.formDrafts=saved.formDrafts||{};
  merged.drafts=saved.drafts||{};
  merged.inspectedP4=Array.isArray(saved.inspectedP4)?saved.inspectedP4.filter(x=>['tag','band','thread'].includes(x)):[];
  merged.scrollPositions={...fresh.scrollPositions,...(saved.scrollPositions||{})};
  merged.unlocked.prologue=true;
  merged.unreadLocations.prologue=false;
  return merged;
}
function loadSave(){
  try{
    const raw=localStorage.getItem(SAVE_KEY)||LEGACY_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean); if(!raw) return false;
    const saved=JSON.parse(raw); if(!saved||saved.version!==11) return false;
    state=normalizeLoadedState(saved); loadSettings(); save(); return true;
  }catch{return false;}
}
function clearSave(){localStorage.removeItem(SAVE_KEY);LEGACY_SAVE_KEYS.forEach(k=>localStorage.removeItem(k));state=defaultState();loadSettings();}

function updateContinue(){
  const b=$('#continueBtn'); if(!b) return;
  b.hidden=!(localStorage.getItem(SAVE_KEY)||LEGACY_SAVE_KEYS.some(k=>localStorage.getItem(k)));
}
function applySettings(){
  document.documentElement.style.setProperty('--font-scale', String(state.settings.fontScale||1));
  document.documentElement.classList.toggle('reduce-motion',!!state.settings.reduceMotion);
  $('#fontScaleStart').value=String(state.settings.fontScale||1);
  $('#fontScaleGame').value=String(state.settings.fontScale||1);
  $('#reduceMotionStart').checked=!!state.settings.reduceMotion;
  $('#reduceMotionGame').checked=!!state.settings.reduceMotion;
}
function showToast(msg){
  const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1900);
}

function startGame(fromSave=false){
  if(!fromSave){
    const settings={fontScale:Number($('#fontScaleStart').value),reduceMotion:$('#reduceMotionStart').checked};
    state=defaultState();state.settings=settings;state.started=true;state.startedAt=Date.now();saveSettings();save();
  } else {state.started=true;}
  document.body.classList.add('game-running');
  $('#startScreen').hidden=true;$('#gameShell').hidden=false;applySettings();refreshAll();primeSceneImages(state.currentLocation);
  requestAnimationFrame(()=>{
    restoreSceneScroll(true);
    $('#mainGame').focus({preventScroll:true});
  });
}
function backToTitle(){
  rememberSceneScroll();
  document.body.classList.remove('game-running');
  $('#gameShell').hidden=true;$('#startScreen').hidden=false;updateContinue();window.scrollTo(0,0);
}

function markVisited(loc){
  if(!loc)return;
  state.visitedLocations=Array.isArray(state.visitedLocations)?state.visitedLocations:[];
  if(!state.visitedLocations.includes(loc)){state.visitedLocations.push(loc);save();}
}
function visited(loc){return (state.visitedLocations||[]).includes(loc);}
function primeSceneImages(loc){if(!loc)return;$$('#loc-'+loc+' img[loading="lazy"]').forEach(img=>{img.loading='eager';});}
function unlock(loc){if(!state.unlocked[loc]){state.unlocked[loc]=true;state.unreadLocations=state.unreadLocations||{};state.unreadLocations[loc]=true;save();}primeSceneImages(loc);}
function hasRecords(ids){return ids.every(id=>state.records.includes(id));}
function discoverRecord(id){
  if(!records[id]) return;
  if(!state.records.includes(id)){
    state.records.push(id);
    if(id==='activity_roll' && state.puzzles.p0) unlock('wardrobe');
    save();renderRecordList();renderPuzzles();updateQuestion();renderNav();updateChapterActions();
  }
  openRecord(id);
}
function recordKind(id,r){
  if(['entry_rules','box_labels','desk_log'].includes(id)) return 'modern';
  if(['official_report','report_flow'].includes(id)) return 'official';
  if(['stock_form','wet_clothes','daily_issue','donation_sizes','needle_box','gym_receive','flood_note','lobby_water'].includes(id)) return 'inventory';
  if(['bed_repair','stairs_closed','phone_repair_slip','back_key','slope_access','passage_shift','cart_note'].includes(id)) return 'repair';
  if(id.startsWith('supp_')||['teacher_margin','back_halfline','rework_note'].includes(id)) return 'memo';
  if(id.startsWith('handover_')||['night_misc','borrow_book','shift_strip','temp_bed_partial','temp_bed_full'].includes(id)) return 'notebook';
  if(['activity_misc','canteen_scrap','shoe_box_note','doudou_name','activity_roll','identity_observations','night_care','alias_board'].includes(id)) return 'child';
  if(['cutting_note','group_note','clothing_followup'].includes(id)) return 'label';
  return 'form';
}
function openRecord(id){
  const r=records[id];if(!r)return;
  lastDialogFocus=document.activeElement;
  const paper=$('#recordSheet'); if(paper){paper.dataset.kind=recordKind(id,r);paper.dataset.record=id;paper.classList.toggle('compact',((r.lines||r.body||[]).length<=4));}
  $('#recordMeta').textContent=r.meta||'';$('#recordTitle').textContent=r.title;
  const body=$('#recordBody');body.innerHTML='';
  (r.body||[]).forEach(text=>{const el=document.createElement('p');el.textContent=text;body.appendChild(el);});
  (r.lines||[]).forEach(line=>{
    const el=document.createElement('div');el.className='line';
    const tm=String(line).match(/^(\d{1,2}:\d{2}(?:[—-]\d{1,2}:\d{2})?)\s*[　 ]*(.*)$/);
    const fm=!tm&&String(line).match(/^([^：]{1,12})：\s*(.*)$/);
    if(tm){const t=document.createElement('span');t.className='record-time';t.textContent=tm[1];const v=document.createElement('span');v.className='record-value';v.textContent=tm[2];el.append(t,v);}
    else if(fm){const l=document.createElement('span');l.className='record-label';l.textContent=fm[1];const v=document.createElement('span');v.className='record-value';v.textContent=fm[2];el.append(l,v);}
    else el.textContent=line;
    body.appendChild(el);
  });
  $('#recordDialog').showModal();$('.dialog-close',$('#recordDialog')).focus();
}
function closeDialog(d){d.close(); if(lastDialogFocus?.focus) lastDialogFocus.focus();}

function setAnchorState(id,newState,markUnread=true){
  const a=state.anchors[id]; if(!a||newState<=a.state)return;
  a.state=Math.min(newState,anchorConfig[id].names.length-1);a.unread=markUnread;save();renderAnchors();renderNav();
}
function clearAnchorUnread(id){if(state.anchors[id]?.unread){state.anchors[id].unread=false;save();renderNav();renderAnchors();}}

function renderAnchors(){
  Object.entries(anchorConfig).forEach(([id,cfg])=>{
    const art=document.querySelector(`[data-anchor="${id}"]`);if(!art)return;
    const st=state.anchors[id]||{state:0,unread:false};
    art.classList.toggle('has-new',st.unread);
    const title=$(`[data-anchor-title="${id}"]`);
    if(st.state===0){title.textContent=cfg.names[0];title.classList.remove('renamed');}
    else{
      title.classList.add('renamed');
      title.innerHTML=`<span class="old">${escapeHtml(cfg.names[st.state-1])}</span><span class="new">${escapeHtml(cfg.names[st.state])}</span>`;
    }
    const body=$(`[data-anchor-body="${id}"]`);
    const existing=body.querySelectorAll('.anchor-added');existing.forEach(n=>n.remove());
    for(let i=1;i<=st.state;i++){
      if(cfg.additions[i]){const p=document.createElement('p');p.className='anchor-added';p.textContent=cfg.additions[i];body.appendChild(p);}
    }
  });
}
function renderNav(){
  const nav=$('#anchorNav');nav.innerHTML='';
  locations.forEach(([id,name])=>{
    if(!state.unlocked[id])return;
    const group=document.createElement('div');group.className='anchor-group';
    const b=document.createElement('button');b.textContent=name;b.dataset.target='loc-'+id;
    if(id===state.currentLocation)b.classList.add('current');
    if(state.unreadLocations?.[id])b.classList.add('unread-location');
    b.addEventListener('click',()=>jumpTo('loc-'+id,false));group.appendChild(b);
    const local=Object.entries(anchorConfig).filter(([,c])=>c.location===id);
    if(local.length){const ul=document.createElement('ul');ul.className='local-nav';local.forEach(([aid,cfg])=>{
      const li=document.createElement('li');const ab=document.createElement('button');const st=state.anchors[aid];ab.textContent=cfg.names[st.state];ab.dataset.unread=String(!!st.unread);ab.dataset.state=st.state===cfg.names.length-1?'settled':'open';ab.addEventListener('click',()=>jumpTo('anchor-'+aid,true,aid));li.appendChild(ab);ul.appendChild(li);
    });group.appendChild(ul);}
    nav.appendChild(group);
  });
}
function activeScene(){return document.querySelector('.story-section.active-scene');}
function rememberSceneScroll(){
  const scene=activeScene();
  if(!scene||!state.currentLocation)return;
  state.scrollPositions=state.scrollPositions||{};
  state.scrollPositions[state.currentLocation]=scene.scrollTop;
}
function restoreSceneScroll(forceTop=false){
  const scene=activeScene(); if(!scene)return;
  const top=forceTop?0:Number(state.scrollPositions?.[state.currentLocation]||0);
  scene.scrollTo({top,behavior:'auto'});
}
function scrollWithinScene(target,behavior='auto'){
  const scene=target?.closest('.story-section')||activeScene(); if(!scene||!target)return;
  const sceneRect=scene.getBoundingClientRect();
  const targetRect=target.getBoundingClientRect();
  const top=scene.scrollTop+(targetRect.top-sceneRect.top)-20;
  scene.scrollTo({top:Math.max(0,top),behavior});
}
function jumpTo(targetId,isRevisit=false,anchorId=null){
  const initial=document.getElementById(targetId);if(!initial)return;
  const current=state.currentLocation;
  const locId=initial.matches('.story-section')?initial.dataset.location:initial.closest('.story-section')?.dataset.location;
  if(!locId)return;
  if(isRevisit && current && locId!==current){state.returnLocation=current;$('#returnBtn').hidden=false;}
  if(current!==locId) rememberSceneScroll();
  markVisited(locId);
  state.currentLocation=locId;
  state.unreadLocations=state.unreadLocations||{};
  state.unreadLocations[locId]=false;
  $('#saveLabel').textContent=locations.find(x=>x[0]===locId)?.[1]||locId;
  if(anchorId) clearAnchorUnread(anchorId);
  save();
  renderSections();renderNav();updateQuestion();
  requestAnimationFrame(()=>{
    const target=document.getElementById(targetId);
    const behavior=state.settings.reduceMotion?'auto':'smooth';
    if(targetId==='loc-'+locId) restoreSceneScroll(false);
    else scrollWithinScene(target,behavior);
    setTimeout(()=>{
      const h=target?.matches('.story-section')?$('h2',target):$('h3',target);
      if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}
    },state.settings.reduceMotion?0:280);
  });
  closeMobileDrawers();
}
function renderSections(){
  let current=state.currentLocation;
  if(!state.unlocked[current]) current=locations.find(([id])=>state.unlocked[id])?.[0]||'lobby';
  state.currentLocation=current;
  document.body.dataset.scene=current;
  $$('.story-section').forEach(sec=>{
    const id=sec.dataset.location;
    sec.hidden=!state.unlocked[id]||id!==current;
    sec.classList.toggle('active-scene',id===current);
  });
  $('#returnBtn').hidden=!state.returnLocation;
}
function recordGroup(id,r){
  const meta=r?.meta||'';
  if(meta.includes('现代')) return '今晚清点';
  if(meta.includes('事故后')||id==='official_report'||id==='report_flow'||id.startsWith('supp_')||id==='teacher_margin') return '事故后材料';
  if(meta.includes('日常')||meta.includes('生活杂项')||['activity_misc','canteen_scrap','shoe_box_note','borrow_book','thread_ledger','donation_sizes','phone_repair_slip'].includes(id)) return '旧日常记录';
  return '事故当晚';
}
function renderRecordList(){
  const root=$('#recordList');root.innerHTML='';
  const query=recordSearchText.trim().toLocaleLowerCase('zh-CN');
  const available=state.records.filter(id=>!!records[id]);
  const filtered=available.filter(id=>{
    if(!query)return true;
    const r=records[id];
    return [r.title,r.meta,...(r.body||[]),...(r.lines||[])].join(' ').toLocaleLowerCase('zh-CN').includes(query);
  });
  const count=$('#recordCount');if(count)count.textContent=query?`找到 ${filtered.length} 份，共已收 ${available.length} 份`:`已收 ${available.length} 份`;
  $('#clearRecordSearch').hidden=!query;
  if(!available.length){const p=document.createElement('p');p.className='empty';p.textContent='翻过的纸会按来源留在这里；需要时可以重新打开。';root.appendChild(p);return;}
  if(!filtered.length){const p=document.createElement('p');p.className='empty';p.textContent='没有找到相符的纸，换个词试试。';root.appendChild(p);return;}
  const order=['今晚清点','事故当晚','事故后材料','旧日常记录'];
  const groups=Object.fromEntries(order.map(x=>[x,[]]));
  filtered.forEach(id=>groups[recordGroup(id,records[id])].push(id));
  order.forEach(group=>{
    if(!groups[group].length)return;
    const h=document.createElement('h3');h.className='record-group-title';h.textContent=group;root.appendChild(h);
    [...groups[group]].reverse().forEach(id=>{
      const r=records[id];const b=document.createElement('button');b.type='button';
      const title=document.createElement('strong');title.textContent=r.title;
      const meta=document.createElement('span');meta.textContent=r.meta||'';
      b.append(title,meta);b.addEventListener('click',()=>openRecord(id));root.appendChild(b);
    });
  });
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function puzzleStatus(id){return state.puzzles[id]||null;}
function markPuzzleSeen(id){if(!state.puzzleSeenAt[id]){state.puzzleSeenAt[id]=Date.now();save();}}
function attempts(id){return state.attempts[id]||0;}
function failPuzzle(id,msg,explicit=''){
  state.attempts[id]=(state.attempts[id]||0)+1;save();
  return attempts(id)>=3&&explicit?`${msg} ${explicit}`:msg;
}
function solvePuzzle(id,skipped=false){
  if(state.puzzles[id]) return;
  state.puzzles[id]=skipped?'skipped':'solved';
  if(state.formDrafts) delete state.formDrafts[id];
  save();
  if(id==='p0'){
    unlock('activity');showToast('门厅这批已经登记，活动室可以继续清点');
  }
  if(id==='p1'){
    setAnchorState('cloth_tags',1,true);unlock('dorm');showToast('几张纸的先后关系已经接上');
  }
  if(id==='p2'){
    setAnchorState('temp_place',1,true);setAnchorState('empty_bed',1,true);unlock('records');showToast('床号与临时位置已经分开');
  }
  if(id==='p3'){
    setAnchorState('papers',1,true);unlock('office');showToast('三份交接能落进同一晚');
  }
  if(id==='p3b'){
    unlock('laundry');showToast('腕带的冲突已经落到位置栏');
  }
  if(id==='p4'){
    setAnchorState('cloth_tags',2,true);setAnchorState('laundry_table',2,true);setAnchorState('two_children',1,true);setAnchorState('empty_bed',2,true);unlock('stairs');
  }
  if(id==='p5'){
    setAnchorState('backdoor',2,true);unlock('supplement');
  }
  if(id==='p6'){
    setAnchorState('papers',2,true);unlock('rebuild');
  }
  if(id==='p7'){
    showToast('那五张纸终于各有了出处');
  }
  if(id==='p8'){
    setAnchorState('temp_place',2,false);unlock('rainnight');showToast('四段时间已经核准，认不出的字仍留空');
  }
  refreshAll();
}

const puzzleMeta = {
  p0:{title:'门厅登记',question:'',requires:['entry_rules','box_labels'],solved:'门厅这批材料已经按原标签登记，三只箱子推到了干燥处。'},
  p1:{submitLabel:'核准这条时间线',hintLabel:'看一眼页边时间',title:'一条布签的去向',question:'把四张纸按发生先后排好，再判断旧衣上的姓名布签最终去了哪里。',requires:['flood_note','stock_form','wet_clothes','cutting_note'],hints:['先核对纸上记下的时间，注意进水的时间范围。','进水记录从 18:12 开始；领用 18:34，收拢湿衣 18:37，剪下布签 18:41。','旧衣姓名布签剪下后不是废弃，而是缝到写好临时位置的底带上。'],solved:'18:34 开始领干衣，18:37 收拢湿衣，18:41 才剪下旧衣上的姓名布签；布签离开衣物，不等于孩子的身份被改动。',next:['dorm','带上这几张纸，去二层寝室']},
  p2:{submitLabel:'把位置写回去',hintLabel:'再查一张床位记录',title:'床号和实际位置',question:'按当晚临调和照护页，把四名孩子放回实际待过的位置。空着的床不自动代表少了一个人。',requires:['bed_repair','night_care','daily_issue','temp_bed_full','night_misc'],hints:['先处理“04 床停用”，不要按空床数量猜。','《晚间小事本》和临调页都写到小满已经睡活动室。','小满→活动室折叠床；豆豆→靠门观察位；乔乔、阿成仍对应二层原寝室。'],solved:'04 床当天上午已经停用；小满在折叠床，豆豆在靠门观察位，乔乔和阿成仍在原寝室。',next:['records','把床位页夹好，去记录柜']},
  p3:{submitLabel:'按这个顺序压好',hintLabel:'找一条不能颠倒的关系',title:'三份交接的先后',question:'三份交接没有把每一分钟都写全。只排那些无法颠倒的动作，看看它们能不能来自同一晚。',requires:['handover_pan','handover_zou','handover_he','shift_strip'],hints:['先抓“换衣、剪布签、缝腕带、发现问题”四个必然有先后的动作。','腕带必须先缝好，才可能被发现对应有误；南楼梯停用又发生在返工以后。','上楼→换衣→剪布签→缝腕带→发现对应有误→封南楼梯。'],solved:'三份交接的写法不同，前后却能落进同一轮换衣、缝带和返工。',next:['office','把三份交接夹在一起，去值班室']},
  p3b:{submitLabel:'留下能同时成立的两句',hintLabel:'先核一次称呼',title:'腕带哪里出了错',question:'四句话里只能留下两句；留下的内容必须能被登记名、临调页和两条腕带同时支持。',requires:['alias_board','group_note','wristband_a','wristband_b','temp_bed_full'],hints:['先确认“豆豆”是不是陈雨宁，再比较两条位置底带。','姓名能对应本人；冲突出在“折叠床 / 靠门观察位”的对应关系。','应留下“姓名都能对应本人”和“两条位置底带与临调页正好颠倒”。'],solved:'陈雨宁就是豆豆；两条腕带的姓名布签属于本人，拿反的是写着临时位置的底带。',next:['laundry','把两条抄记带去洗衣房']},
  p4:{submitLabel:'记下红线的来历',hintLabel:'从工作台上找旧线的用途',title:'红线为什么留在桌上',question:'网上的照片只拍到了红线。翻看桌上留下的三个位置，再根据针线领用、返工便条和腕带抄记判断这截红线的来历。',requires:['wristband_a','wristband_b','rework_note','thread_ledger','needle_box'],hints:['线是什么用途，先看针线柜和长期领用页。','注意底带预写的位置，以及后来被剪断的针脚。','红线是常用的缝厚布材料；那晚拆开缝错的腕带，剪断的旧线留在工作台。'],solved:'红线本是洗衣房常备的粗棉线。错配腕带拆线重缝时，剪断的旧线被留在工作台；被拍成怪谈的，是返工留下的痕迹。',next:['stairs','收好针线记录，去南楼梯']},
  p5:{submitLabel:'圈出还能走的线',hintLabel:'再看一个出口条件',title:'19:16 以后还能往哪走',question:'南楼梯停用、门厅积水以后，从二层活动室出发，哪条后勤线还能连续接到楼外？',requires:['stairs_closed','lobby_water','back_key','slope_access','passage_shift','cart_note'],hints:['先排除已经停用或不适合推车的方向。','南楼梯不能走；正门也不适合推车；活动室东侧另有后勤内梯。','活动室→后勤内梯→洗衣房→后门坡道。'],solved:'19:16 以后，能连续通行的是活动室东侧后勤内梯、洗衣房和后门坡道。',next:['supplement','沿记录里的出口，回去看事故补记']},
  p6:{submitLabel:'核对这三处差别',hintLabel:'再核一次原页',title:'报告写对了什么，漏掉了什么',question:'正式报告写了转移结果，却没有重现桌边的全部经过。对照当晚交接、事故后补记和体育馆接收页，分清“可以确认”“没有写”和“不能推断”。',requires:['official_report','supp_pan','supp_zou','supp_he','report_flow','gym_receive','handover_zou'],hints:['先看当晚交接有没有留下“拿反、拆线”这一步，再核事故后的书面说明。','“二次核对无误”描述最后结果，不代表前面没有出现失误；体育馆接收页还能核对到场情况。','能够同时支持返工的是当晚交接和事后补记；正式报告省去了过程，体育馆页确认四名孩子到场。'],solved:'当晚的交接记下了位置底带拿反，事后补记补全了拆线经过；正式报告的“核对无误”并非假话，但省去了错误如何被发现和纠正。体育馆再次点名，未显示有人缺席。',next:['rebuild','带着几份有分歧的纸，回到桌边']},
  p7:{submitLabel:'把五处出处压好',hintLabel:'翻开纸夹细看',title:'被截断的五张照片',question:'网上的照片只留下一半画面。五摞纸中各有两份原始记录；亲自翻过日期和内容，再把传言放回真正发生过的现场。',requires:[],hints:['找两种能相互补充的原始记录，不要只根据传言中的名词挑选。','旧日常的用料簿能解释线的用途；当天上午的修理单能解释空床。','甲是楼梯与积水，乙是粗线与返工，丙是床架与调床，丁是后门与坡道，戊是交接与临调。'],solved:'五段传言都可以接回纸面上的场景：普通材料、临时留人、床架停用、结构封闭与后勤撤离。没有哪一份原页能支持“有人被带走或失踪”的说法。'},
  p8:{submitLabel:'核准最后一页',hintLabel:'沿着原始时间往下看',title:'给四段时间找到起点',question:'把四段经过接回纸上的时间。之后还有一处只留下半个字的缺口：没有足够证据时，哪一格应当保持空白？',requires:[],hints:['18:12 看水位和人员上楼；18:34 是换衣物资领用。','18:56 有孩子提出腕带不对；19:16 是改变撤离路线的时刻。','报告漏写的返工可以通过交接补上；但便条边缘那个“乔”字，无法判定是谁写下的。'],solved:'18:12 进水、18:34 换衣、18:56 发现位置错配、19:16 南楼梯停用。返工过程已有多份材料支持；便条上那个孤零零的“乔”字，仍无法确认写字的人。',next:['rainnight','合上纸夹，读一遍那一晚']}
};

function missingRecords(meta){return (meta.requires||[]).filter(id=>!state.records.includes(id));}
function puzzleShell(id,inner){
  const m=puzzleMeta[id];markPuzzleSeen(id);
  const hintLevel=state.hints[id]||0;const hint=hintLevel?`<div class="hint-box">旁注：${escapeHtml(m.hints[hintLevel-1])}</div>`:'';
  return `<div class="puzzle puzzle-${id}" data-puzzle="${id}"><h3>${escapeHtml(m.title)}</h3><p class="question">${escapeHtml(m.question)}</p>${inner}<div class="puzzle-actions"><button class="submit" data-action="submit" data-puzzle="${id}">${escapeHtml(m.submitLabel||'写下判断')}</button><button class="hint-btn" data-action="hint" data-puzzle="${id}" ${(attempts(id)>0||hintLevel>0)?'':'hidden'}>${escapeHtml(m.hintLabel||'看一眼旁注')}</button></div><div class="feedback" role="status" tabindex="-1" hidden></div>${hint}</div>`;
}
function solvedHtml(id){
  const m=puzzleMeta[id];
  if(id==='p0') return `<div class="scene-transition settled"><p>${escapeHtml(m.solved)}</p></div>`;
  const next=m.next?`<button type="button" class="chapter-forward" data-next-location="${escapeHtml(m.next[0])}">${escapeHtml(m.next[1])}</button>`:'';
  return `<div class="puzzle solved puzzle-${id}"><h3>${escapeHtml(m.title)}</h3><div class="feedback success">${escapeHtml(m.solved||'几张纸的前后关系已经能互相印证')}</div>${next}</div>`;
}

function renderPuzzles(){
  for(const id of Object.keys(puzzleMeta)){
    const slot=$('#puzzle-'+id);if(!slot)continue;
    if(puzzleStatus(id)){slot.innerHTML=solvedHtml(id);continue;}
    if(id==='p0'){
      const ready=hasRecords(['entry_rules','box_labels']);
      slot.innerHTML=ready?`<div class="scene-transition"><p>登记说明和三只箱签都核过了。门厅这批只需要照原标签收好，不再额外编一套分类。</p><button type="button" class="chapter-forward" data-action="lobby-continue">把三箱推到墙边，去活动室</button></div>`:'';
      continue;
    }
    if(id==='p3b' && !state.puzzles.p3){slot.innerHTML='';continue;}
    if(id==='p4' && !state.puzzles.p3b){slot.innerHTML='';continue;}
    if(id==='p5' && !state.puzzles.p4){slot.innerHTML='';continue;}
    if(id==='p6' && !state.puzzles.p5){slot.innerHTML='';continue;}
    if(id==='p7' && !state.puzzles.p6){slot.innerHTML='';continue;}
    if(id==='p8' && !state.puzzles.p7){slot.innerHTML='';continue;}
    const miss=missingRecords(puzzleMeta[id]);if(miss.length){slot.innerHTML='';continue;}
    slot.innerHTML=({p1:renderP1,p2:renderP2,p3:renderP3,p3b:renderP3b,p4:renderP4,p5:renderP5,p6:renderP6,p7:renderP7,p8:renderP8}[id])();
  }
  Object.keys(puzzleMeta).forEach(id=>{const slot=$('#puzzle-'+id);if(slot&&!state.puzzles[id])restorePuzzleDraft(id,slot);});
  bindPuzzleEvents();
  updateChapterActions();
}
function select(name,opts,prompt='请选择'){
  return `<div class="choice-line" data-choice="${escapeHtml(name)}" role="group" aria-label="${escapeHtml(prompt)}"><input type="hidden" name="${escapeHtml(name)}" value=""><span class="choice-prompt">${escapeHtml(prompt)}：</span>${opts.map(o=>`<button type="button" class="choice-option" data-value="${escapeHtml(o[0])}" aria-pressed="false">${escapeHtml(o[1])}</button>`).join('')}</div>`;
}
function renderP0(){return '';}
function renderP1(){
  const labels={wet:'《湿衣收拢表》18:37',flood:'《一层进水简记》18:12—18:27',cut:'《后勤剪裁条》18:41',stock:'《库存衣物领用单》18:34'};
  const order=state.drafts?.p1Order||['wet','cut','flood','stock'];
  const opts=[['identity','旧衣的姓名布签转缝到写有临时位置的腕带底带'],['discard','旧衣一收走，姓名布签便一起作废'],['rename','临时调床后，每个孩子都重新改登记姓名']];
  return puzzleShell('p1',`<p class="small puzzle-note">先排四张纸的时间，再判断旧布签是否被保留使用。</p><ol class="order-list" data-order-list data-order-id="p1">${order.map((x,i)=>`<li class="order-item" data-value="${x}"><span>${i+1}. ${labels[x]}</span><span class="order-controls"><button type="button" data-move="up" aria-label="${labels[x]} 上移">↑</button><button type="button" data-move="down" aria-label="${labels[x]} 下移">↓</button></span></li>`).join('')}</ol><div class="puzzle-row"><label>剪下的布签后来如何使用？</label>${select('tag_role',opts,'从领用单和剪裁条判断')}</div>`);
}
function renderP2(){
  const opts=[['dorm','二层原寝室'],['fold','活动室折叠床'],['door','活动室靠门观察位']];
  return puzzleShell('p2',`<div class="puzzle-grid">${[['xm','小满 / 林小满'],['dd','豆豆 / 陈雨宁'],['qq','乔乔 / 乔晚宁'],['ac','阿成 / 贺成安']].map(r=>`<div class="puzzle-row"><label>${r[1]}</label>${select(r[0],opts)}</div>`).join('')}</div>`);
}
function renderP3(){
  const initial=['上楼','换衣','剪布签','缝腕带','发现错配','封南楼梯'];
  const shuffled=['换衣','上楼','缝腕带','剪布签','封南楼梯','发现错配'];
  const arr=(state.drafts?.p3Order)||shuffled;
  return puzzleShell('p3',`<ol class="order-list" data-order-list data-order-id="p3">${arr.map((x,i)=>`<li class="order-item" data-value="${x}"><span>${i+1}. ${x}</span><span class="order-controls"><button type="button" data-move="up" aria-label="${x} 上移">↑</button><button type="button" data-move="down" aria-label="${x} 下移">↓</button></span></li>`).join('')}</ol><p class="small">纸边只排能确认的先后，不补原纸里没有的分钟数。</p>`);
}
function renderP3b(){
  const statements=[
    ['s1','“豆豆”和“陈雨宁”是两个孩子'],
    ['s2','两条腕带上的姓名布签都能对应本人'],
    ['s3','林小满当晚应在靠门观察位'],
    ['s4','两条腕带把“折叠床 / 靠门观察位”的对应颠倒了']
  ];
  return puzzleShell('p3b',`<div class="evidence-lines">${statements.map(x=>`<label class="evidence-check"><input type="checkbox" name="${x[0]}"> <span>${x[1]}</span></label>`).join('')}</div><p class="small">纸边只留两处勾记；留下的两句必须能被已经读过的记录同时支持。</p>`);
}
function renderP4(){
  const inspected=state.inspectedP4||[];
  const objects=[
    ['tag','布签的反面','旧针脚穿过布边，字迹仍是孩子原来的姓名。'],
    ['band','位置底带','“折叠床”和“靠门观察位”的字压在新针脚下面，比这次缝合更早。'],
    ['thread','桌边的线头','几小段红线是剪开的旧针脚，和针线柜里常用的粗线同色。']
  ];
  const rows=objects.map(o=>`<div class="workbench-object"><button type="button" data-inspect="${o[0]}" data-label="${o[1]}" aria-expanded="${inspected.includes(o[0])}">${o[1]}　${inspected.includes(o[0])?'收起':'翻看'}</button><p ${inspected.includes(o[0])?'':'hidden'}>${o[2]}</p></div>`).join('');
  const opts=[['cloth','衣物按尺码重新发放，留下剪线'],['repair','位置腕带拆线重缝，旧线剪断留在桌上'],['symbol','工作人员特意用红线标出两名孩子'],['names','把两个孩子的登记名字互相替换']];
  return puzzleShell('p4',`<div class="workbench" aria-label="旧工作台上的三处痕迹">${rows}</div><div class="puzzle-row workbench-conclusion"><label>这些线头最可能是哪一步留下的？</label>${select('thread_origin',opts,'结合已找到的三处痕迹')}</div><p class="small">先翻看三处，才能把判断写进清点记录。</p>`);
}
function renderP5(){
  const opts1=[['lobby','门厅'],['laundry','洗衣房'],['stairs','南楼梯']];
  const opts2=[['front','正门'],['back','后门坡道'],['dorm','二层寝室']];
  return puzzleShell('p5',`<div class="route-path">起点：活动室 → <span data-route-one>？</span> → <span data-route-two>？</span></div><div class="puzzle-grid"><div class="puzzle-row"><label>下一处</label>${select('step1',opts1)}</div><div class="puzzle-row"><label>再下一处</label>${select('step2',opts2)}</div></div>`);
}
function renderP6(){
  const evidence=`<div class="cross-check-ledger" aria-label="报告和交接的三处核对">
    <div><span>当晚交接</span><p>“两条位置底带拿反，已拆线重缝。”</p></div>
    <div><span>正式报告</span><p>“转移前完成二次核对，登记无误。”</p></div>
    <div><span>体育馆接收</span><p>四名孩子均有第二次核对记录。</p></div>
  </div>`;
  const fields=[
    ['proof','如果要证明“当晚确有返工”，哪组材料能互相补充？',[
      ['contemporary','当晚交接与事故后补记'],
      ['report','正式报告与门厅箱签'],
      ['phone','旧电话报修条与后门钥匙登记']]],
    ['report_meaning','如何理解正式报告里的“二次核对无误”？',[
      ['denial','它足以证明腕带从未缝错'],
      ['omission','它记录了最终结果，却略过纠错过程'],
      ['fabricated','它与所有原页正面冲突，不能采信']]],
    ['arrival','“两名儿童被留下”是否意味着撤离时少了两人？',[
      ['missing','是，腕带曾写错就代表有人失踪'],
      ['arrived','不是，体育馆接收页有重新点名记录'],
      ['unknown','所有接收页均无记录，无法判断']]]
  ];
  return puzzleShell('p6',evidence+`<div class="inference-grid">${fields.map(([id,question,opts],i)=>`<div class="inference-step"><span class="step-count">0${i+1}</span><h4>${question}</h4>${select(id,opts,'留下与原页相符的判断')}</div>`).join('')}</div>`);
}
function renderP7(){
  // Each folder opens the actual recovered record, not a duplicated answer transcript.
  const dossiers=[
    ['a','甲组','19:12—19:16',['stairs_closed','lobby_water']],
    ['b','乙组','旧日常 / 当晚返工',['thread_ledger','rework_note']],
    ['c','丙组','当日上午 / 17:50',['bed_repair','temp_bed_full']],
    ['d','丁组','19:18 / 后勤通行',['back_key','slope_access']],
    ['e','戊组','临时登记 / 换衣桌',['handover_pan','group_note']]
  ];
  const dossierHtml=`<div class="dossier-board" aria-label="五摞可以翻开的原始材料">${dossiers.map(([id,title,meta,recordIds])=>`<details class="dossier-sheet"><summary><strong>${title}</strong><span>${meta}</span><small>翻开这一摞</small></summary><p class="folder-intro">两份不同经手的纸被夹在一起；先看日期与记录原文，再决定它们能说明什么。</p><div class="folder-records">${recordIds.map(rid=>`<button type="button" data-open-record="${rid}">${escapeHtml(records[rid].title)}</button>`).join('')}</div></details>`).join('')}</div>`;
  const opts=[['a','甲组'],['b','乙组'],['c','丙组'],['d','丁组'],['e','戊组']];
  const fragments=[
    ['g1','“红线缠在孩子腕上”'],['g2','“两个孩子被单独留下”'],['g3','“04 床空着”'],['g4','“南楼梯后来封死”'],['g5','“夜里有人打开后门”']
  ];
  return puzzleShell('p7',dossierHtml+`<div class="source-pairs">${fragments.map((x,i)=>`<div class="source-pair"><span class="fragment-index">0${i+1}</span><strong>${x[1]}</strong>${select(x[0],opts,'对应哪一组原页')}</div>`).join('')}</div>`);
}

function renderP8(){
  const scenes=[
    {key:'water',time:'18:12',title:'进水',opts:[['flood','门厅开始进水，低龄组随后往楼上移'],['clothes','拿库存干衣并剪下旧衣上的布签'],['redo','有人发现位置带缝错'],['south','楼梯裂响，原路线停用']]},
    {key:'change',time:'18:34',title:'换衣',opts:[['flood','旧河道水位上涨'],['clothes','领出库存干衣，湿衣和布签随后分开'],['redo','把底带拆线重缝'],['south','改走后门坡道']]},
    {key:'check',time:'18:56',title:'重核',opts:[['flood','门厅用毛巾挡水'],['clothes','开始剪湿衣姓名布签'],['redo','乔乔发现位置写反，两人留下重缝'],['south','体育馆重新点名']]},
    {key:'move',time:'19:16',title:'转移',opts:[['flood','河道排水口回流'],['clothes','后勤领出干衣'],['redo','缝好第一批腕带'],['south','南楼梯停用，改找后勤出口']]}];
  const optionsMissing=[['blank','进水从哪一分钟开始'],['signature','返工便条边缘“乔”字是谁写下的'],['key','四名孩子是否在体育馆重新点名']];
  return puzzleShell('p8',`<div class="timeline-rebuild" aria-label="四段事故时间"><div class="timeline-tracks">${scenes.map(s=>`<div class="timeline-track"><div class="timeline-stamp"><span>${s.time}</span><strong>${s.title}</strong></div>${select(s.key,s.opts,'这一段从哪件事开始')}</div>`).join('')}</div><div class="timeline-gap"><strong>哪一格目前无法确定，必须留空？</strong>${select('omission',optionsMissing,'需要在清点记录中注明的缺口')}</div></div>`);
}

function capturePuzzleDraft(id,root){
  if(!id||!root)return;
  state.formDrafts=state.formDrafts||{};
  const draft={};
  $$('input[name],select[name]',root).forEach(el=>{draft[el.name]=el.type==='checkbox'?!!el.checked:el.value;});
  state.formDrafts[id]=draft;save();
}
function restorePuzzleDraft(id,root){
  const draft=state.formDrafts?.[id];if(!draft||!root)return;
  Object.entries(draft).forEach(([name,value])=>{
    const el=root.querySelector(`[name="${CSS.escape(name)}"]`);if(!el)return;
    if(el.type==='checkbox')el.checked=!!value;else el.value=String(value??'');
    const group=el.closest?.('[data-choice]')||root.querySelector(`[data-choice="${CSS.escape(name)}"]`);
    if(group)$$('.choice-option',group).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.value===String(value))));
  });
}
function bindPuzzleEvents(){
  $$('[data-action="lobby-continue"]').forEach(b=>b.onclick=()=>{solvePuzzle('p0',false);requestAnimationFrame(()=>jumpTo('loc-activity',false));});
  $$('[data-next-location]').forEach(b=>b.onclick=()=>jumpTo('loc-'+b.dataset.nextLocation,false));
  $$('[data-action="hint"]').forEach(b=>b.onclick=()=>showHint(b.dataset.puzzle,b.closest('.puzzle')));
  $$('[data-open-record]').forEach(b=>b.onclick=()=>openRecord(b.dataset.openRecord));
  $$('[data-action="submit"]').forEach(b=>b.onclick=()=>{capturePuzzleDraft(b.dataset.puzzle,b.closest('.puzzle'));submitPuzzle(b.dataset.puzzle,b.closest('.puzzle'));});
  $$('.order-controls button').forEach(b=>b.onclick=()=>moveOrderItem(b));
  $$('[data-inspect]').forEach(b=>b.onclick=()=>{const key=b.dataset.inspect;state.inspectedP4=state.inspectedP4||[];if(!state.inspectedP4.includes(key)){state.inspectedP4.push(key);save();}const detail=b.nextElementSibling;detail.hidden=!detail.hidden;b.setAttribute('aria-expanded',String(!detail.hidden));b.textContent=b.dataset.label+'　'+(detail.hidden?'翻看':'收起');});
  $$('.choice-option').forEach(b=>b.onclick=()=>{
    const group=b.closest('[data-choice]');const hidden=$('input[type="hidden"]',group);hidden.value=b.dataset.value;
    $$('.choice-option',group).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const puzzle=b.closest('.puzzle');capturePuzzleDraft(puzzle?.dataset.puzzle,puzzle);
  });
  $$('.evidence-check input').forEach(i=>i.onchange=()=>{const puzzle=i.closest('.puzzle');capturePuzzleDraft(puzzle?.dataset.puzzle,puzzle);});
}
function showHint(id,root){capturePuzzleDraft(id,root);state.hints[id]=Math.min(3,(state.hints[id]||0)+1);save();renderPuzzles();const slot=$('#puzzle-'+id);scrollWithinScene(slot,state.settings.reduceMotion?'auto':'smooth');}
function getVals(root,names){const o={};names.forEach(n=>o[n]=root.querySelector(`[name="${n}"]`)?.value||'');return o;}
function feedback(root,msg,type='error'){const f=$('.feedback',root);f.hidden=false;f.textContent=msg;f.className='feedback '+type;f.setAttribute('tabindex','-1');f.focus({preventScroll:true});}
function submitPuzzle(id,root){
  let ok=false,msg='';
  if(id==='p1'){
    const seq=$$('[data-order-id="p1"] .order-item',root).map(el=>el.dataset.value);
    const tag=getVals(root,['tag_role']).tag_role;
    ok=seq.join(',')==='flood,stock,wet,cut'&&tag==='identity';
    if(!ok)msg=failPuzzle(id,'时间先后或布签用途还没有接上；核对领用、收拢和剪裁的顺序。','进水在前，随后领干衣、收拢湿衣、剪取布签；原姓名布签之后被缝到位置底带上。');
  }
  if(id==='p2'){
    const v=getVals(root,['xm','dd','qq','ac']);
    ok=v.xm==='fold'&&v.dd==='door'&&v.qq==='dorm'&&v.ac==='dorm';
    if(!ok)msg=failPuzzle(id,'至少一个位置与照护页对不上；04 床当天上午已经停用。','小满在活动室折叠床，豆豆在靠门观察位，乔乔和阿成仍在二层原寝室。');
  }
  if(id==='p3'){
    const arr=$$('[data-order-list] .order-item',root).map(n=>n.dataset.value);const pos=x=>arr.indexOf(x);
    ok=pos('上楼')<pos('换衣')&&pos('换衣')<pos('剪布签')&&pos('剪布签')<pos('缝腕带')&&pos('缝腕带')<pos('发现错配')&&pos('发现错配')<pos('封南楼梯');
    if(!ok)msg=failPuzzle(id,'这里有一条先后关系放反了；先检查“腕带缝好以后才可能被发现对应有误”。','必要顺序是上楼→换衣→剪布签→缝腕带→发现对应有误→封南楼梯。');
  }
  if(id==='p3b'){
    const vals=['s1','s2','s3','s4'].filter(n=>root.querySelector(`[name="${n}"]`)?.checked);
    ok=vals.length===2&&vals.includes('s2')&&vals.includes('s4');
    if(!ok)msg=failPuzzle(id,'这四句话不能同时成立；先把“豆豆 / 陈雨宁”和两条位置底带分开看。','应留下“姓名布签能对应本人”和“折叠床 / 靠门观察位被颠倒”两句。');
  }
  if(id==='p4'){
    const inspected=state.inspectedP4||[];
    ok=['tag','band','thread'].every(x=>inspected.includes(x))&&getVals(root,['thread_origin']).thread_origin==='repair';
    if(!ok)msg=failPuzzle(id,'先把桌边三处痕迹翻看完整，再对照针线领用和返工便条。','桌边剪断的旧线来自腕带拆线重缝，而不是用于标记儿童的特殊符号。');
  }
  if(id==='p5'){
    const v=getVals(root,['step1','step2']);
    ok=v.step1==='laundry'&&v.step2==='back';
    if(!ok)msg=failPuzzle(id,'这条路在 19:16 以后不能连续通行。','从活动室经后勤内梯到洗衣房，再从后门坡道离开。');
  }
  if(id==='p6'){
    const v=getVals(root,['proof','report_meaning','arrival']);
    ok=v.proof==='contemporary'&&v.report_meaning==='omission'&&v.arrival==='arrived';
    if(!ok)msg=failPuzzle(id,'这三处需要不同的证据：返工的经过、报告说法的边界，以及到场人数。','当晚交接与补记相互印证返工；正式报告只写最终核对结果；体育馆接收页有到场复核。');
  }
  if(id==='p7'){
    const v=getVals(root,['g1','g2','g3','g4','g5']);
    const ans={g1:'b',g2:'e',g3:'c',g4:'a',g5:'d'};
    ok=Object.keys(ans).every(k=>v[k]===ans[k]) && new Set(Object.values(v)).size===5;
    if(!ok)msg=failPuzzle(id,'五段传言还没有找到各自的原页，或有两张照片被压到同一摞纸上。','先逐摞展开摘记；线头看旧簿与返工，空床看维修与调床，离开方向看钥匙与坡道。');
  }
  if(id==='p8'){
    const v=getVals(root,['water','change','check','move','omission']);
    ok=v.water==='flood'&&v.change==='clothes'&&v.check==='redo'&&v.move==='south'&&v.omission==='signature';
    if(!ok)msg=failPuzzle(id,'还有一处时间或证据边界没有接上；别替残缺纸页猜经手人。','进水 18:12、换衣 18:34、重核 18:56、南楼梯停用 19:16。便条边缘的“乔”字不能确定是谁写的。');
  }
  if(ok){
    feedback(root,'纸面上的前后关系暂时能接上','success');
    setTimeout(()=>solvePuzzle(id,false),250);
  }else{
    feedback(root,msg,'error');
    const hb=root.querySelector('[data-action="hint"]');if(hb)hb.hidden=false;
  }
}
function moveOrderItem(button){
  const li=button.closest('.order-item');const list=li.parentElement;const dir=button.dataset.move;
  if(dir==='up'&&li.previousElementSibling)list.insertBefore(li,li.previousElementSibling);
  if(dir==='down'&&li.nextElementSibling)list.insertBefore(li.nextElementSibling,li);
  $$('.order-item',list).forEach((n,i)=>{const first=n.querySelector('span');first.textContent=(i+1)+'. '+(first.textContent.replace(/^\d+\.\s*/,''));});
  state.drafts=state.drafts||{};const orderId=list.dataset.orderId||'p3';state.drafts[orderId+'Order']=$$('.order-item',list).map(n=>n.dataset.value);save();
}

function updateQuestion(){
  const wrap=$('.question-line'),cq=$('#currentQuestion');if(!wrap||!cq)return;
  const q=currentQuestion();
  wrap.hidden=!q;
  cq.textContent=q||'';
}
function currentQuestion(){
  const have=(...ids)=>ids.every(id=>state.records.includes(id));
  if(state.currentLocation==='prologue') return '';
  if(!state.puzzles.p0){
    if(!have('entry_rules','box_labels')) return '门厅这批纸先按原标签登记，别让潮气再把来源弄乱。';
    return '门厅已经核完，楼里的旧记录从活动室开始。';
  }
  if(!state.puzzles.p1){
    if(!visited('activity')) return '活动室里那几张折叠床，为什么会出现在儿童活动区？';
    if(!have('activity_roll')) return '柜里的点名纸能不能把临时床位和人名接起来？';
    if(!visited('wardrobe')) return '换过衣以后，姓名布签为什么会留在服装室？';
    return '几张换衣记录的时间，能不能排成同一段经过？';
  }
  if(!state.puzzles.p2){
    if(!visited('dorm')) return '床号、临调和孩子当晚实际待的位置并不是一回事。';
    return '04 床停用以后，四个孩子各自去了哪里？';
  }
  if(!state.puzzles.p3){
    if(!visited('records')) return '床位能对上了，三份交接能不能也落到同一条先后关系里？';
    return '三个人各写了一截，哪些动作一定不能颠倒？';
  }
  if(!state.puzzles.p3b){
    if(!visited('office')) return '值班室留下了两条腕带抄记，它们和临调页之间有一处正面冲突。';
    return '先把称呼和位置拆开看，冲突究竟落在哪一栏？';
  }
  if(!state.puzzles.p4){
    if(!visited('laundry')) return '洗衣房留下的是返工痕迹：为什么一定要拆线再缝？';
    return '返工便条很短，旁边几张纸能不能把原因补全？';
  }
  if(!state.puzzles.p5){
    if(!visited('stairs')) return '腕带核完以后，真正改变撤离路线的是哪几张通行记录？';
    return '19:16 以后，哪条路还能从活动室连续接到楼外？';
  }
  if(!state.puzzles.p6){
    if(!visited('supplement')) return '当晚的纸后来被怎样收进正式报告？';
    return '报告里的“核对无误”是否意味着此前没有出过错？';
  }
  if(!state.puzzles.p7) return '网上留下的是碎片；原始记录能不能一张张压回它们下面？';
  if(!state.puzzles.p8) return '最后只剩时间：把整晚收回四个阶段。';
  if(!state.unlocked.exit) return '';
  return '21:57 这一行没有经手人。';
}
function refreshAll(){
  renderSections();renderAnchors();renderNav();renderRecordList();renderPuzzles();
  $('#saveLabel').textContent=locations.find(x=>x[0]===state.currentLocation)?.[1]||'院门外';
  updateQuestion();
  updateChapterActions();
  setupObserver();
}
function setupObserver(){ if(observer){observer.disconnect();observer=null;} }


function updateChapterActions(){
  const activityWrap=$('#activityNextWrap');
  if(activityWrap) activityWrap.hidden=!(state.puzzles.p0&&state.records.includes('activity_roll')&&state.unlocked.wardrobe);
}

function closeMobileDrawers(){[$('#leftNav'),$('#rightRecords')].forEach(x=>x.classList.remove('open'));$('#menuBtn')?.setAttribute('aria-expanded','false');$('#recordsBtn')?.setAttribute('aria-expanded','false');}
function installImageFallbacks(){
  const fail=(img)=>{
    if(img.dataset.fallbackInstalled)return;
    img.dataset.fallbackInstalled='1';
    img.classList.add('image-missing');
    const frame=img.closest('figure');if(frame)frame.classList.add('has-image-error');
    const box=document.createElement('div');box.className='image-fallback';
    const p=document.createElement('p');p.textContent=img.alt||'这张场景图没有成功载入。';
    const b=document.createElement('button');b.type='button';b.textContent='重新载入这张图';
    b.addEventListener('click',()=>{img.dataset.fallbackInstalled='';img.classList.remove('image-missing');frame?.classList.remove('has-image-error');box.remove();const src=img.getAttribute('src').split('?')[0];img.src=src+'?retry='+Date.now();});
    box.append(p,b);img.insertAdjacentElement('afterend',box);
  };
  $$('img').forEach(img=>{
    img.addEventListener('error',()=>fail(img));
    img.addEventListener('load',()=>{img.classList.remove('image-missing');img.closest('figure')?.classList.remove('has-image-error');});
    if(img.complete&&img.naturalWidth===0) fail(img);
  });
}

function wireGlobalEvents(){
  updateContinue();loadSettings();applySettings();installImageFallbacks();
  $('#recordSearch').addEventListener('input',e=>{recordSearchText=e.target.value;renderRecordList();});
  $('#clearRecordSearch').addEventListener('click',()=>{recordSearchText='';$('#recordSearch').value='';renderRecordList();$('#recordSearch').focus();});
  let scrollSaveTimer=null;
  $$('.story-section').forEach(scene=>scene.addEventListener('scroll',()=>{
    if(!scene.classList.contains('active-scene'))return;
    clearTimeout(scrollSaveTimer);
    scrollSaveTimer=setTimeout(()=>{
      if(!state.started)return;
      state.scrollPositions=state.scrollPositions||{};
      state.scrollPositions[scene.dataset.location]=scene.scrollTop;
      save();
    },220);
  },{passive:true}));
  $('#startBtn').addEventListener('click',()=>startGame(false));
  $('#enterSiteBtn')?.addEventListener('click',()=>{unlock('lobby');jumpTo('loc-lobby',false);});
  $('#activityNextBtn')?.addEventListener('click',()=>{if(state.unlocked.wardrobe)jumpTo('loc-wardrobe',false);});
  $('#continueBtn').addEventListener('click',()=>{if(loadSave())startGame(true);});
  $$('[data-record]').forEach(b=>b.addEventListener('click',()=>discoverRecord(b.dataset.record)));
  $$('.dialog-close').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
  $('#recordDialog').addEventListener('click',e=>{if(e.target===$('#recordDialog'))closeDialog($('#recordDialog'));});
  $('#settingsDialog').addEventListener('click',e=>{if(e.target===$('#settingsDialog'))closeDialog($('#settingsDialog'));});
  $('#settingsBtn').addEventListener('click',()=>{lastDialogFocus=document.activeElement;$('#settingsDialog').showModal();$('.dialog-close',$('#settingsDialog')).focus();});
  ['fontScaleStart','fontScaleGame'].forEach(id=>$('#'+id).addEventListener('change',e=>{state.settings.fontScale=Number(e.target.value);saveSettings();applySettings();if(state.started)save();}));
  ['reduceMotionStart','reduceMotionGame'].forEach(id=>$('#'+id).addEventListener('change',e=>{state.settings.reduceMotion=e.target.checked;saveSettings();applySettings();if(state.started)save();}));
  $('#resetBtn').addEventListener('click',()=>{if(confirm('清除当前存档并回到标题？')){closeDialog($('#settingsDialog'));clearSave();backToTitle();applySettings();}});
  $('#restartBtn').addEventListener('click',()=>{if(confirm('重新开始会清除当前进度；确定？')){clearSave();backToTitle();applySettings();}});
  $('#leaveBtn').addEventListener('click',()=>{unlock('exit');refreshAll();jumpTo('loc-exit',false);});
  $('#reviewBtn').addEventListener('click',()=>jumpTo('loc-lobby',true));
  $('#returnBtn').addEventListener('click',()=>{const loc=state.returnLocation;state.returnLocation=null;save();$('#returnBtn').hidden=true;if(loc)jumpTo('loc-'+loc,false);});
  $('#menuBtn').addEventListener('click',()=>{const n=$('#leftNav');n.classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(n.classList.contains('open')));});
  $('#recordsBtn')?.addEventListener('click',()=>{const r=$('#rightRecords');const open=!r.classList.contains('open');closeMobileDrawers();if(open){r.classList.add('open');$('#recordsBtn').setAttribute('aria-expanded','true');}});
  $$('[data-open-drawer]').forEach(b=>b.addEventListener('click',()=>{closeMobileDrawers();$('#'+b.dataset.openDrawer).classList.add('open');}));
  $$('[data-close-drawer]').forEach(b=>b.addEventListener('click',closeMobileDrawers));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#recordDialog').open)closeDialog($('#recordDialog'));else if($('#settingsDialog').open)closeDialog($('#settingsDialog'));else closeMobileDrawers();}});
}

wireGlobalEvents();
})();

(() => {
'use strict';

const SAVE_KEY = 'huaiwan_orphanage_save_v4';
const LEGACY_SAVE_KEYS = ['huaiwan_orphanage_save_v3','huaiwan_orphanage_save_v2'];
const SETTINGS_KEY = 'huaiwan_orphanage_settings_v4';
const LEGACY_SETTINGS_KEYS = ['huaiwan_orphanage_settings_v3','huaiwan_orphanage_settings_v2'];

const locations = [
  ['lobby','门厅'],['activity','活动室'],['wardrobe','服装室'],['dorm','二层寝室'],['records','记录柜'],['office','值班室'],
  ['laundry','洗衣房'],['stairs','南楼梯'],['supplement','两份补记'],['rebuild','把那一晚排回来'],['rainnight','那一晚'],['exit','离开']
];

const anchorConfig = {
  temp_place:{location:'activity',names:['临时睡人的地方','临调床位','集中等待区'], additions:[
    '',
    '完整页补出了三个临时位置：活动室折叠床、靠门观察位、原寝室。这里不是长期床位。',
    '雨夜结束前，这里一直只是集中等待区。孩子换过衣，也换过睡的位置。'
  ]},
  cloth_tags:{location:'wardrobe',names:['剪下来的布签','换衣桌','腕带准备桌'], additions:[
    '',
    '领用单在 18:34，剪裁条在 18:41。库存衣已经发出去，布签才从湿衣上剪下来。',
    '两条错配被改正后，布签被重新缝到棉布条上。桌子的用途到这里才算完整。'
  ]},
  empty_bed:{location:'dorm',names:['空出来的床','临时调床','生活记录来源'], additions:[
    '',
    '04 床当天上午已经停用。小满事故前就被临时调到活动室，空床和当晚的“失踪”没有关系。',
    '后来核对腕带时，寝室照护页反而成了最可靠的旁证之一。'
  ]},
  papers:{location:'records',names:['互相矛盾的纸','两份交接','事故补记'], additions:[
    '',
    '把顺序排开以后，两张交接写的是同一次错配：一张写孩子端，一张写布签端。',
    '正式报告把这次错误压成了“二次核对无误”。内部补记保留了更难看的那一段。'
  ]},
  laundry_table:{location:'laundry',names:['红线和剪刀','缝腕带的地方','腕带核对桌'], additions:[
    '',
    '湿衣换掉以后，能跟着本人移动的只有重新缝好的腕带。剪刀和红线都用在这里。',
    '两条腕带拿反以后，也是在这张桌边重新核对、拆线再缝。'
  ]},
  two_children:{location:'laundry',names:['两个孩子被留下','重新核对腕带'], additions:[
    '',
    '留下的是小满和豆豆。不是随机挑人：两条临时腕带上的地点恰好与她们的临调记录相反。'
  ]},
  backdoor:{location:'stairs',names:['封住的后门','后勤坡道','撤离出口'], additions:[
    '',
    '19:18 后门钥匙借出。洗衣房外的后勤坡道当时仍可推车通行。',
    '门厅与南楼梯都不能走以后，这里成了当晚实际使用的撤离出口。'
  ]}
};

const records = {
  entry_rules:{title:'清点登记说明',meta:'现代 / 拆除前移交',body:[
    '能辨认的纸质材料登记标题、日期、来源位置；不做现场修复',
    '可移交学校的普通教育史旧物单独装箱；建筑拆除相关材料留给拆除队；无法确认去向的暂存',
    '每离开一处，补写清点时间与经手人；未签经手人的行不计入正式移交记录'
  ]},
  box_labels:{title:'三只纸箱标签',meta:'现代 / 门厅',lines:['A箱：学校接收——普通教学与儿童生活旧物','B箱：拆除队——建筑、钥匙、维修、施工相关','C箱：待确认——来源或去向不明']},
  temp_bed_partial:{title:'《临时床位调整》受潮页',meta:'十九年前 / 18:30 后',lines:['低龄组暂移活动室，折叠床另记','……04 床……停……','……靠门……观察……']},
  activity_misc:{title:'活动室柜内杂物',meta:'现代 / 无关主线',lines:['一盒彩色粉笔，只剩白色和绿色','两张旧贴纸背面写着“借蜡笔要还”','一只没有盖子的塑料水杯，底部刻着“成”']},
  stock_form:{title:'《库存衣物领用单》',meta:'十九年前 / 18:34',lines:['18:34　领库存短袖 18 件、长裤 16 条、薄外套 7 件','领用原因：一层进水，低龄组与活动室临时安置儿童换干衣','经手：邹梅']},
  wet_clothes:{title:'《湿衣收拢表》',meta:'十九年前 / 18:37',lines:['18:37 起，湿衣按楼层暂装编织袋','部分衣物姓名布签仍可辨','备注：先送洗衣房，不得继续穿']},
  cutting_note:{title:'《后勤剪裁条》',meta:'十九年前 / 18:41',lines:['剪可辨姓名布签，另存','布签先放搪瓷盘，后缝棉布条','剪刀归还洗衣房针线柜']},
  flood_note:{title:'《一层进水简记》',meta:'十九年前 / 18:12—18:27',lines:['18:12　旧河道水位涨','18:21　门厅外沿进水','18:27　低龄组先移二层']},
  bed_repair:{title:'《床架维修单》',meta:'十九年前 / 当日上午',lines:['二层 04 床：床板裂，停用','临时移开床垫，待下周更换','值班人员已知']},
  night_care:{title:'《夜间照护页》',meta:'十九年前 / 事故当日',lines:['林小满：原二层，因 04 床停用，晚间改活动室折叠床','乔乔：二层原寝室','阿成：二层原寝室','豆豆：新入院，当晚安排活动室靠门观察位；登记名陈雨宁']},
  daily_issue:{title:'《当日物品领用条》',meta:'十九年前 / 下午',lines:['小满：薄毯 1','乔乔：鞋带 1 对','阿成：毛巾袋 1','豆豆：临时洗漱杯 1，备注“只认小名”']},
  temp_bed_full:{title:'《临时床位调整》完整页',meta:'十九年前 / 17:50',lines:['活动室折叠床 1：林小满','活动室靠门观察位：陈雨宁（豆豆）','二层原寝室：乔乔、阿成等','04 床：维修停用']},
  handover_pan:{title:'潘琴交接',meta:'十九年前 / 当晚手写',lines:['低龄上楼后换干衣','腕带先按原布签做','18:56 两名儿童暂留换衣桌，重新核对','南楼梯停用后改后勤口']},
  handover_zou:{title:'邹梅交接',meta:'十九年前 / 当晚手写',lines:['湿衣收拢后剪可辨布签','布签放盘，盘底有水，字更花','有两块发反，已拆线重缝','后门钥匙 19:18 取']},
  handover_he:{title:'何芹值班末页',meta:'十九年前 / 当晚手写',lines:['低龄组先移二层','换衣后在活动室等','乔乔说腕带名字不对','19:16 南楼梯裂响，人员回撤']},
  wristband_a:{title:'临时腕带抄记 A',meta:'十九年前 / 18:49',lines:['姓名：林小满','临时地点：二层','缝制时间：18:49']},
  wristband_b:{title:'临时腕带抄记 B',meta:'十九年前 / 18:49',lines:['姓名：陈雨宁','临时地点：活动室','缝制时间：18:49']},
  doudou_name:{title:'新入院生活说明',meta:'十九年前 / 豆豆',lines:['登记名：陈雨宁','目前只稳定回应“小名：豆豆”','突然叫登记全名时常无反应，交接须说明']},
  stairs_closed:{title:'《南楼梯维修页》',meta:'十九年前 / 19:16',lines:['19:16　半层墙体裂缝扩大','南楼梯停止通行','不得从二层继续向门厅下撤']},
  lobby_water:{title:'《门厅水位简记》',meta:'十九年前 / 19:12',lines:['19:02　门厅积水过鞋底','19:12　外门内侧持续进水','推车已无法从正门通过']},
  back_key:{title:'《后门钥匙登记》',meta:'十九年前 / 19:18',lines:['19:18　洗衣房后门钥匙借出','借用：邹梅','19:52　未归；次日补记已交物业']},
  slope_access:{title:'《后勤坡道通行说明》',meta:'旧日常文件',lines:['洗衣房后门外接后勤坡道','坡道宽度可过送衣推车','雨天注意防滑；不得堆放纸箱']},
  identity_observations:{title:'《低龄组生活观察页》',meta:'十九年前 / 当周',lines:[
    '林小满：不喜欢腕上绑东西；换衣后常把袖口卷到手肘',
    '陈雨宁（豆豆）：刚入院，只稳定回应“小名：豆豆”；叫登记名时常不抬头',
    '乔乔：能认出同寝室孩子的床位与生活用品，喜欢替老师纠正名单',
    '阿成：左鞋后跟磨偏，走快时会拖一步'
  ]},
  clothing_followup:{title:'《换衣后复核便条》',meta:'十九年前 / 18:52',lines:[
    '新衣不得继续沿用原床位衣物判断身份',
    '腕带完成前，低龄组留在活动室，不得自行回寝室拿东西',
    '对不上者先停在换衣桌旁，查临调床位与生活照护页'
  ]},
  passage_shift:{title:'《后勤通道值班补页》',meta:'十九年前 / 19:20',lines:[
    '洗衣房后门开，坡道无堆物',
    '送衣推车先行清空，儿童从内侧靠墙通过',
    '正门水深继续上涨，不再从门厅转移物资'
  ]},
  gym_receive:{title:'《临时体育馆接收页》',meta:'十九年前 / 19:54',lines:[
    '到场儿童按原组别重新点名；登记名与小名并记',
    '腕带与接收页不一致者不得直接划“已到”',
    '乔乔、林小满、陈雨宁（豆豆）、阿成均有第二次核对记录'
  ]},
  teacher_margin:{title:'潘琴页边短记',meta:'事故后 / 未装订',lines:[
    '乔乔问我“写了吗”',
    '我补写：腕带两条发反，已重缝',
    '这行后来没有抄进正式报告'
  ]},
  official_report:{title:'正式事故报告',meta:'事故后 / 打印件',lines:['强降雨造成一层进水及南侧楼梯结构隐患','儿童与工作人员经后勤通道安全转移','转移前完成二次核对，登记无误','无人员失踪及伤亡']},
  supp_pan:{title:'潘琴补记',meta:'事故后第 3 日 / 手写',lines:['18:56 前后，两条临时腕带曾发反','乔乔先提出，小满与豆豆留在桌边重核','我当时先以为孩子拿错，后确认是发带时认错']},
  supp_zou:{title:'邹梅补记',meta:'事故后第 4 日 / 手写',lines:['湿布签都放一个搪瓷盘，盘底有水','两块字花得厉害，我没有分开压','潘琴拿时认错两块，拆线后重缝']},
  supp_he:{title:'何芹末页补写',meta:'事故后一周 / 原值班本',lines:['南楼梯裂响时我停了一下，乔乔叫我','孩子从活动室穿洗衣房去后门','体育馆又核一次，名单齐']},
  activity_roll:{title:'低龄组临时点名纸',meta:'十九年前 / 活动室柜内',lines:['低龄组 12 人，傍晚临时集中活动室','小满：已调折叠床；豆豆：靠门观察','乔乔、阿成：原寝室，晚间仍随低龄组活动','页角有人用铅笔写：“晚饭后再点一次。”']},
  borrow_book:{title:'旧借用簿',meta:'旧日常记录 / 与事故无直接关系',lines:['3 月 11 日　乔乔借蓝蜡笔 2 支，已还','3 月 13 日　小满借儿童剪刀 1 把，老师代还','4 月 2 日　阿成借胶水，盖子丢失','备注：豆豆刚来，不让她自己拿剪刀']},
  thread_ledger:{title:'《针线领用簿》',meta:'旧日常后勤',lines:['红色粗棉线：每月常规领用，用于厚布、床单边、腕带','白线：薄衣修补','黑线：工作服','邹梅连续三月备注“厚布好拉，别换细线”']},
  donation_sizes:{title:'捐赠衣物尺码清单',meta:'十九年前 / 当日下午',lines:['110 码上衣 7 件；120 码上衣 8 件；130 码上衣 6 件','长裤尺码混放，未按儿童姓名预分','备注：库存衣只按尺码发放，不代表原持有人']},
  night_misc:{title:'《晚间小事本》',meta:'十九年前 / 事故当日',lines:['17:42　小满又问 04 床什么时候修好；说活动室有人打呼','17:48　豆豆找不到洗漱杯，只肯用黄色那只','17:53　乔乔提醒阿成鞋后跟又开线','18:01　准备晚饭，雨势变大']},
  shift_strip:{title:'《当晚值班时间条》',meta:'十九年前 / 18:30 后',lines:['潘琴：18:30 起在活动室，负责低龄组清点与临时登记','邹梅：洗衣房、后勤库往返，负责干衣与针线','何芹：先带低龄组上二层，随后回活动室照看换衣','三人值班时段重叠']},
  back_halfline:{title:'交接页背面的半句话',meta:'十九年前 / 字迹残缺',lines:['……先别让她们回寝室','……查临调页','其余字迹被水泡开，无法确认主语与姓名']},
  alias_board:{title:'《登记名 / 小名对照》',meta:'十九年前 / 值班室',lines:['陈雨宁——小名“豆豆”，新入院','林小满——无常用小名','乔乔——登记名与常用称呼一致','阿成——登记名与常用称呼一致']},
  group_note:{title:'《换衣后分组便条》',meta:'十九年前 / 值班室',lines:['低龄组换干衣后先留活动室','临调地点以当日晚间调整页为准，不按原床号','腕带内容若与临调页冲突，先停在换衣桌旁重新核','未核完，不回寝室拿个人物品']},
  desk_log:{title:'值班室桌面简记',meta:'现代 / 清点现场',lines:['电话机无接线；白板已拆','旧搪瓷杯 1，只作值夜用品','圆珠笔 4 支，均已干涸','未发现与事故当晚新增有关的物件']},
  rework_note:{title:'《腕带返工便条》',meta:'十九年前 / 18:58 后',lines:['两条腕带拆线重缝','旧线不要再用，防止松脱','旁注只有一个“乔”字，不能确认是姓名还是经手简称']},
  needle_box:{title:'针线柜清点页',meta:'十九年前 / 后勤',lines:['粗红棉线 2 卷半；白线 4 卷；黑线 1 卷','大号针 7 枚，小号针 11 枚','剪刀 2 把，事故次日清点均在','无特殊器械']},
  cart_note:{title:'《送衣推车移位条》',meta:'十九年前 / 19:22',lines:['19:22　送衣推车先推至坡道雨棚外','目的：空出洗衣房后门内侧通道','备注：地面太滑，儿童靠墙走']},
  report_flow:{title:'《事故材料装订流转条》',meta:'事故后 / 行政归档',lines:['次日上午：收集值班本、后勤页、门钥匙登记','第 3 日上午：形成事故报告正文','第 3 日下午：正文打印、签字','其后补记：单独归档；正文已定，不再重排']}
};

const defaultState = () => ({
  version:4,started:false,
  unlocked:{lobby:true,activity:false,wardrobe:false,dorm:false,records:false,office:false,laundry:false,stairs:false,supplement:false,rebuild:false,rainnight:false,exit:false},
  unreadLocations:{lobby:false,activity:false,wardrobe:false,dorm:false,records:false,office:false,laundry:false,stairs:false,supplement:false,rebuild:false,rainnight:false,exit:false},
  visitedLocations:['lobby'],
  records:[], puzzles:{}, attempts:{}, hints:{}, puzzleSeenAt:{}, formDrafts:{}, drafts:{},
  anchors:Object.fromEntries(Object.keys(anchorConfig).map(k=>[k,{state:0,unread:false}])),
  currentLocation:'lobby', returnLocation:null,
  settings:{fontScale:1,reduceMotion:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false},
  startedAt:Date.now(), lastSavedAt:0
});

let state = defaultState();
let lastDialogFocus = null;
let observer = null;
let toastTimer = null;

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
  const merged={...fresh,...saved,version:4};
  merged.unlocked={...fresh.unlocked,...(saved.unlocked||{})};
  merged.unreadLocations={...fresh.unreadLocations,...(saved.unreadLocations||{})};
  merged.anchors={...fresh.anchors,...(saved.anchors||{})};
  merged.settings={...fresh.settings,...(saved.settings||{})};
  merged.visitedLocations=Array.isArray(saved.visitedLocations)?saved.visitedLocations:['lobby',saved.currentLocation].filter(Boolean);
  merged.formDrafts=saved.formDrafts||{};
  merged.drafts=saved.drafts||{};
  return merged;
}
function loadSave(){
  try{
    const raw=localStorage.getItem(SAVE_KEY)||LEGACY_SAVE_KEYS.map(k=>localStorage.getItem(k)).find(Boolean); if(!raw) return false;
    const saved=JSON.parse(raw); if(!saved||![2,3,4].includes(saved.version)) return false;
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
  $('#startScreen').hidden=true;$('#gameShell').hidden=false;applySettings();refreshAll();
  requestAnimationFrame(()=>{
    const target=document.getElementById('loc-'+(state.currentLocation||'lobby'))||$('#loc-lobby');
    target.scrollIntoView({block:'start',behavior:'auto'});$('#mainGame').focus({preventScroll:true});
  });
}
function backToTitle(){
  $('#gameShell').hidden=true;$('#startScreen').hidden=false;updateContinue();window.scrollTo(0,0);
}

function markVisited(loc){
  if(!loc)return;
  state.visitedLocations=Array.isArray(state.visitedLocations)?state.visitedLocations:[];
  if(!state.visitedLocations.includes(loc)){state.visitedLocations.push(loc);save();}
}
function visited(loc){return (state.visitedLocations||[]).includes(loc);}
function unlock(loc){if(!state.unlocked[loc]){state.unlocked[loc]=true;state.unreadLocations=state.unreadLocations||{};state.unreadLocations[loc]=true;save();}}
function hasRecords(ids){return ids.every(id=>state.records.includes(id));}
function discoverRecord(id){
  if(!records[id]) return;
  if(!state.records.includes(id)){state.records.push(id);save();renderRecordList();renderPuzzles();updateQuestion();}
  openRecord(id);
}
function openRecord(id){
  const r=records[id];if(!r)return;
  lastDialogFocus=document.activeElement;
  $('#recordMeta').textContent=r.meta||'';$('#recordTitle').textContent=r.title;
  const body=$('#recordBody');body.innerHTML='';
  (r.body||[]).forEach(p=>{const el=document.createElement('p');el.textContent=p;body.appendChild(el);});
  (r.lines||[]).forEach(line=>{const el=document.createElement('div');el.className='line';el.textContent=line;body.appendChild(el);});
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
function jumpTo(targetId,isRevisit=false,anchorId=null){
  const target=document.getElementById(targetId);if(!target)return;
  const current=state.currentLocation;
  const locId=target.matches('.story-section')?target.dataset.location:target.closest('.story-section')?.dataset.location;
  if(isRevisit && current && locId && locId!==current){state.returnLocation=current;$('#returnBtn').hidden=false;}
  if(locId){markVisited(locId);state.currentLocation=locId;state.unreadLocations=state.unreadLocations||{};state.unreadLocations[locId]=false;$('#saveLabel').textContent=locations.find(x=>x[0]===locId)?.[1]||locId;save();renderNav();updateQuestion();}
  if(locId&&state.unreadLocations?.[locId]){state.unreadLocations[locId]=false;save();renderNav();}
  if(anchorId) clearAnchorUnread(anchorId);
  const behavior=state.settings.reduceMotion?'auto':'smooth';
  target.scrollIntoView({behavior,block:'start'});
  setTimeout(()=>{const h=target.matches('section')?$('h2',target):$('h3',target);if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true});}},state.settings.reduceMotion?0:350);
  closeMobileDrawers();
}
function renderSections(){
  $$('.story-section').forEach(sec=>{const id=sec.dataset.location;sec.hidden=!state.unlocked[id];});
  $('#returnBtn').hidden=!state.returnLocation;
}
function renderRecordList(){
  const root=$('#recordList');root.innerHTML='';
  if(!state.records.length){root.innerHTML='<p class="empty">读过的记录会放在这里。所有必要文字都可以随时重新打开。</p>';return;}
  [...state.records].reverse().forEach(id=>{const r=records[id];if(!r)return;const b=document.createElement('button');b.innerHTML=`${escapeHtml(r.title)}<span>${escapeHtml(r.meta||'')}</span>`;b.addEventListener('click',()=>openRecord(id));root.appendChild(b);});
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
    ['activity','wardrobe'].forEach(unlock);showToast('服装室和活动室可以继续清点。');
  }
  if(id==='p1'){
    setAnchorState('cloth_tags',1,true);unlock('dorm');showToast('先去二层寝室核床位。');
  }
  if(id==='p2'){
    setAnchorState('temp_place',1,true);setAnchorState('empty_bed',1,true);unlock('records');showToast('记录柜已经有足够的前置线索。');
  }
  if(id==='p3'){
    setAnchorState('papers',1,true);unlock('office');showToast('值班室里还有一组对照材料。');
  }
  if(id==='p3b'){
    unlock('laundry');showToast('去洗衣房看腕带返工记录。');
  }
  if(id==='p4'){
    setAnchorState('cloth_tags',2,true);setAnchorState('laundry_table',2,true);setAnchorState('two_children',1,true);setAnchorState('empty_bed',2,true);unlock('stairs');
  }
  if(id==='p5'){
    setAnchorState('backdoor',2,true);unlock('supplement');
  }
  if(id==='p6'){setAnchorState('papers',2,true);unlock('rebuild');}
  if(id==='p7'){/* P8 appears */}
  if(id==='p8'){
    setAnchorState('temp_place',2,false);unlock('rainnight');
    showToast('桌上的材料已经排回同一晚。');
  }
  refreshAll();
}

const puzzleMeta = {
  p0:{title:'先把箱子挪开',question:'按纸箱原标签决定去向。',requires:[],hints:['标签已经直接写明去向，不需要推理。','先看 A 箱：“学校接收”。','A→移交学校，B→拆除队，C→待确认。'],solved:'箱子分开了；接下来能逐间清点。'},
  p1:{title:'他们为什么把名字从衣服上剪下来？',question:'先把四份记录按“换衣开始前 / 换衣开始后”分开，再看剪布签出现在什么位置。',requires:['flood_note','stock_form','wet_clothes','cutting_note'],hints:['先只看每张纸上的时间。','18:34 已经开始发库存衣；剪裁条是 18:41。','18:12—18:27 在前；18:34、18:37、18:41 都在换衣开始以后。'],solved:'换干衣已经开始，旧湿衣才被统一收走；布签是从离开本人的湿衣上剪下来的。'},
  p2:{title:'床号和人对不上',question:'根据文字记录，把四名孩子放回事故当晚实际待过的位置；04 床当天已经停用，不能按床号直觉判断。',requires:['bed_repair','night_care','daily_issue','temp_bed_full','night_misc'],hints:['不要按床号猜，先处理“04 床停用”。','《晚间小事本》和临调页都写到小满已经睡活动室。','小满→活动室折叠床；豆豆→靠门观察位；乔乔/阿成→原寝室。'],solved:'04 床当天没人入住；小满和豆豆都在活动室，只是位置不同。'},
  p3:{title:'三份交接写的是同一晚吗？',question:'只排“必须先发生”的关系；如果三份纸能排进同一条时间链，它们才可能在写同一次处理。',requires:['handover_pan','handover_zou','handover_he','shift_strip'],hints:['不需要精确到分钟；先抓“换衣、剪布签、缝腕带、发现错配”。','发现错配一定发生在腕带缝好以后；封南楼梯在纠正腕带以后。','上楼→换衣→剪布签→缝腕带→发现错配→封南楼梯。'],solved:'三份纸能排进同一条时间链；它们描述的处理没有互相排斥。'},
  p3b:{title:'先把“错”分清',question:'四句话里只有两句能被现有记录同时支持；选出它们。',requires:['alias_board','group_note','wristband_a','wristband_b','temp_bed_full'],hints:['先确认“豆豆”是不是陈雨宁，再看腕带上的临时地点。','名字能对上；冲突出在“二层 / 活动室”这两个地点。','应选：两条腕带姓名都能对应本人；两条腕带的临时地点与临调页相反。'],solved:'名字没有换人；两条腕带写反的是临时地点。'},
  p4:{title:'被留下重新核对的是谁？',question:'两条腕带的姓名没错，临时地点却与其他记录冲突。结合床位、生活观察和小名说明，把地点改回去。',requires:['wristband_a','wristband_b','doudou_name','identity_observations','clothing_followup','temp_bed_full','rework_note'],hints:['把腕带上的地点和《临时床位调整》并排。','豆豆的登记名是陈雨宁。','林小满应写“活动室折叠床”；陈雨宁应写“靠门观察位”。'],solved:'留下重核的是小满和豆豆；两条腕带拆线后，临时地点被改回各自记录。'},
  p5:{title:'19:16 以后还能往哪走？',question:'从活动室出发，排除已经停用或无法通过的方向，选出一条当时还能连续通行的路线。',requires:['stairs_closed','lobby_water','back_key','slope_access','passage_shift','cart_note'],hints:['先排除已经停用或积水过深的方向。','南楼梯不能走；正门也不适合推车。','活动室→洗衣房→后门坡道。'],solved:'南楼梯和正门都断了路；洗衣房后的坡道当时仍能通行。'},
  p6:{title:'正式报告漏掉了哪一段？',question:'先别判断谁更可信；按写作时间和用途，把这些句子分回“现场当时写 / 事后补写 / 正式报告”。',requires:['official_report','supp_pan','supp_zou','supp_he','gym_receive','teacher_margin','report_flow'],hints:['不要判断谁更可信，只看它是什么时候、以什么用途写的。','带“补记”“事故后”的都不是现场当时写；打印件是正式报告。','两句现场来自原值班/交接；四句事后补写；最后两句来自正式报告。'],solved:'腕带错配留在现场纸和事后补记里；正式报告只留下“二次核对无误”。'},
  p7:{title:'每一步到底在解决什么？',question:'把六个动作与当时要解决的问题一一对应；答案只来自已经读过的文字记录。',requires:[],hints:['优先从已经改过名的锚点开始。','“剪布签”不是原因本身，先问当时衣服去了哪里。','每个动作都能在一份记录中找到直接原因。'],solved:'动作和原因已经能逐项接上；剩下的是把整晚放回时间段。'},
  p8:{title:'把那一晚排回来',question:'把十二件事放进“进水 / 换衣 / 核对 / 转移”四个阶段；列内顺序不计，只确认事件属于哪一段。',requires:[],hints:['先放最明确的：河道水位→进水；体育馆→转移。','“乔乔指出错配”“两孩暂留”“翻生活记录”都属于核对。','库存衣、湿衣、剪布签、缝腕带都属于换衣阶段。'],solved:'四段时间能完整接上；可以往下看那一晚的完整经过。'}
};

function missingRecords(meta){return (meta.requires||[]).filter(id=>!state.records.includes(id));}
function recordsNeededHtml(ids){
  const count=ids.length;
  return `<div class="puzzle material missing-material"><strong>这里还缺${count}份能互相对照的文字记录。</strong><p>先把当前房间和已经开放的位置翻完；读过的纸会一直留在右侧记录里。</p><p class="small">如果来回找不到，再用提示；提示会指向关系，不会直接替你作答。</p></div>`;
}
function puzzleShell(id,inner){
  const m=puzzleMeta[id];markPuzzleSeen(id);
  const hintLevel=state.hints[id]||0;const hint=hintLevel?`<div class="hint-box">提示 ${hintLevel}：${escapeHtml(m.hints[hintLevel-1])}</div>`:'';
  return `<div class="puzzle puzzle-${id}" data-puzzle="${id}"><h3>${escapeHtml(m.title)}</h3><p class="question">${escapeHtml(m.question)}</p>${inner}<div class="puzzle-actions"><button class="submit" data-action="submit" data-puzzle="${id}">确认判断</button><button class="hint-btn" data-action="hint" data-puzzle="${id}">看一条提示</button></div><div class="feedback" role="status" tabindex="-1" hidden></div>${hint}</div>`;
}
function solvedHtml(id){const m=puzzleMeta[id];return `<div class="puzzle solved puzzle-${id}"><h3>${escapeHtml(m.title)}</h3><div class="feedback success">${escapeHtml(m.solved||'这组关系能接得上。')}</div></div>`;}

function renderPuzzles(){
  for(const id of Object.keys(puzzleMeta)){
    const slot=$('#puzzle-'+id);if(!slot)continue;
    if(puzzleStatus(id)){slot.innerHTML=solvedHtml(id);continue;}
    if(id==='p0'){slot.innerHTML=renderP0();continue;}
    if(id==='p3b' && !state.puzzles.p3){slot.innerHTML='';continue;}
    if(id==='p4' && !state.puzzles.p3b){slot.innerHTML='<div class="puzzle material">值班室那组地点冲突还没分清；先把“名字错 / 地点错”判断清楚。</div>';continue;}
    if(id==='p5' && !state.puzzles.p4){slot.innerHTML='<div class="puzzle material">两条腕带还没重新核准，先把洗衣房那一段接上。</div>';continue;}
    if(id==='p6' && !state.puzzles.p5){slot.innerHTML='<div class="puzzle material">撤离路线还没确认，补记暂时先放着。</div>';continue;}
    if(id==='p7' && !state.puzzles.p6){slot.innerHTML='<div class="puzzle material">两份补记还没有整理完。</div>';continue;}
    if(id==='p8' && !state.puzzles.p7){slot.innerHTML='';continue;}
    const miss=missingRecords(puzzleMeta[id]);if(miss.length){slot.innerHTML=recordsNeededHtml(miss);continue;}
    slot.innerHTML=({p1:renderP1,p2:renderP2,p3:renderP3,p3b:renderP3b,p4:renderP4,p5:renderP5,p6:renderP6,p7:renderP7,p8:renderP8}[id])();
  }
  Object.keys(puzzleMeta).forEach(id=>{const slot=$('#puzzle-'+id);if(slot&&!state.puzzles[id])restorePuzzleDraft(id,slot);});
  bindPuzzleEvents();
}
function select(name,opts,prompt='请选择'){
  return `<div class="choice-line" data-choice="${escapeHtml(name)}" role="group" aria-label="${escapeHtml(prompt)}"><input type="hidden" name="${escapeHtml(name)}" value=""><span class="choice-prompt">${escapeHtml(prompt)}：</span>${opts.map(o=>`<button type="button" class="choice-option" data-value="${escapeHtml(o[0])}" aria-pressed="false">${escapeHtml(o[1])}</button>`).join('')}</div>`;
}
function renderP0(){
  const opts=[['school','移交学校'],['demo','留给拆除队'],['unsure','待确认']];
  return puzzleShell('p0',`<div class="puzzle-grid">
    <div class="puzzle-row"><label>A 箱：学校接收</label>${select('a',opts)}</div>
    <div class="puzzle-row"><label>B 箱：建筑维修相关</label>${select('b',opts)}</div>
    <div class="puzzle-row"><label>C 箱：来源或去向不明</label>${select('c',opts)}</div></div>`);
}
function renderP1(){
  const opts=[['before','换衣开始前'],['after','换衣开始后']];
  const rows=[['flood','《一层进水简记》18:12—18:27'],['stock','《库存衣物领用单》18:34'],['wet','《湿衣收拢表》18:37'],['cut','《后勤剪裁条》18:41']];
  return puzzleShell('p1',`<div class="puzzle-grid">${rows.map(r=>`<div class="puzzle-row"><label>${r[1]}</label>${select(r[0],opts)}</div>`).join('')}</div>`);
}
function renderP2(){
  const opts=[['dorm','二层原寝室'],['fold','活动室折叠床'],['door','活动室靠门观察位']];
  return puzzleShell('p2',`<div class="puzzle-grid">${[['xm','小满'],['dd','豆豆 / 陈雨宁'],['qq','乔乔'],['ac','阿成']].map(r=>`<div class="puzzle-row"><label>${r[1]}</label>${select(r[0],opts)}</div>`).join('')}</div>`);
}
function renderP3(){
  const initial=['上楼','换衣','剪布签','缝腕带','发现错配','封南楼梯'];
  const shuffled=['换衣','上楼','缝腕带','剪布签','封南楼梯','发现错配'];
  const arr=(state.drafts?.p3Order)||shuffled;
  return puzzleShell('p3',`<ol class="order-list" data-order-list>${arr.map((x,i)=>`<li class="order-item" data-value="${x}"><span>${i+1}. ${x}</span><span class="order-controls"><button type="button" data-move="up" aria-label="${x} 上移">↑</button><button type="button" data-move="down" aria-label="${x} 下移">↓</button></span></li>`).join('')}</ol><p class="small">只检查必要前后关系，不要求给每件事精确到分钟。</p>`);
}
function renderP3b(){
  const statements=[
    ['s1','“豆豆”与“陈雨宁”不是同一个孩子。'],
    ['s2','两条腕带上的姓名都能对应到本人。'],
    ['s3','林小满当晚应该在二层原寝室。'],
    ['s4','两条腕带写反的是临时地点。']
  ];
  return puzzleShell('p3b',`<div class="evidence-lines">${statements.map(x=>`<label class="evidence-check"><input type="checkbox" name="${x[0]}"> <span>${x[1]}</span></label>`).join('')}</div><p class="small">只选两句；每句都必须能找到文字记录支持。</p>`);
}
function renderP4(){
  const opts=[['fold','活动室折叠床'],['door','活动室靠门观察位'],['dorm','二层原寝室']];
  return puzzleShell('p4',`<div class="material">腕带 A：林小满 / 二层</div><div class="material">腕带 B：陈雨宁 / 活动室</div><div class="puzzle-grid"><div class="puzzle-row"><label>林小满应改为</label>${select('xm',opts)}</div><div class="puzzle-row"><label>陈雨宁应改为</label>${select('dd',opts)}</div></div>`);
}
function renderP5(){
  const opts1=[['lobby','门厅'],['laundry','洗衣房'],['stairs','南楼梯']];
  const opts2=[['front','正门'],['back','后门坡道'],['dorm','二层寝室']];
  return puzzleShell('p5',`<div class="route-path">起点：活动室 → <span data-route-one>？</span> → <span data-route-two>？</span></div><div class="puzzle-grid"><div class="puzzle-row"><label>下一处</label>${select('step1',opts1)}</div><div class="puzzle-row"><label>再下一处</label>${select('step2',opts2)}</div></div>`);
}
function renderP6(){
  const opts=[['scene','现场当时写'],['after','事后补写'],['official','正式报告']];
  const rows=[
    ['r1','“18:56 两名儿童暂留换衣桌，重新核对。”','scene'],
    ['r2','“盘底有水，字更花；有两块发反。”','scene'],
    ['r3','“两条临时腕带曾发反，乔乔先提出。”','after'],
    ['r4','“我当时先以为孩子拿错，后确认是我认错。”','after'],
    ['r5','“湿布签都放一个搪瓷盘，我没有分开压。”','after'],
    ['r6','“南楼梯裂响时我停了一下，乔乔叫我。”','after'],
    ['r7','“儿童与工作人员经后勤通道安全转移。”','official'],
    ['r8','“转移前完成二次核对，登记无误。”','official']
  ];
  return puzzleShell('p6',`<div class="puzzle-grid">${rows.map(r=>`<div class="puzzle-row"><label>${r[1]}</label>${select(r[0],opts)}</div>`).join('')}</div>`);
}
function renderP7(){
  const causes=[
    ['wet','湿衣已经离开本人'],['identity','换衣后需要能跟着本人走的标识'],['conflict','两条腕带信息与临调记录冲突'],['name','只问登记全名不足以确认豆豆'],['stairs','南楼梯封锁、门厅积水'],['slope','后勤坡道仍可通向外部']
  ];
  const acts=[['a1','剪下可辨布签'],['a2','把布签缝到棉布条'],['a3','暂留小满与豆豆'],['a4','翻床位和生活照护页'],['a5','改走洗衣房'],['a6','借出后门钥匙']];
  return puzzleShell('p7',`<div class="puzzle-grid">${acts.map(a=>`<div class="pairing"><strong>${a[1]}</strong>${select(a[0],causes,'选择当时要解决的问题')}</div>`).join('')}</div>`);
}
function renderP8(){
  const phases=[['water','进水'],['change','换衣'],['check','核对'],['move','转移']];
  const events=[
    ['c1','旧河道水位上涨'],['c2','低龄组先上二层'],['c3','发库存衣'],['c4','收拢湿衣'],['c5','剪可辨布签'],['c6','缝临时腕带'],
    ['c7','乔乔指出腕带不对'],['c8','两名儿童暂留换衣桌'],['c9','翻床位与照护记录'],['c10','南楼梯停用'],['c11','后门钥匙借出'],['c12','体育馆二次核对']
  ];
  return puzzleShell('p8',`<div class="phase-grid">${events.map(c=>`<div class="phase-line"><strong>${c[1]}</strong>${select(c[0],phases,'放入阶段')}</div>`).join('')}</div>`);
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
  $$('[data-action="hint"]').forEach(b=>b.onclick=()=>showHint(b.dataset.puzzle,b.closest('.puzzle')));
  $$('[data-action="submit"]').forEach(b=>b.onclick=()=>{capturePuzzleDraft(b.dataset.puzzle,b.closest('.puzzle'));submitPuzzle(b.dataset.puzzle,b.closest('.puzzle'));});
  $$('.order-controls button').forEach(b=>b.onclick=()=>moveOrderItem(b));
  $$('.choice-option').forEach(b=>b.onclick=()=>{
    const group=b.closest('[data-choice]');const hidden=$('input[type="hidden"]',group);hidden.value=b.dataset.value;
    $$('.choice-option',group).forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    const puzzle=b.closest('.puzzle');capturePuzzleDraft(puzzle?.dataset.puzzle,puzzle);
  });
  $$('.evidence-check input').forEach(i=>i.onchange=()=>{const puzzle=i.closest('.puzzle');capturePuzzleDraft(puzzle?.dataset.puzzle,puzzle);});
}
function showHint(id,root){capturePuzzleDraft(id,root);state.hints[id]=Math.min(3,(state.hints[id]||0)+1);save();renderPuzzles();const slot=$('#puzzle-'+id);slot.scrollIntoView({behavior:state.settings.reduceMotion?'auto':'smooth',block:'center'});}
function getVals(root,names){const o={};names.forEach(n=>o[n]=root.querySelector(`[name="${n}"]`)?.value||'');return o;}
function feedback(root,msg,type='error'){const f=$('.feedback',root);f.hidden=false;f.textContent=msg;f.className='feedback '+type;f.setAttribute('tabindex','-1');f.focus({preventScroll:true});}
function submitPuzzle(id,root){
  let ok=false,msg='';
  if(id==='p0'){
    const v=getVals(root,['a','b','c']);ok=v.a==='school'&&v.b==='demo'&&v.c==='unsure';if(!ok)msg=failPuzzle(id,'至少有一只箱子的去向和标签原文对不上。','A 写“学校接收”，B 是建筑维修相关，C 才是待确认。');
  }
  if(id==='p1'){
    const v=getVals(root,['flood','stock','wet','cut']);ok=v.flood==='before'&&v.stock==='after'&&v.wet==='after'&&v.cut==='after';if(!ok)msg=failPuzzle(id,'时间顺序有冲突。18:34 已经开始发库存衣，18:41 才出现剪裁条。','先把 18:12—18:27 放在前，其余三张都在换衣开始以后。');
  }
  if(id==='p2'){
    const v=getVals(root,['xm','dd','qq','ac']);ok=v.xm==='fold'&&v.dd==='door'&&v.qq==='dorm'&&v.ac==='dorm';if(!ok)msg=failPuzzle(id,'至少一个床位与照护页对不上。04 床当天上午已经停用。','小满在活动室折叠床，豆豆在靠门观察位，乔乔和阿成留在原寝室。');
  }
  if(id==='p3'){
    const arr=$$('[data-order-list] .order-item',root).map(n=>n.dataset.value);const pos=x=>arr.indexOf(x);
    ok=pos('上楼')<pos('换衣')&&pos('换衣')<pos('剪布签')&&pos('剪布签')<pos('缝腕带')&&pos('缝腕带')<pos('发现错配')&&pos('发现错配')<pos('封南楼梯');
    if(!ok)msg=failPuzzle(id,'这里有一条前后关系放反了。先从“腕带必须先缝好，才可能被发现错配”检查。','必要顺序是：上楼→换衣→剪布签→缝腕带→发现错配→封南楼梯。');
  }
  if(id==='p3b'){
    const vals=['s1','s2','s3','s4'].filter(n=>root.querySelector(`[name="${n}"]`)?.checked);
    ok=vals.length===2&&vals.includes('s2')&&vals.includes('s4');
    if(!ok)msg=failPuzzle(id,'这四句话不能同时成立。先把“豆豆 / 陈雨宁”与两条腕带上的地点分开看。','应选“腕带姓名能对应本人”和“写反的是临时地点”。');
  }
  if(id==='p4'){
    const v=getVals(root,['xm','dd']);ok=v.xm==='fold'&&v.dd==='door';if(!ok)msg=failPuzzle(id,'腕带上的地点仍与《临时床位调整》冲突。','林小满当晚在活动室折叠床；陈雨宁（豆豆）在靠门观察位。');
  }
  if(id==='p5'){
    const v=getVals(root,['step1','step2']);ok=v.step1==='laundry'&&v.step2==='back';if(!ok)msg=failPuzzle(id,'这条路在 19:16 以后不能连续通行。','从活动室只能先穿洗衣房，再走后门坡道。');
  }
  if(id==='p6'){
    const v=getVals(root,['r1','r2','r3','r4','r5','r6','r7','r8']);const ans={r1:'scene',r2:'scene',r3:'after',r4:'after',r5:'after',r6:'after',r7:'official',r8:'official'};ok=Object.keys(ans).every(k=>v[k]===ans[k]);if(!ok)msg=failPuzzle(id,'有一句被放到了不符合来源时间的栏里。先看“补记 / 事故后 / 正式报告”这些明写的来源。','前两句是当晚交接；中间四句是事后补写；最后两句来自正式报告。');
  }
  if(id==='p7'){
    const v=getVals(root,['a1','a2','a3','a4','a5','a6']);const ans={a1:'wet',a2:'identity',a3:'conflict',a4:'name',a5:'stairs',a6:'slope'};ok=Object.keys(ans).every(k=>v[k]===ans[k]);if(!ok)msg=failPuzzle(id,'至少有一组动作和当时要解决的问题接不上。','先检查“剪布签←湿衣已离开本人”和“改走洗衣房←南楼梯封锁、门厅积水”。');
  }
  if(id==='p8'){
    const v=getVals(root,['c1','c2','c3','c4','c5','c6','c7','c8','c9','c10','c11','c12']);const ans={c1:'water',c2:'water',c3:'change',c4:'change',c5:'change',c6:'change',c7:'check',c8:'check',c9:'check',c10:'move',c11:'move',c12:'move'};ok=Object.keys(ans).every(k=>v[k]===ans[k]);if(!ok)msg=failPuzzle(id,'有事件落在了不合适的阶段。列内不用排序，只看它主要属于哪一段。','水位/上楼属于进水；库存衣到缝腕带属于换衣；错配到翻记录属于核对；楼梯停用以后属于转移。');
  }
  if(ok){feedback(root,'这组关系能接得上。','success');setTimeout(()=>solvePuzzle(id,false),250);}else feedback(root,msg,'error');
}
function moveOrderItem(button){
  const li=button.closest('.order-item');const list=li.parentElement;const dir=button.dataset.move;
  if(dir==='up'&&li.previousElementSibling)list.insertBefore(li,li.previousElementSibling);
  if(dir==='down'&&li.nextElementSibling)list.insertBefore(li.nextElementSibling,li);
  $$('.order-item',list).forEach((n,i)=>n.querySelector('span').textContent=(i+1)+'. '+n.dataset.value);
  state.drafts=state.drafts||{};state.drafts.p3Order=$$('.order-item',list).map(n=>n.dataset.value);save();
}

function updateQuestion(){const cq=$('#currentQuestion');if(cq)cq.textContent=currentQuestion();}
function currentQuestion(){
  const have=(...ids)=>ids.every(id=>state.records.includes(id));
  if(!state.puzzles.p0) return '先按门厅原标签完成第一轮清点。';
  if(!state.puzzles.p1){
    if(!visited('wardrobe')) return '活动室与服装室都开放了；先找能互相核对时间的当晚材料。';
    if(!have('flood_note','stock_form','wet_clothes','cutting_note')) return '这些布签为什么会留在这里？把同一晚的换衣、湿衣和剪裁记录找齐。';
    return '四份记录都在手里：先后顺序能不能解释这些剪口？';
  }
  if(!state.puzzles.p2){
    if(!visited('dorm')) return '二层寝室里还有床位与照护记录；先查清当晚实际睡位有没有变化。';
    if(!have('bed_repair','night_care','temp_bed_full')) return '寝室里的床牌、维修页和照护页还没对上；把能互相核对的纸找全。';
    return '床位编号与实际睡位，能不能同时成立？';
  }
  if(!state.puzzles.p3){
    if(!visited('records')) return '记录柜还没查完；先读三名工作人员留下的交接。';
    if(!have('handover_pan','handover_zou','handover_he','shift_strip')) return '每张交接只写了一截；先把能确定的前后关系补齐。';
    return '这些交接写法不同，它们能不能发生在同一条时间线上？';
  }
  if(!state.puzzles.p3b){
    if(!visited('office')) return '值班室里还有名字、常用称呼与临时位置的对照材料。';
    if(!have('alias_board','group_note','wristband_a','wristband_b','temp_bed_full')) return '两条腕带与临调页出现冲突；先分别核姓名和地点。';
    return '冲突究竟落在姓名，还是临时位置？';
  }
  if(!state.puzzles.p4){
    if(!visited('laundry')) return '后勤记录还有一处没查完：洗衣房。';
    if(!have('rework_note','identity_observations','clothing_followup')) return '返工便条写了“拆线重缝”；再找两份能确认对象的文字记录。';
    return '地点已经写反；哪两名孩子需要被留下重核？';
  }
  if(!state.puzzles.p5){
    if(!visited('stairs')) return '南楼梯与后勤出口的通行记录还没核完。';
    if(!have('stairs_closed','lobby_water','back_key','slope_access')) return '先把当时不能走的方向与仍可通行的出口找全。';
    return '19:16以后，哪条路线还能连续走通？';
  }
  if(!state.puzzles.p6){
    if(!visited('supplement')) return '事故后的材料还剩最后一袋；把现场纸、补记和正式报告分开看。';
    return '同一件事在三类文件里留下了什么，又少了什么？';
  }
  if(!state.puzzles.p7) return '线索已经齐了；先把每个动作和它当时要解决的麻烦接起来。';
  if(!state.puzzles.p8) return '再把已经确认的事件放回四个阶段，检查整晚有没有断口。';
  if(!state.unlocked.exit) return '时间线接上了；往下读完整经过，看看有没有哪一步反而说不通。';
  return '那行21:17没有经手人；它是谁补上的？';
}
function refreshAll(){
  renderSections();renderAnchors();renderNav();renderRecordList();renderPuzzles();
  $('#saveLabel').textContent=locations.find(x=>x[0]===state.currentLocation)?.[1]||'门厅';
  updateQuestion();
  setupObserver();
}
function setupObserver(){
  if(observer)observer.disconnect();
  observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;const loc=visible.target.dataset.location;
    if(loc){markVisited(loc);updateQuestion();}
    if(loc&&state.currentLocation!==loc){state.currentLocation=loc;state.unreadLocations=state.unreadLocations||{};state.unreadLocations[loc]=false;$('#saveLabel').textContent=locations.find(x=>x[0]===loc)?.[1]||loc;save();renderNav();}
  },{rootMargin:'-20% 0px -65% 0px',threshold:[0,.1,.3]});
  $$('.story-section:not([hidden])').forEach(s=>observer.observe(s));
}

function closeMobileDrawers(){[$('#leftNav'),$('#rightRecords')].forEach(x=>x.classList.remove('open'));$('#menuBtn')?.setAttribute('aria-expanded','false');}
function installImageFallbacks(){
  $$('img').forEach(img=>{
    img.addEventListener('error',()=>{
      if(img.dataset.fallbackInstalled)return;
      img.dataset.fallbackInstalled='1';
      const box=document.createElement('div');box.className='image-fallback';
      const p=document.createElement('p');p.textContent=img.alt||'场景插画加载失败。';
      const b=document.createElement('button');b.type='button';b.textContent='重试插画';
      b.addEventListener('click',()=>{img.dataset.fallbackInstalled='';box.remove();const src=img.getAttribute('src').split('?')[0];img.src=src+'?retry='+Date.now();});
      box.append(p,b);img.insertAdjacentElement('afterend',box);
    });
  });
}

function wireGlobalEvents(){
  updateContinue();loadSettings();applySettings();installImageFallbacks();
  $('#startBtn').addEventListener('click',()=>startGame(false));
  $('#continueBtn').addEventListener('click',()=>{if(loadSave())startGame(true);});
  $$('[data-record]').forEach(b=>b.addEventListener('click',()=>discoverRecord(b.dataset.record)));
  $$('.dialog-close').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
  $('#recordDialog').addEventListener('click',e=>{if(e.target===$('#recordDialog'))closeDialog($('#recordDialog'));});
  $('#settingsDialog').addEventListener('click',e=>{if(e.target===$('#settingsDialog'))closeDialog($('#settingsDialog'));});
  $('#settingsBtn').addEventListener('click',()=>{lastDialogFocus=document.activeElement;$('#settingsDialog').showModal();$('.dialog-close',$('#settingsDialog')).focus();});
  ['fontScaleStart','fontScaleGame'].forEach(id=>$('#'+id).addEventListener('change',e=>{state.settings.fontScale=Number(e.target.value);saveSettings();applySettings();if(state.started)save();}));
  ['reduceMotionStart','reduceMotionGame'].forEach(id=>$('#'+id).addEventListener('change',e=>{state.settings.reduceMotion=e.target.checked;saveSettings();applySettings();if(state.started)save();}));
  $('#resetBtn').addEventListener('click',()=>{if(confirm('清除当前存档并回到标题？')){closeDialog($('#settingsDialog'));clearSave();backToTitle();applySettings();}});
  $('#restartBtn').addEventListener('click',()=>{if(confirm('重新开始会清除当前进度。确定？')){clearSave();backToTitle();applySettings();}});
  $('#leaveBtn').addEventListener('click',()=>{unlock('exit');refreshAll();jumpTo('loc-exit',false);});
  $('#reviewBtn').addEventListener('click',()=>jumpTo('loc-lobby',true));
  $('#returnBtn').addEventListener('click',()=>{const loc=state.returnLocation;state.returnLocation=null;save();$('#returnBtn').hidden=true;if(loc)jumpTo('loc-'+loc,false);});
  $('#menuBtn').addEventListener('click',()=>{const n=$('#leftNav');n.classList.toggle('open');$('#menuBtn').setAttribute('aria-expanded',String(n.classList.contains('open')));});
  $$('[data-open-drawer]').forEach(b=>b.addEventListener('click',()=>{closeMobileDrawers();$('#'+b.dataset.openDrawer).classList.add('open');}));
  $$('[data-close-drawer]').forEach(b=>b.addEventListener('click',closeMobileDrawers));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if($('#recordDialog').open)closeDialog($('#recordDialog'));else if($('#settingsDialog').open)closeDialog($('#settingsDialog'));else closeMobileDrawers();}});
}

// QA helper is only exposed when the explicit query flag is present.
function exposeQA(){
  if(!location.search.includes('qa=1'))return;
  window.__QA__={
    getState:()=>JSON.parse(JSON.stringify(state)),
    solve:(id)=>solvePuzzle(id,false),
    skip:(id)=>solvePuzzle(id,true),
    addRecord:(id)=>{if(records[id]&&!state.records.includes(id)){state.records.push(id);save();refreshAll();}},
    unlock:(id)=>{unlock(id);refreshAll();},
    reset:()=>{clearSave();location.reload();},
    allRecords:()=>Object.keys(records),
    records
  };
}

wireGlobalEvents();exposeQA();
})();

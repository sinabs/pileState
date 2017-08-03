
/**
 * 检查充电桩状态
 */
function checkPileState() {
    getPileStateData(function(json){
        if(json['result']['pileList']){
           //充电桩信息列表
           var pileList = json['result']['pileList'];
           //保存可用充电桩id
           var newPile = [];
           //保存充满充电桩id
           var fullPile = [];
           for(var key in pileList){
               var pile = pileList[key];

               //保存充电桩信息和更新历史状态
               oldPile = findPile(pile.pileId)
               if(oldPile){
                   pile.historyStatus = oldPile.runStatus;
                   updatePile(pile);
               }else{
                   pile.historyStatus = 0;
                   addPile(pile);
               }

               //变化的充电桩
               if(pile.runStatus == 1){
                   newPile.push(pile);
               }else if(pile.runStatus == 8){
                   fullPile.push(pile);
               }

               if(JSON.parse(localStorage.isPushPhone)){
                   pushPhoneNotification(pile);
               }
           }

            //消息提示
            if(IsChageStatus(newPile)){
                pushNotification(newPile,1);
            }else if(IsChageStatus(fullPile)){
                pushNotification(fullPile,0);
            }

            if(newPile.length){
                showBadgeInfo(newPile,1);
            }else if(fullPile.length){
                showBadgeInfo(fullPile,0);
            }else{
                clearBadgeStatus();
            }
        }
    });
}

function showBadgeInfo(pile,isNew) {
    //设置提示图标
    chrome.browserAction.setIcon({path:"19_green.png"});
    chrome.browserAction.setBadgeText({text:String(pile.length)});

    if(isNew){
        chrome.browserAction.setBadgeBackgroundColor({'color':[50, 150, 255, 255]})
    }else{
        chrome.browserAction.setBadgeBackgroundColor({'color':[255,180,0,255]})
    }
}


/**
 * 推送通知
 * @param pile
 * @param isNew
 */
function pushNotification(pile,isNew) {
    var runStatus = isNew?'空闲':'占用';
    new Notification('发现'+runStatus+'充电桩', {
        icon: '48.png',
        body: getPileIdString(pile)
    });
}

/**
 * 推送到手机消息
 * @param pile
 * @param isNew
 */
function pushPhoneNotification(pile) {
    //充电桩发生变化通知手机
    if(pile.historyStatus != pile.runStatus){
        //拼接消息
        var runStatus = getPileStatusText(pile);
        var msg = '充电桩状态:['+runStatus+']';
        var time = (new Date()).toLocaleTimeString();
        msg = time +"\n" + msg +"\n" + pile.pileName;

        //请求推送通知
        var data = "name=XTXiPhone&code=915117&msg[text]="+msg;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://qpush.me/pusher/push_site/", true);
        xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
        xhr.send(data);
    }
}

/**
 * 获得充电桩状态文字
 * @param pile
 * @returns {string}
 */
function getPileStatusText(pile) {
    var runStatus = '未知';
    switch (pile.runStatus){
        case 1:
            runStatus = "空闲";
            break;
        case 3:
            runStatus = "充电中";
            break;
        case 4:
            runStatus = "离线";
            break;
        case 8:
            runStatus = "占用";
            break;
        default:
            runStatus = "不可用["+pile.runStatus+"]";
    }
    return runStatus;
}

/**
 * 清空Badge信息
 */
function clearBadgeStatus() {
    chrome.browserAction.setBadgeText({text:""});
    chrome.browserAction.setIcon({path:"19_gray.png"});
    chrome.browserAction.setBadgeBackgroundColor({'color':[50, 150, 255, 255]});
}

/**
 * 获得充电桩id拼接字符
 * @param pile
 * @returns {string}
 */
function getPileIdString(pile) {
    var idString = [];
    for(var k in pile){
        idString.push(pile[k].pileId.slice(pile[k].pileId.length-3, pile[k].pileId.length));
    }
    return idString.join(',');
}

/**
 * 请求充电桩信息接口
 * @param callback
 */
function getPileStateData(callback){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://yyc.renrenchongdian.com/charge/station/pileState/1014817007082332851", true);
    //xhr.open("GET", "http://pms.bfc.com/pile.json", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            // JSON解析器不会执行攻击者设计的脚本.
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

/**
 * 是否发生状态变化
 * @param pile
 * @returns {boolean}
 * @constructor
 */
function IsChageStatus(pile) {
    for(var k in pile){
        if (pile[k].historyStatus != pile[k].runStatus){
            return true;
        }
    }
    return false;
}
/**
 * 新增充电桩信息
 * @param pile
 */
function addPile(pile) {
    allPile.push(pile);
    savePileToLocalStorage();
}
/**
 * 更新充电桩数据
 * @param pile
 */
function updatePile(pile) {
    for(var k in allPile){
        if(allPile[k].pileId == pile.pileId){
            allPile[k] = pile;
        }
    }
    savePileToLocalStorage();
}
/**
 * 查询可用充电桩数据
 * @param pileId
 * @returns {*}
 */
function findPile(pileId) {
    for(var k in allPile){
        if(allPile[k].pileId == pileId){
            return allPile[k];
        }
    }
    return false;
}

/**
 * 删除可用充电桩数据
 * @param pileId
 */
function deletePile(pileId) {
    for(var k in allPile) {
        if (allPile[k].pileId == pileId) {
            allPile.splice(k,1);
        }
    }
    savePileToLocalStorage();
}

function savePileToLocalStorage() {
    localStorage.allPile = allPile.length?JSON.stringify(allPile):'';
}

//初始化本地存储变量
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   //监控开关
  localStorage.isPushPhone = true;   //手机推送开关
  localStorage.frequency = 1;        //监控时间周期
  localStorage.isInitialized = true; //是否初始化了
  localStorage.allPile = '';
}

var allPile = []; //保存充电桩历史信息

// Test for notification support.
if (window.Notification) {
  // While activated, show notifications at the display frequency.
  if (JSON.parse(localStorage.isActivated)) { checkPileState(); }

  var interval = 0; // The display interval, in minutes.

  setInterval(function() {
    interval++;

    if (
      JSON.parse(localStorage.isActivated) &&
        localStorage.frequency <= interval
    ) {
        checkPileState();
      interval = 0;
    }
  }, 60000);
}

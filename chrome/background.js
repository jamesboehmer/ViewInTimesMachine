var timesMachineBaseURL="http://timesmachine.nytimes.com/svc/tmach/v1/refer?res=";
var currentTimesMachineLink=null;

function takeMeToTheTimesMachine(){
  if (currentTimesMachineLink) window.open(currentTimesMachineLink);
}

function prepareLink(url){
  currentTimesMachineLink=null;
  var anchor = document.createElement('a');
  anchor.href=url;
  var pairs = anchor.search.slice(1).split('&');
  var params = {};
  pairs.forEach(function(pair) {
    pair = pair.split('=');
    params[pair[0]] = decodeURIComponent(pair[1] || '');
  });
  var res = params['res'];
  var isQuery = anchor.hostname.match('query|select');
  var isGST = anchor.pathname.match('/gst/|/mem/archive-free/pdf');
  if(isQuery && isGST && res){
    currentTimesMachineLink=timesMachineBaseURL + res;
    chrome.browserAction.setIcon({path:{ 19 : "images/icon-tm-19x19-262626.png", 38 : "images/icon-tm-38x38-262626.png"}});
  }
  else{
    chrome.browserAction.setIcon({path:{ 19 : "images/icon-tm-19x19-262626-disabled.png", 38 : "images/icon-tm-38x38-262626-disabled.png"}});
  }
}

function onUpdated(tabId, changeInfo, tab) {
  prepareLink(tab.url);
}

function onActivateChanged(tabId, selectInfo) {
  chrome.tabs.getSelected(function(tab){
    prepareLink(tab.url);
  });
}

chrome.tabs.onActiveChanged.addListener(onActivateChanged);
chrome.tabs.onUpdated.addListener(onUpdated);
chrome.browserAction.onClicked.addListener(takeMeToTheTimesMachine);

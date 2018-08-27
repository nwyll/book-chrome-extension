chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "sampleContextMenu",
    "title": "Sample Context Menu",
    "contexts": ["selection"]
  });
});

chrome.alarms.onAlarm.addListener(function (alarm) {
  console.log('Got an alarm!', alarm);
});

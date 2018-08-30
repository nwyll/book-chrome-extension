chrome.alarms.onAlarm.addListener(function (alarm) {
  alert('Got an alarm!', alarm);

  //test notification
  let options = {
    type: 'basic',
    title: 'Test Title',
    message: " this is a test notification",
    iconUrl: "search32.png"
  };
  chrome.notifications.create(options, function () {
    
  });
});




chrome.alarms.onAlarm.addListener(function (alarm) {
  const id = alarm.name;
  
  chrome.storage.sync.get(id, function (result) {
    const bookObj = result[id];

    const options = {
      type: 'basic',
      title: bookObj.title,
      message: `Don't forget ${bookObj.title} comes out on ${bookObj.publishedDate}!`,
      iconUrl: 'search32.png'
    };

    chrome.notifications.create(options);
  });
});

/* eslint-disable */

chrome.alarms.onAlarm.addListener(function (alarm) {
  const bookTitle = alarm.name;

  const options = {
    type: 'basic',
    title: 'Book Watch',
    message: `Don't forget ${bookTitle} comes out today!`,
    iconUrl: 'search32.png'
  };

  chrome.notifications.create(options, function () {
    
  });
});

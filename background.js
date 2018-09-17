chrome.alarms.onAlarm.addListener(function (alarm) {
  const id = alarm.name;
  
  //retrieve book info from user's Chrome Storage
  chrome.storage.sync.get(id, function (result) {
    const bookObj = result[id];
  
    const filterDate = (dateStr) => {
      let date = new Date(dateStr);
      return date.toLocaleDateString();
    };

    const filteredDate = filterDate(bookObj.publishedDate);

    const options = {
      type: 'basic',
      title: bookObj.title,
      message: `Don't forget ${bookObj.title} comes out on ${filteredDate}!`,
      iconUrl: 'search32.png'
    };

    //when alarm fires, a pop-up noticication is created with above options and displayed to the user
    chrome.notifications.create(options);

    //delete book from storage (& subsequently the watch list) after an alarm has fired
    chrome.storage.sync.remove(id);
  });
});

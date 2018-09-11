chrome.alarms.onAlarm.addListener(function (alarm) {
  const id = alarm.name;
  
  //retrieve book info from storage
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

    chrome.notifications.create(options);

    //delete book from storage
    chrome.storage.sync.remove(id);
  });
});

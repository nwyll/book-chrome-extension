const buildBookItemTemplate = function(coverImage, title, publishedDate) {
  const template = 
      `<div class="book">`
    + `   <img src=${coverImage} alt="${title}" class="cover-img"/>`
    + `   <div class="published-date">${publishedDate}</div>`
    + `   <button type="button" 
            onclick="handleAddToWatchList(event)"
            data-title="${title}"
            data-publishedDate=${publishedDate}>
              Add to Watch List!
          </button>`
    + `</div>`
  ;

  return template; 
}

const handleSearch = function() {
  event.preventDefault();
  $("#content").empty();

  const BASE_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
  const OPTIONS = '&orderBy=newest'

  let query = $("#query").val();
  $("#query").val(" ");

  if(query) {
    fetch(`${BASE_URL}${query}${OPTIONS}`, { method: 'GET'} )
      .then(response => response.json())
      .then(json => {
        let { items } = json;
      
        items.map((item) => {
          const title = item.volumeInfo.title,
                authors = item.volumeInfo.authors, 
                publishedDate = item.volumeInfo.publishedDate,
                imageLinks = item.volumeInfo.imageLinks,
                coverImage = imageLinks !== undefined ? imageLinks.thumbnail : 'notebook.png';

          let bookItem = buildBookItemTemplate(coverImage, title, publishedDate);
           $("#content").append(bookItem);
        });
      });
  }
};

const createAlarm = function(title, publishedDate) {
  console.log("alarm created", {title}, {publishedDate})

  chrome.alarms.create(title, {
    when: Date.now() + 1000 });
    //when: Date.parse(publishedDate)});
};

const handleAddToWatchList = function(event) {
  console.log("add to watch list clicked")
  const title         = event.target.getAttribute('data-title'),
        publishedDate = event.target.getAttribute('data-publishedDate');

  createAlarm(title, publishedDate);
};

$(document).ready(function(){
  $("#searchForm").submit(handleSearch);

  return false; 
});




//   // Save it using the Chrome extension storage API.
//   chrome.storage.sync.set({'value': theValue}, function() {
//     // Notify that we saved.
//     message('Settings saved');
//   });
// }


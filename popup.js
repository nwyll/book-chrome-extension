const buildBookItemTemplate = function(coverImage, title, publishedDate) {
  const template = 
      `<div class="book">`
    + `   <img src=${coverImage} alt="${title}" class="cover-img"/>`
    + `   <div class="published-date">${publishedDate}</div>`
    + `<button type="button" 
               onclick="handleAddToWatchList(event)"
               data-title="${title}"
               data-publishedDate=${publishedDate}>Add to Watch List!</button>`
    + `</div>`
  ;

  return template; 
}

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

  //handleSearch
  $("#searchForm").submit(function() {
    event.preventDefault();

    //clear content div
    $("#content").empty();

    const BASE_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
    const OPTIONS = '&orderBy=newest'

    //get query value from user
    let query = $("#query").val();
    //clear user input
    $("#query").val(" ");

    //a little validation
    if(query) {
      //GET response from Google Books API
      fetch(`${BASE_URL}${query}${OPTIONS}`, { method: 'GET'} )
        .then(response => response.json())
        .then(json => {
          let { items } = json;
        
          //for each item returned add book to content div
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

    return false;
  });

  return false; 
});




//   // Save it using the Chrome extension storage API.
//   chrome.storage.sync.set({'value': theValue}, function() {
//     // Notify that we saved.
//     message('Settings saved');
//   });
// }


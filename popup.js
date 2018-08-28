const buildBookItemTemplate = function(coverImage, title, publishedDate) {
  const template = 
      `<div class="book">`
    + `   <img src=${coverImage} alt="${title}" class="cover-img"/>`
    + `   <h5 class="published-date">${publishedDate}</h5>`
    + `   <button type="button"
                  class="add-to-list" 
                  data-title="${title}" 
                  data-published=${publishedDate}>Add To Watch List</button>`
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

  let addToList = document.getElementsByClassName('add-to-list');
  console.log(addToList);

  
  return false;
};

const createAlarm = function(title, publishedDate) {
  console.log("alarm created", {title}, {publishedDate})

  chrome.alarms.create(title, {
    when: Date.now() + 1000 });
    //when: Date.parse(publishedDate)});
};

const handleAddToWatchList = function() {
 
};

$(document).ready(function(){
  $("#searchForm").submit(handleSearch);

  $("#content").on("click", "button", function(event) {
    let publishedDate = $(this).data('published'),
        title         = $(this).data('title');
  //         
    console.log({title}, {publishedDate});

    // createAlarm(title, publishedDate);
  });

  return false; 
});

//   // Save it using the Chrome extension storage API.
//   chrome.storage.sync.set({'value': theValue}, function() {
//     // Notify that we saved.
//     message('Settings saved');
//   });
// }


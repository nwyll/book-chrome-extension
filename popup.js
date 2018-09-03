/* eslint-disable */

const buildBookItemTemplate = function (coverImage, title, publishedDate, id) {
  const template = 
      '<div class="book">'
    + `   <img src=${coverImage} alt="${title}" class="cover-img"/>`
    + `   <h5 class="published-date">${publishedDate}</h5>`
    + `   <button type="button"
                  class="add-to-list" 
                  data-title="${title}" 
                  data-published=${publishedDate}
                  data-id=${id}>Add To Watch List</button>`
    + '</div>'
  ;

  return template; 
}

const handleSearch = function () {
  event.preventDefault();
  $('#content').empty();

  const BASE_URL = 'https://www.googleapis.com/books/v1/volumes?q=';
  const OPTIONS = '&orderBy=newest'

  let query = $('#query').val();
  $('#query').val(' ');

  if(query) {
    fetch(`${BASE_URL}${query}${OPTIONS}`, { method: 'GET'} )
      .then(response => response.json())
      .then(json => {
        let { items } = json;

        console.log(items);
      
        items.map((item) => {
          const id = item.id,
                title = item.volumeInfo.title,
                authors = item.volumeInfo.authors, 
                publishedDate = item.volumeInfo.publishedDate,
                imageLinks = item.volumeInfo.imageLinks,
                coverImage = imageLinks !== undefined ? imageLinks.thumbnail : 'notebook.png';

          let bookItem = buildBookItemTemplate(coverImage, title, publishedDate, id);
           $('#content').append(bookItem);
        });
      });
  }
  return false;
};

const createAlarm = function (title, publishedDate) {
  alert(`New notification created for ${title} coming on ${publishedDate}`);

  chrome.alarms.create(title, {when: Date.parse(publishedDate)});

  chrome.alarms.getAll(function(alarms){
    console.log(alarms);
  });
};

const saveToWatchList = function (id, title, publishedDate) {
  console.log(id, title, publishedDate);

  chrome.storage.sync.set({[id]: { title, publishedDate }}, function() {
    // Notify that we saved.
    alert('Settings saved');
  });
};

const displayWatchList = function () {
  chrome.storage.sync.get(null, function (result) {
    console.log(result);
    //result is an object
    //map over result and for each individual key list value.title and value.publishDate

    $('#content').empty();

    console.log(Object.values(result));
  });

};

$(document).ready(function () {
  $('#searchForm').submit(handleSearch);

  $('#content').on('click', 'button', function (event) {
    const publishedDate = $(this).data('published'),
          title         = $(this).data('title'),
          id            = $(this).data('id');
        
    createAlarm(title, publishedDate);
    saveToWatchList(id, title, publishedDate);
  });

  $('#watchList').click(function () {
    displayWatchList();
  });

  return false; 
});

//   // Save it using the Chrome extension storage API.
//   chrome.storage.sync.set({'value': theValue}, function() {
//     // Notify that we saved.
//     message('Settings saved');
//   });
// }


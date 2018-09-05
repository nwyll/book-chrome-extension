//filter year-month-date to month-day-year
const filterDate = (dateStr) => {
  let date = new Date(dateStr);
  return date.toLocaleDateString();
};

//build book tile template for search results
const buildBookItemTemplate = (coverImage, title, publishedDate, id) => {
  const template = 
      '<div class="book">'
    + `   <img src=${coverImage} alt="${title}" class="cover-img"/>`
    + `   <h5 class="published-date">${publishedDate}</h5>`
    + `   <button type="button"
            class="add-to-list" 
            data-title="${title}" 
            data-published=${publishedDate}
            data-id=${id}
            data-cover=${coverImage}>Add To Watch List
          </button>`
    + '</div>'
  ;

  return template; 
}

//get search results from Google API and displays results
const handleSearch = () => {
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

        console.log("----Items Returned From Google Books API----");
        console.log(items);
      
        items.map((item) => {
          const id = item.id,
                title = item.volumeInfo.title,
                authors = item.volumeInfo.authors, 
                publishedDate = filterDate(item.volumeInfo.publishedDate),
                imageLinks = item.volumeInfo.imageLinks,
                coverImage = imageLinks !== undefined ? imageLinks.thumbnail : 'notebook.png';

          let bookItem = buildBookItemTemplate(coverImage, title, publishedDate, id);
           $('#content').append(bookItem);
        });
      });
  }
  return false;
};

//creates new chrome alarm when a new book is added to the watch list
const createAlarm = (id, title, publishedDate) => {
  alert(`A new notification was created for ${title} coming out ${publishedDate}`);
  chrome.alarms.create(id, {when: Date.parse(publishedDate)});

  console.log("----Get All Alarms----");
  chrome.alarms.getAll(function(alarms){
    console.log(alarms);
  });
};

//saves book info to chrome storage for the watch list
const saveToWatchList = (id, title, publishedDate, coverImage) => {
  //console.log(id, title, publishedDate, coverImage);
  chrome.storage.sync.set({[id]: { title, publishedDate, coverImage }});
};

// displays the user's watch list when they click on 'My Watch List'
const displayWatchList = () => {
  chrome.storage.sync.get(null, function (result) {
    // console.log(result);
    //console.log(Object.entries(result));

    $('#content').empty();

    const booksArray = Object.entries(result);

    booksArray.map((subAarray) => {
      const id = subAarray[0],             
            title = subAarray[1].title,
            publishedDate = subAarray[1].publishedDate,
            coverImage = subAarray[1].coverImage;

      const bookListTemplate = 
          '<div class="book-item">'
        + `   <h3>
                <img src=${coverImage} alt="${title}" class="watch-list-cover">
                <span>${title}</span>
              </h3>
              <h5>${publishedDate}</h5>`
        + `   <button type="button"
                class="remove-from-list" 
                data-title="${title}" 
                data-published=${publishedDate}
                data-id=${id}>Remove
              </button>`
        + '</div>'
      ;

      $('#content').append(bookListTemplate);
    });
  });
};

//removes book obj from chrome storage 
const removeFromWatchList = (id) => {
  //remove item from chrome storage
  //chrome.storage.sync.remove(string of the key to remove - id, callback);
};

$(document).ready(function () {
  $('#searchForm').submit(handleSearch);

  $('#content').on('click', 'button', function (event) {
    const publishedDate = $(this).data('published'),
          title         = $(this).data('title'),
          id            = $(this).data('id'),
          coverImage    = $(this).data('cover');
        
    createAlarm(id, title, publishedDate);
    saveToWatchList(id, title, publishedDate, coverImage);
  });

  $('#watchList').click(function () {
    displayWatchList();
  });

  return false; 
});

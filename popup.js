//filter year-month-date to month-day-year
const filterDate = (dateStr) => {
  let date = new Date(dateStr);
  return date.toLocaleDateString();
};

const buildBookItemTemplate = (id, title, author, publishedDate, coverImage) => {
  const template = 
      '<div class="book-card">'
    + `  <img src=${coverImage} alt="${title}" title="${title}" style="width:90%">`
    + `  <h4 class="publish-date">Coming: ${filterDate(publishedDate)}</h4>`
    + `  <p class="author">By: ${author}</p>`
    + '   <form>'
    + '     Remind Me On:'
    + `     <input type="date" name="alarmDate" value=${publishedDate}>`
    + '   </form>'
    + `   <p><button type="button"
                class="add-to-list"
                data-id=${id}
                data-title="${title}"
                data-author="${author}"
                data-published=${publishedDate}
                data-cover=${coverImage}>Add To Watch List
          </button></p>`
    + '</div>'
  ;

  return template;
};

//get search results from Google API and displays results
const handleSearch = () => {
  event.preventDefault();
  $('#results').empty();
  $('#myBooks').empty();

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
                author = item.volumeInfo.authors[0], 
                publishedDate = item.volumeInfo.publishedDate,
                imageLinks = item.volumeInfo.imageLinks,
                coverImage = imageLinks !== undefined ? imageLinks.thumbnail : 'notebook.png';

          let bookItem = buildBookItemTemplate(id, title, author, publishedDate, coverImage);
           $('#results').append(bookItem);
        });
      });
  }
  return false;
};

//creates new chrome alarm when a new book is added to the watch list
const createAlarm = (id, title, alarmDate) => {
  alert(`A new notification was created for ${title} on ${filterDate(alarmDate)}.`);
  chrome.alarms.create(id, {when: Date.parse(alarmDate)});
};

//saves book info to chrome storage for the watch list
const saveToWatchList = (id, title, author, publishedDate, coverImage) => {
  chrome.storage.sync.set({[id]: { title, author, publishedDate, coverImage }});
};

// displays the user's watch list when they click on 'My Watch List'
const displayWatchList = () => {
  chrome.storage.sync.get(null, function (result) {
    $('#results').empty();
    $('#myBooks').empty();

    const booksArray = Object.entries(result);

    booksArray.map((subArray) => {
      const id = subArray[0],             
            title = subArray[1].title,
            publishedDate = subArray[1].publishedDate,
            coverImage = subArray[1].coverImage;

      let bookItem = 
          '  <div class="book-card">'
        + `  <img src=${coverImage} alt="${title}" title="${title}" style="width:90%">`
        + `  <h4 class="publish-date">Coming: ${filterDate(publishedDate)}</h4>`
        + `   <p><button type="button"
                    class="remove-from-list"
                    data-id=${id}>Remove
              </button></p>`
        + '</div>'
      ;

      $('#myBooks').append(bookItem);
    });
  });
};

//delete a book from the watch list by removing it from chrome storage & CASCADE delete alarm 
const removeFromWatchList = (id) => {
  chrome.storage.sync.remove(id, displayWatchList);
  chrome.alarms.clear(id);
};

$(document).ready(function () {
  $('#watchList').click(displayWatchList);

  $('#searchForm').submit(handleSearch);

  $('#results').on('click', 'button', function (e) {
    e.preventDefault();
    console.log($(this.parentNode.parentNode.children[3].children[0]));

    const id            = $(this).data('id'),
          title         = $(this).data('title'),
          author        = $(this).data('author'),
          publishedDate = $(this).data('published'),
          coverImage    = $(this).data('cover');

    //get new date value from user 
    //there has to be a better way
    const inputElement = $(this.parentNode.parentNode.children[3].children[0]);
    const alarmDate = inputElement[0].value; 
    
    createAlarm(id, title, alarmDate);
    saveToWatchList(id, title, author, publishedDate, coverImage);
  });

  $('#myBooks').on('click', 'button', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    removeFromWatchList(id.toString());
  });

  return false; 
});

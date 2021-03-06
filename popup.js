/**
 * Filters date format from year-month-date to month-date-year.
 *
 * @param {String} dateStr The date string to format.
 * @returns {String} Returns the new formatted date string.
 */
const filterDate = (dateStr) => {
  let date = new Date(dateStr);
  return date.toLocaleDateString();
};

/**
 * Creates a book tile for each book item passed.
 *
 * @param {String} id The id of the book, a unique string of numbers and characters generated by Google Books API.
 * @param {String} title The title of the book.
 * @param {String} author The author of the book.
 * @param {String} publishedDate The date-string of the book's pubish date.
 * @param {String} coverImage The link for the thumbnail image of the cover.
 * @returns {String Template} template Returns the html template to create the book tile.
 */
const buildBookItemTemplate = (id, title, author, publishedDate, coverImage) => {
  const template = 
      '<div class="book-card">'
    + `  <img src=${coverImage} alt="${title}" title="${title}" style="width:90%">`
    + `  <h4 class="publish-date">Coming: ${filterDate(publishedDate)}</h4>`
    + `  <p class="author">By: ${author}</p>`
    + '   <form>'
    + '     Remind Me On:'
    + `     <input type="date" id=${id} name="alarmDate" value=${publishedDate}>`
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


/**
 * Event hander for the search function. Returns results from Google Books API and displays results as individual book tiles.
 */
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

/**
 * Creates new Chrome alarm to notify user of book release.
 *
 * @param {String} id The id of the book, a unique string of numbers and characters generated by Google Books API.
 * @param {String} title The title of the book.
 * @param {String} alarmDate Date for the alarm chose by the user. Defaults to published date.
 */
const createAlarm = (id, title, alarmDate) => {
  alert(`A new notification was created for ${title} on ${filterDate(alarmDate)}.`);
  chrome.alarms.create(id, {when: Date.parse(alarmDate)});
};

/**
 * Saves book info to Chrome Storage for the user's watch list.
 *
 * @param {String} id The id of the book, a unique string of numbers and characters generated by Google Books API.
 * @param {String} title The title of the book.
 * @param {String} author The author of the book.
 * @param {String} publishedDate The date-string of the book's pubish date.
 * @param {String} coverImage The link for the thumbnail image of the cover.
 */
const saveToWatchList = (id, title, author, publishedDate, coverImage) => {
  chrome.storage.sync.set({[id]: { title, author, publishedDate, coverImage }});
};

/**
 * Event handler to display user's watch list.
 *
 * @param {String} id The id of the book, a unique string of numbers and characters generated by Google Books API.
 * @param {String} title The title of the book.
 * @param {String} author The author of the book.
 * @param {String} publishedDate The date-string of the book's pubish date.
 * @param {String} coverImage The link for the thumbnail image of the cover.
 * @returns {String Template} template Returns the html template to create the book tile.
 */
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

/**
 * Event handler to delete a book from a user's watch list. Book is removed from the user's Chrome Storage and the associated alarm is also deleted.
 *
 * @param {String} id The id of the book, a unique string of numbers and characters generated by Google Books API.
 */
const removeFromWatchList = (id) => {
  chrome.storage.sync.remove(id, displayWatchList);
  chrome.alarms.clear(id);
};

$(document).ready(function () {
  $('#watchList').click(displayWatchList);

  $('#searchForm').submit(handleSearch);

  $('#results').on('click', 'button', function (e) {
    e.preventDefault();
  
    const id            = $(this).data('id'),
          title         = $(this).data('title'),
          author        = $(this).data('author'),
          publishedDate = $(this).data('published'),
          coverImage    = $(this).data('cover');

    //get date from user using book id
    const alarmDate = $('#' + id).val();
    
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

let storage = window.localStorage
let bookmarkedMovies = JSON.parse(storage.getItem('bookmarked')) ?? []

const movieRender = (moviesAll) => {
  first.innerHTML = ''

  moviesAll.forEach(function(item){
    var LI = document.createElement('li')
    LI.setAttribute('class' , 'list')
    LI.dataset.movieId = item.imdbId

    var IMG = document.createElement('img')
    IMG.setAttribute('src' , item.smallThumbnail)
    IMG.classList.add('list__img')

    var TITLE = document.createElement('h3')
    TITLE.textContent = item.title
    TITLE.classList.add('list__name')

    var YEAR = document.createElement('p')
    YEAR.textContent = item.year
    YEAR.classList.add('list__year')

    var RATING = document.createElement('p')
    RATING.textContent = item.imdbRating
    RATING.classList.add('list__rating')
    
    var BTN_TRAILER = document.createElement('button')
    BTN_TRAILER.classList.add('btn-primary')

    var BTN_TRAILER_LINK = document.createElement('a')
    BTN_TRAILER_LINK.textContent = "Watch trailer"
    BTN_TRAILER_LINK.href = "https://youtu.be/" + item.youtubeId
    BTN_TRAILER_LINK.classList.add('btn-trailer-link')
    BTN_TRAILER_LINK.setAttribute('target', "_blank")


    var BTN_BOOKMARK = document.createElement('button')
    BTN_BOOKMARK.textContent = "Add bookmark"
    BTN_BOOKMARK.classList.add('btn-info')
    BTN_BOOKMARK.dataset.type = 'addbookmark'

    var BTN_INFO = document.createElement('button')
    BTN_INFO.textContent = "More info"
    BTN_INFO.setAttribute('class', 'btn btn-primary')
    BTN_INFO.setAttribute('data-bs-toggle', 'modal')
    BTN_INFO.setAttribute('data-bs-target', '#exampleModal')

    let CATEGORY = document.createElement('div')
    CATEGORY.textContent = item.categories.join(', ')

    LI.appendChild(IMG)
    LI.appendChild(TITLE)
    LI.appendChild(YEAR)
    LI.appendChild(RATING)
    LI.appendChild(BTN_TRAILER)
    LI.appendChild(BTN_BOOKMARK)
    LI.appendChild(BTN_INFO)
    LI.appendChild(CATEGORY)
    BTN_TRAILER.appendChild(BTN_TRAILER_LINK)

    first.appendChild(LI)


    
  })
}
movieRender(movies.slice(0, 30))

categories.forEach(i => {
  let OPTION = document.createElement('option')
  OPTION.setAttribute('class', 'option')
  OPTION.setAttribute('value', i)
  OPTION.textContent = i

  categorySorting.appendChild(OPTION)
})

submitBtn.addEventListener('click', e => {
    e.preventDefault()
      let regex = new RegExp(searchInput.value , 'gi')
      let filteredMovies = movies

      //sort by title
      if (searchInput.value.length > 3) {
        filteredMovies = movies.filter(item => String(item.title).match(regex))
      }

      //sort by rating
      if (movieRating.value) {
        filteredMovies = filteredMovies.filter(movie => movie.imdbRating >= Number(movieRating.value))
      }

      //sort by category
      if (categorySorting.value){
        if (categorySorting.value !== 'All') {
          filteredMovies = filteredMovies.filter(movie => movie.categories.includes(categorySorting.value))
        }
      }

      //sort by quality
      if (ratingSort.value == 'high-low') {
        filteredMovies = filteredMovies.sort((a, b) => b.imdbRating - a.imdbRating) 
      } else {
        filteredMovies = filteredMovies.sort((a, b) => a.imdbRating - b.imdbRating) 
      }

    movieRender(filteredMovies)
    searchResults.textContent = "Search results:" + " " + filteredMovies.length + " " + "similar movies"
})


//event delegation
first.addEventListener('click', e => {
  let movieId = e.target.parentElement.dataset.movieId

  if (e.target.dataset.type == 'addbookmark') {
    let foundMovie = movies.find(movie => movie.imdbId == e.target.parentElement.dataset.movieId)
    let movieData = {
      movieId: foundMovie.imdbId,
      title: foundMovie.title,
      date: Date.now()
    }

    if (bookmarkedMovies.findIndex(e => e.movieId == movieId) < 0) {
      bookmarkedMovies.push(movieData)
    } else {
      alert('the movie is already added')
    }

    //savedata
    storage.setItem('bookmarked' , JSON.stringify(bookmarkedMovies))

    
    //bookmarkeds
    let LI = document.createElement('li')
    LI.setAttribute('class', 'box-one border border-1 rounded-top pt-3 ps-4 pb-3')

    let DIV = document.createElement('h3')
    DIV.textContent = movieData.title

    let DELETE = document.createElement('button')
    DELETE.setAttribute('type', 'button')
    DELETE.setAttribute('class', 'btn btn-danger btn-remove')
    DELETE.textContent = "Remove"
    DELETE.dataset.type = 'remove'
    DELETE.dataset.movieId = movieData.movieId
  
    LI.append(DIV)
    LI.append(DELETE)
    bookmarkList.appendChild(LI)

  } 
})

bookmarkList.addEventListener('click', e => {
  let theList = e.target.parentElement
  if (e.target.dataset.type == 'remove') {
    theList.remove()
  }
})


exitBtn.addEventListener('click', e => {
  alertBar.remove()
})

darkMode.addEventListener('click', e => {
  let listItem = document.getElementsByClassName('list')
  fullBody.classList.toggle('darkModeOn')
  togglerDarkmode.classList.toggle('justOn')
  listItem.classList.toggle('listBorderColorWhite')
})
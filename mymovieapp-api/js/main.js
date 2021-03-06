/* API Elements*/
const KEY = '[YOUR-API-KEY]';
const endPoint = 'https://api.themoviedb.org/3/search/movie?api_key=[YOUR-API-KEY]'
const imgUrl = 'https://image.tmdb.org/t/p/w500';

/* DOM Elements */
const formInput = document.getElementById('form');
const input = document.getElementById('inputValue');
const movieSearch = document.getElementById('movieSearch');
const containerMovies = document.getElementById('containerMovies');
const movieContainer = document.getElementById('movies-content')

formInput.addEventListener('submit', (e) => {
    e.preventDefault();
    const value= input.value;
    containerMovies.classList.remove('section-home')
    searchMovie(value);
    /*Hiding home page content */
    movieContainer.classList.add('hide')
})
function searchMovie(value) {
    const path = '/search/movie'
    const url = generateUrl(path) + '&query=' + value;
    requestMovie(url, renderSearchMovies, handleError);
}
function generateUrl(path) {
    const pathUrl = `https://api.themoviedb.org/3${path}?api_key=[YOUR-API-KEY]`;
    return pathUrl;
}
function requestMovie(url, onComplete, onError) {
    fetch(url)
    .then(res => res.json())
    .then(onComplete)
    .catch(onError);
}
function renderSearchMovies(data) {
    movieSearch.innerHTML='';
    input.value='';
    containerMovies.innerHTML='';
    const movies = data.results;
    const movieBlock = createMovieContainer(movies);
    movieSearch.appendChild(movieBlock);
    console.log(data)
}

function createMovieContainer(movies){
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');
    movieTemplate = `
    <div class="container">
    <span class="btn-home"><i class="fas fa-chevron-left"></i>Home Page</span>
        <section class="section"> 
            ${movieSelection(movies)} 
        </section>
        <section id="modal">
        ${showMore(movies)}
        </section>
    </div>
    `;
    /*Return Elements W/O commas */
    var imagesWithoutCommas = movieTemplate.replace(/,/g, '');
    movieElement.innerHTML=imagesWithoutCommas; 
    return movieElement;
}
function movieSelection(movies){
    return movies.map((movie) => {
        if(movie.poster_path){
            return `
            <div class="card">
                <div class="card-img">
                    <img src=${imgUrl + movie.poster_path} data-movie-id=${movie.id}/>
                </div>
                <div class="title">
                    <h3>${movie.title}</h3>
                </div>
                    <div class="expandMoreHolder">
                        <span expand-more data-hidetext="Show Less" data-showtext="Show More" data-target="${movie.id}" class="btn expand-more">Show More</span>
                    </div>
            </div>`;
        } 
        /*If there's not an image, it'll show one particular image*/
            else {
            return`
            <div class="card">
                <div class="card-img">
                    <img src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIHM28Y3I9ri330RjLPBizSZR_45Zlgh2J9Q&usqp=CAU data-movie-id=${movie.id}/>
                </div>
                <div class="title">
                    <h3>${movie.title}</h3>
                </div>
                    <div class="expandMoreHolder">
                        <span expand-more id="k" data-hidetext="Show Less" data-showtext="Show More" data-target="${movie.id}" class="btn expand-more">Show More</span>
                    </div>
            </div>`;
        }
           
    });
}
function showMore(movies){
    return movies.map((movie) => {
        return `
        <div class="modal">
        <div class="modal-content" id="${movie.id}">
            <div class="modal-header">
                <h2>${movie.title}</h2>
                <span class="close">x</span>
            </div>
            <div class="modal-body">
                <div class="card-img">
                    <img src=${imgUrl + movie.poster_path} data-movie-id=${movie.id}/>
                </div>
                <div class="description">
                    <p>${movie.overview}</p>
                    <div class="iframeContainer" id ="iframeContainer" ></div>
                </div>
            </div>
        </div>
        </div>
        `
    })
}
function handleError(error){
    console.log(error);
}

/* Listening for Clicks */ 
document.addEventListener('click', (event) => {

    const target =event.target;
    /*Home Button*/
    if(target.tagName.toLowerCase()==='span' && target.classList.contains('btn-home')) {
        location.reload();
    }
    /* Display Modal Cards */
    if(target.tagName.toLowerCase() === 'span' && target.classList.contains ('expand-more')) {
       
        var showMore = document.getElementById(target.dataset.target);
        var modal=showMore.parentElement;
        modal.classList.add('movie-contents')
        
        modal.appendChild(showMore)
    
        window.addEventListener('click', (e) => {
            /*Closing Modal clicking outside of the box*/
            if (e.target == modal) {
                modal.classList.remove('movie-contents') 
                /*Stopping the video once we leave modal*/
                $('iframe').attr('src', $('iframe').attr('src'));
                /*Calling this so that every time I have one video, not adding to the old one*/
                content.innerHTML=''                   
              }
              /*Closing Modal clicking on the X with class 'close'*/
              if(e.target.classList.contains('close')) {
                modal.classList.remove('movie-contents') 
                $('iframe').attr('src', $('iframe').attr('src'));
                content.innerHTML=''  
              }
        });
        /* Informations for movie trailers*/
        movieId = target.dataset.target
        
        const path = `/movie/${movieId}/videos`;
        const url = generateUrl(path);
        const content = showMore.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling.firstElementChild.nextElementSibling
        
        /*fetch trailer*/
        fetch(url)
        .then((res)=> res.json())
        .then((data) => createVideoTemplate(data,content))
        .catch((error) => {
            console.log(error)
        })
    
    }
}) 

function createVideoTemplate(data,content) {
        const videos = data.results;
        /*Data returns more video trailers, but I need only one that I will display*/
        const video = videos[0];
        const iframeContainer = document.createElement('div');
        const iframe = createIframe(video);
        iframeContainer.appendChild(iframe);
        content.appendChild(iframeContainer);
}
function createIframe(video){
        const videoKey = (video && video.key) || 'No key found!!!';
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube.com/embed/${videoKey}`
        iframe.width=350
        iframe.allowFullscreen = true;
        return iframe;
}
/*Home Page Display Movies 
Using simular functions*/
function createMovieContainerHome(movies,title = ''){
    const movieElements = document.createElement('div');
    movieElements.classList.add('movies');
    movieTemplate = `<div class="container">
    <p class="title-home">${title}</p>
        <section class="section-home"> 
            ${movieSelection(movies)} 
        </section>
        <section id="modal">
        ${showMore(movies)}
        </section>
        </div>
    `;
    var imagesWithoutCommas = movieTemplate.replace(/,/g, '');
    movieElements.innerHTML=imagesWithoutCommas; 
    return movieElements;
}
/*A new function were made, so that it can display title of data */
function renderMovies(data){
    const movies = data.results;
    const movieBlock = createMovieContainerHome(movies, this.title);
    movieContainer.appendChild(movieBlock);
    console.log(data);
}
function upcomingMovies(){
    const path = '/movie/upcoming'
    const url = generateUrl(path);
    const render = renderMovies.bind({title: 'Soon'})
    requestMovie (url, render, handleError)
}
function topMovies(){
    const path = '/movie/top_rated'
    const url = generateUrl(path); 
    const render = renderMovies.bind({title: 'Top Rated'})
    requestMovie (url, render, handleError)
}
function popularMovies(){
    const path = '/movie/popular'
    const url = generateUrl(path);
    const render = renderMovies.bind({title: 'Most Popular'})
    requestMovie (url, render, handleError)
}
function nowPlaying(){
    const path = '/movie/popular'
    const url = generateUrl(path);
    const render = renderMovies.bind({title: 'Now Playing'})
    requestMovie (url, render, handleError)
}
/*And finally, we're calling these functions*/
upcomingMovies();
topMovies(); 
popularMovies();
nowPlaying();


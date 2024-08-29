
const API_KEY = secrets.API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/discover/movie?sort_by=popularity.desc&include_adult=false&" + API_KEY;
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const SEARCH_URL = BASE_URL + "/search/movie?query=";
const FILTER = "&include_adult=false"
const GENRES = "&with_genres="

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagEl = document.getElementById('tags');
const headEl = document.getElementById('head');

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage = 1;
var nextPage = 2;
var prevPage = 3;
var lastURL = '';
var totalPages = 100;

const overlayEl = document.getElementById('overlay-content');

// Genres fetched using /genre/movie/list
const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]


var selectedGenre = [];

setGenre();
function setGenre(){
    tagEl.innerHTML='';
    genres.forEach(genre=>{
        const t = document.createElement('div');
        t.classList.add('tag');
        t.id = genre.id;
        t.innerText = genre.name;
        t.addEventListener('click',()=>{
            if (selectedGenre.includes(genre.id)){
                selectedGenre.forEach((id,idx)=>{
                    if(id==genre.id){
                        selectedGenre.splice(idx,1);
                    }
                })
            }
            else{
                selectedGenre.push(genre.id);
            }
            // console.log(selectedGenre);
            getMovies(API_URL + GENRES + encodeURI(selectedGenre.join(',')));
            highlightSelection()
        })

        tagEl.appendChild(t);

    })
}

function highlightSelection(){
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag=>{
        tag.classList.remove('highlight');
    })
    clearButton();
    if(selectedGenre.length!=0){
        selectedGenre.forEach(id=>{
            const highLightedTag = document.getElementById(id);
            highLightedTag.classList.add('highlight');
        })
    }
}

function clearButton(){
    let clearBtn = document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');
    }
    else{
        let clear = document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id='clear';
        clear.innerText="Clear x";
        clear.addEventListener('click',()=>{
            selectedGenre=[];
            setGenre(); //clearing all filter
            getMovies(API_URL); //populating random data again
        })
        tagEl.appendChild(clear);
    }
}

getMovies(API_URL);

function getMovies(url){
    lastURL = url;
    fetch(url).then(res => res.json()).then(data =>{
        console.log(data);
        if(data.results.length!=0){
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;
    
            current.innerText = currentPage;

            if (currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled');
              console.log("if condition checked")
            }
            else if (currentPage >= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled');
              console.log("else if condition checked")
            }
            else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled');
              console.log("else condition checked")
            }

            // to automatically shift back window to header section
            headEl.scrollIntoView({behavior:"smooth"});
            
        }
        else{
            main.innerHTML = `
            <h1 class="no-results"> NO RESULTS FOUND ! </h1>
            `
        }
    })
} 

function showMovies(data){
    main.innerHTML ='';
    data.forEach(movie => {
        const {title,poster_path,vote_average,overview,id} = movie; 
        // to skip those not having any poster image
        if (!poster_path) {
            return;
        }
        // console.log(movie);       
        const MovieEl = document.createElement('div');
        MovieEl.classList.add('movie');
        MovieEl.innerHTML = `
            <img src="${IMG_URL+poster_path}" alt="movie img"/>

            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
                <button class="know-more" id="${id}">Know More</button>
            </div> 
        `
        main.appendChild(MovieEl);

        document.getElementById(id).addEventListener('click',()=>{
            openNav(movie);
        })
    });
}

/* Open when someone clicks on the span element */
function openNav(movie) {
  let id = movie.id;
  let url = BASE_URL + '/movie/' + id + '/videos?' + API_KEY ; 
  fetch(url).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.results.length>0){
          var embed = [];
          var dots=[];
          data.results.forEach((video,idx)=>{
            let {name,key,site} = video;
            if(site=="YouTube"){
              embed.push(`
                    <iframe width="560" height="315" 
                    src="https://www.youtube.com/embed/${key}" 
                    title="${name}" class="embed hide" frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; 
                    encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                `)
              
              dots.push(`
                <span class="dot">${idx+1}</span>
                `)

              var content = `
              <h1 class="no-results">${movie.original_title}</h1>
              <br/>

              ${embed.join('')}
              <br/>
              
              <div class="dots">${dots.join('')}</div>
              `
              overlayEl.innerHTML = content;
              activeSlide = 0;
              showVideos();
            }
          })
      }
      else{
          overlayEl.innerHTML = `
          <h1 class="no-results"> NO RESULTS FOUND ! </h1>
          `
      }
  })
  document.getElementById("myNav").style.width = "100%";
}

var activeSlide = 0;
var totalVideos = 0;
function showVideos(){
  let embedClasses = document.querySelectorAll('.embed');
  let dots = document.querySelectorAll('.dot');

  totalVideos = embedClasses.length;
  embedClasses.forEach((embedTag,idx) => {
      if (activeSlide==idx){
        embedTag.classList.remove('hide');
        embedTag.classList.add('show');
      }
      else{
        embedTag.classList.remove('show');
        embedTag.classList.add('hide');
      }
  })

  dots.forEach((dotTag,idx) => {
    if (activeSlide==idx){
      dotTag.classList.add('active');
    }
    else{
      dotTag.classList.remove('active');
    }
  })
}

leftArrow = document.getElementById('left-arrow');
rightArrow = document.getElementById('right-arrow');

leftArrow.addEventListener('click',()=>{
  if (activeSlide > 0){
    activeSlide -- ;
  }
  else{
    activeSlide = totalVideos -1 ;
  }
  showVideos();
})

rightArrow.addEventListener('click',()=>{
  if (activeSlide < (totalVideos-1)){
    activeSlide ++ ;
  }
  else{
    activeSlide = 0;
  }
  showVideos();
})



/* Close when someone clicks on the "x" symbol inside the overlay */
function closeNav() {
  document.getElementById("myNav").style.width = "0%";
}

function getColor(vote){
    if (vote>=8){
        return "green";
    }
    else if (vote>=5){
        return "orange";
    }
    else{
        return "red";
    }
}


form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const searchTerm = search.value;
    selectedGenre=[];
    setGenre();
    if(searchTerm){
        getMovies(SEARCH_URL+searchTerm+"&"+API_KEY + FILTER);
    }
    else{
        getMovies(API_URL);
    }
})


next.addEventListener('click' , ()=>{
  if(nextPage<=totalPages){
        pageCall(nextPage);
  }
})

function pageCall(page){
  let urlSplit = lastURL.split('?');
  let queryParam = urlSplit[1].split('&');
  let key = queryParam[queryParam.length-1].split('=');
  if(key[0] != 'page'){
          let url = lastURL + "&page=" + page;
          getMovies(url);
  }
  else{
          key[1] = page;
          queryParam[queryParam.length-1] = key.join('=');
          urlSplit[1] = queryParam.join('&');
          let url = urlSplit.join('?');
          getMovies(url);      
  }
}


prev.addEventListener('click' , ()=>{
  if(prevPage>0){
          pageCall(prevPage);
  }
})
  


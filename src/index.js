
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css"
import { Notify } from 'notiflix/build/notiflix-notify-aio'
import "notiflix/dist/notiflix-3.2.5.min.css"




import fetchSearch from "./js/pixabayApi"


const searchFormRef = document.querySelector(`#search-form`)
const galleryRef = document.querySelector(`.gallery`)
const loadMoreBtn = document.querySelector('.btn-load-more')
const toBtnTop = document.querySelector('.btn-to-top')
const loading = document.querySelector('.loading')
const inputRef = document.querySelector(`[name="searchQuery"]`)


let simpleLightBox = null
let page = 1
let perPage = 40
let q = ''
let totalPages = 0

window.addEventListener('scroll', onScroll)
toBtnTop.addEventListener('click', onToTopBtn)
searchFormRef.addEventListener("submit", onSubmit)
loadMoreBtn.classList.add('is-hidden')

const SLBflow = () => {
    if(!simpleLightBox){
        simpleLightBox = new SimpleLightbox('.gallery a')
    } else {
        simpleLightBox.refresh()
    }
    
}

const load2 = async () => {
    try {
        const responseData = await fetchSearch(q, page, perPage);

        if(page === 1){
            galleryRef.innerHTML = ''
        }

        if (responseData.data && (!responseData.data.total || !responseData.data.hits.length)){
            Notify.failure("Sorry, there are no images matching your search query. Please try again.")
            return 
        }

        totalPages = Math.ceil(responseData.data.total / perPage);

        if(page === 1){
            Notify.success(`Hooray! We found ${responseData.data.total} images.`)
        }

        renderGallery(responseData.data.hits);
        SLBflow();

     
    } catch (error) {
        loadMoreBtn.classList.add('is-hidden')
        Notify.failure('We are sorry, but you have reached the end of search results.')
        console.warn(error)
        
    }
    finally{
        inputRef.removeAttribute("disabled")
            loading.classList.remove('show')
    }
}

function onToTopBtn() {
    if (window.pageYOffset > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

function onSubmit(ev){
    ev.preventDefault()
    if(inputRef.getAttribute("disabled")){
        return
    }
    q = inputRef.value.trim()
    loadMoreBtn.classList.add('is-hidden')
    loading.classList.remove('show')
    galleryRef.innerHTML = ''
    if(!q){
        return
    }
    inputRef.setAttribute("disabled","disabled")
    page = 1
    totalPages = 0
    load2()
}

function onScroll() {
    const scrolled = window.pageYOffset
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement

    if (scrolled > clientHeight) {
        toBtnTop.classList.add('btn-to-top--visible')
    }
    if (scrolled < clientHeight) {
        toBtnTop.classList.remove('btn-to-top--visible')
    }
    let isDisabled = inputRef.getAttribute("disabled")
    if(isDisabled){
        return
    }
    if (clientHeight + scrollTop >= scrollHeight - 5 && page > 0) {
        showLoading()
    }
}

function showLoading() {
    if(loading.classList.contains('show')){
        return 
    }
    loading.classList.add('show')
    inputRef.setAttribute("disabled","disabled")
	setTimeout (onLoadMoreBtn, 500)
}

function onLoadMoreBtn() {
    page += 1
    if (page > totalPages) {
        loadMoreBtn.classList.add('is-hidden')
        inputRef.removeAttribute("disabled")
        loading.classList.remove('show')
        Notify.warning("Something bad happened. Check the browser console")
        page=0
        return
       
    }
    load2()
}



function renderGallery(images) {
    const markup = images.map(image => {
        const { id, largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image
        return `
            <a class="gallery__link" href="${largeImageURL}">
     <div class="photo-card" id=${id}>
            <img class="photo-card__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
      <div class="info">
            <p class="info-item">
                <b>Likes</b>${likes}</p>
            <p class="info-item">
                <b>Views</b>${views}</p>
            <p class="info-item">
                <b>Comments</b>${comments}</p>
            <p class="info-item">
                <b>Downloads</b>${downloads}</p>
        </div>
    </div>
    </a>`}).join('')

    galleryRef.insertAdjacentHTML('beforeend', markup)
}
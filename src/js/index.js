import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SearchApiService from './fetchSearchQuery';
import { renderGalleryCardItems } from './cardTempletes';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

const axios = require('axios').default;

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  btnLoad: document.querySelector('.load-more'),
  photoCard: document.querySelector('.photo-card'),
};

let gal = new SimpleLightbox('.gallery', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const searchApiService = new SearchApiService();

refs.form.addEventListener('submit', onSubmitForm);

AOS.init();

function onSubmitForm(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  searchApiService.query = event.currentTarget.elements.searchQuery.value;
  if (!searchApiService.query) {
    return;
  }
  gal.refresh();
  searchApiService.resetPage();
  searchApiService.fetchSearchQuery().then(response).catch(reject);
  // console.log(searchApiService.fetchSearchQuery().then(response).catch(reject));
}

function response(response) {
  if (searchApiService.page - 1 === 1 && response.totalHits !== 0) {
    Notify.success(`Hooray! We found ${response.totalHits} images.`);
  }
  if (response.totalHits === 0) {
    reject();
  } else if (response.hits.length === 0) {
    Notify.info('These are all the pictures what we found. Try something else');
    refs.btnLoad.style.display = 'none';
  } else {
    createGalleryCardList(response);
    activationButton();
  }
}

function reject() {
  Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function createGalleryCardList(items) {
  const galleryList = renderGalleryCardItems(items);
  refs.gallery.insertAdjacentHTML('beforeend', galleryList);
}

function activationButton() {
  refs.btnLoad.style.display = 'block';
  refs.btnLoad.addEventListener('click', onClickLoadButton);
}

function onClickLoadButton() {
  searchApiService.fetchSearchQuery().then(response).catch(reject);
}

// function onScrollGallery(event) {
//   const scroll = document.documentElement.getBoundingClientRect();

//   if (scroll.bottom < document.documentElement.clientHeight + 100) {
//     searchApiService.fetchSearchQuery().then(response).catch(reject);
//   }
// }

// window.addEventListener('scroll', onScrollGallery);

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SearchApiService from './fetchSearchQuery';
import { renderGalleryCardItems } from './cardTempletes';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  btnLoad: document.querySelector('.load-more'),
};

let gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const searchApiService = new SearchApiService();

refs.form.addEventListener('submit', onSubmitForm);

function onSubmitForm(event) {
  event.preventDefault();
  refs.gallery.innerHTML = '';
  searchApiService.query = event.currentTarget.elements.searchQuery.value;
  if (!searchApiService.query) {
    return;
  }
  gallery.refresh();
  searchApiService.resetPage();
  searchApiService.fetchSearchQuery().then(response).catch(reject);
  // console.log(searchApiService.fetchSearchQuery().then(response).catch(reject));
}

function response(response) {
  if (response.totalHits === 0) {
    reject();
  } else {
    createGalleryCardList(response);
    Notify.success(`Hooray! We found ${response.totalHits} images.`);
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
  // gallery.refresh();
  searchApiService.fetchSearchQuery().then(response).catch(reject);
}

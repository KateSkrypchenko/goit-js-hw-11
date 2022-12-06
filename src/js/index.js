// import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { SearchApiService } from './fetchSearchQuery';
import { renderGalleryCardItems } from './cardTempletes';
import { NotifyMessage } from './notifyMessage';

const refs = {
  gallery: document.querySelector('.gallery'),
  form: document.querySelector('.search-form'),
  btnLoad: document.querySelector('.load-more'),
  photoCard: document.querySelector('.photo-card'),
};

const gallery = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const searchApiService = new SearchApiService();
const notify = new NotifyMessage();

refs.form.addEventListener('submit', onSubmitForm);

AOS.init();

function onSubmitForm(event) {
  refs.btnLoad.style.display = 'none';
  event.preventDefault();
  refs.gallery.innerHTML = '';
  searchApiService.query = event.currentTarget.elements.searchQuery.value.trim();
  if (!searchApiService.query) {
    return;
  }
  searchApiService.resetPage();
  searchApiService.fetchSearchQuery().then(response).catch(reject);
}

function response(response) {
  console.log(response.totalHits);
  console.log(searchApiService.par_page);
  if (searchApiService.page - 1 === 1 && response.totalHits !== 0) {
    notify.success(response.totalHits);
  }
  if (response.totalHits === 0) {
    reject();
  } else if (response.hits.length === 0) {
    notify.info();
    refs.btnLoad.style.display = 'none';
  } else if (response.totalHits <= searchApiService.par_page) {
    createGalleryCardList(response);
    notify.info();
  } else {
    createGalleryCardList(response);
    activationButton();
  }
}

function reject() {
  notify.failure();
}

function createGalleryCardList(items) {
  const galleryList = renderGalleryCardItems(items);
  refs.gallery.insertAdjacentHTML('beforeend', galleryList);
  gallery.refresh();
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

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import throttle from 'lodash.throttle';

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
const THROTTLE_DELAY = 300;

refs.form.addEventListener('submit', onSubmitForm);
window.addEventListener('scroll', throttle(checkPosition, THROTTLE_DELAY));
window.addEventListener('resize', throttle(checkPosition, THROTTLE_DELAY));

AOS.init();

async function onSubmitForm(event) {
  try {
    //  refs.btnLoad.classList.add('hidden')
    event.preventDefault();
    refs.gallery.innerHTML = '';
    searchApiService.query = event.currentTarget.searchQuery.value.trim();
    searchApiService.totalHits = 0;
    if (!searchApiService.query) {
      return;
    }
    searchApiService.resetPage();
    const fetch = await searchApiService.fetchSearchQuery();
    response(fetch);
  } catch (error) {
    reject();
  }
}

function response(response) {
  if (searchApiService.page - 1 === 1 && response.totalHits !== 0) {
    notify.success(response.totalHits);
  }
  if (response.totalHits === 0) {
    reject();
  } else if (response.hits.length === 0) {
    notify.info();
    // refs.btnLoad.classList.add('hidden')
  } else if (response.totalHits <= searchApiService.par_page) {
    createGalleryCardList(response);
    notify.info();
  } else {
    createGalleryCardList(response);
    // activationButton();
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

// function activationButton() {
//   refs.btnLoad.classList.remove('hidden')
//   refs.btnLoad.addEventListener('click', onClickLoadButton);
// }

// async function onClickLoadButton() {
//   try {
//     const fetch = await searchApiService.fetchSearchQuery();
//     response(fetch);
//   } catch (error) {
//     reject();
//   }
// }

async function checkPosition() {
  const height = document.body.offsetHeight;
  const screenHeight = window.innerHeight;
  const scrolled = window.scrollY;
  const threshold = height - screenHeight / 4;
  const position = scrolled + screenHeight;
  if (position >= threshold) {
    await searchApiService.fetchSearchQuery().then(response).catch(reject);
  }
}

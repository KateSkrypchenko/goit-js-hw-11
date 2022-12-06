import { Notify } from 'notiflix/build/notiflix-notify-aio';

export class NotifyMessage {
  success(count) {
    Notify.success(`Hooray! We found ${count} images.`);
  }

  info() {
    Notify.info('These are all the pictures what we found. Try something else');
  }

  failure() {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
  }
}

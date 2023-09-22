import Notiflix from 'notiflix';
import { getPhoto } from './pixabyAPI';
import { renderPhoto } from './createMarkup';
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const load = document.querySelector('.load-more');

let pages = 1;
let end = false;

form.addEventListener('submit', submitSearch);
load.addEventListener('click', loadPhoto);

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function submitSearch(event) {
  event.preventDefault();
  pages = 1;
  gallery.innerHTML = '';
  load.classList.add('is-hidden');
  end = false;

  getPhoto(form.elements.searchQuery.value, pages).then(photos => {
    if (photos.data.hits.length > 0) {
      load.classList.remove('is-hidden');
      renderPhoto(photos.data.hits);
      endPhoto(photos.data.totalHits);
      messageTotalHits(photos.data.totalHits);
      lightbox.refresh();
    } else {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  });
}

function loadPhoto() {
  pages += 1;
  getPhoto(form.elements.searchQuery.value, pages).then(photos => {
    endPhoto(photos.data.totalHits);
    renderPhoto(photos.data.hits);
    lightbox.refresh();
    slowScroll();
  });
}

function endPhoto(totalHits) {
  if (totalHits < 40 * pages) {
    end = true;
    load.classList.add('is-hidden');
  }
}

function messageTotalHits(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  document.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

document.addEventListener(
  'scroll',
  debounce(() => {
    const contentHeight = gallery.offsetHeight;
    const yOffset = window.scrollY;
    const window_height = window.innerHeight;

    if (yOffset + window_height >= contentHeight) {
      if (!end) {
        loadPhoto();
      } else {
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  }, 1000)
);

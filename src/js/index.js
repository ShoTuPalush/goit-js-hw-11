import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import debounce from 'lodash.debounce';
import { getPhoto } from './pixabyAPI';
import { renderPhoto } from './createMarkup';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const backdrop = document.querySelector('.backdrop');

form.addEventListener('submit', submitSearch);

let pages = 1;
let end = false;
var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

function submitSearch(event) {
  event.preventDefault();
  pages = 1;
  gallery.innerHTML = '';
  end = false;

  getPhoto(form.elements.searchQuery.value, pages)
    .then(loader.classList.remove('is-hidden'))
    .then(backdrop.classList.remove('is-hidden'))
    .then(async photos => {
      if (photos.data.hits.length > 0) {
        renderPhoto(photos.data.hits);
        endPhoto(photos.data.totalHits);
        messageTotalHits(photos.data.totalHits);
        await lightbox.refresh();
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .finally(() => {
      backdrop.classList.add('is-hidden');
      loader.classList.add('is-hidden');
    });
}

function loadPhoto() {
  pages += 1;
  getPhoto(form.elements.searchQuery.value, pages)
    .then(loader.classList.remove('is-hidden'))
    .then(backdrop.classList.remove('is-hidden'))
    .then(async photos => {
      endPhoto(photos.data.totalHits);
      renderPhoto(photos.data.hits);
      await lightbox.refresh();
      slowScroll();
    })
    .finally(() => {
      backdrop.classList.add('is-hidden');
      loader.classList.add('is-hidden');
    });
}

function endPhoto(totalHits) {
  if (totalHits < 40 * pages) {
    end = true;
  }
}

function messageTotalHits(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
}

function slowScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
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
  }, 500)
);

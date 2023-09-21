import axios from 'axios';
import notiflix from 'notiflix';

const API_KEY = '39589484-3fe05f6fbca1a92c7774e2aca';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const load = document.querySelector('.load-more');

let pages = 1;

form.addEventListener('submit', submitSearch);
load.addEventListener('click', loadPhoto);

function submitSearch(event) {
  gallery.innerHTML = '';
  renderPhoto();
  event.preventDefault();
  gallery.innerHTML = '';
}

async function renderPhoto(pages) {
  const params = {
    page: pages,
    key: API_KEY,
    q: form.elements.searchQuery.value,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  await axios
    .get('https://pixabay.com/api/', { params })
    .then(photos => getPhoto(photos.data.hits))
    .catch(error =>
      console.log(
        'Sorry, there are no images matching your search query. Please try again.'
      )
    );
}

function getPhoto(data) {
  if (data.length > 0) {
    const markup = data
      .map(
        photo =>
          `<a href='${photo.largeImageURL}' class='card-link'>
        <div class="photo-card">
            <img src="${photo.webformatURL}" alt="${photo.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>${photo.likes} Likes</b>
                </p>
                <p class="info-item">
                    <b>${photo.views} Views</b>
                </p>
                <p class="info-item">
                    <b>${photo.comments} Comments</b>
                </p>
                <p class="info-item">
                    <b>${photo.downloads} Downloads</b>
                </p>
            </div>
        </div>
    </a>`
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    console.log('asd');
  }
}

function loadPhoto() {
  pages += 1;
  renderPhoto(pages);
}

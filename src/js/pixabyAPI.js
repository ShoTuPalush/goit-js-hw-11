import axios from 'axios';
const API_KEY = '39589484-3fe05f6fbca1a92c7774e2aca';

export async function getPhoto(searchQuery, pages) {
  const params = {
    key: API_KEY,
    q: searchQuery,
    page: pages,
    per_page: 40,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };

  return await axios.get('https://pixabay.com/api/', { params });
}

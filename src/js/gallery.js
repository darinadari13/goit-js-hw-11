import { PixabayAPI } from "./pixabayAPI";
import Notiflix from 'notiflix';
import { createGalleryCards } from './galleryCard';

const refs = {
  searchFormEl: document.querySelector('#search-form'),
  galleryListEl: document.querySelector('.gallery'),
  loadMoreBtnEl: document.querySelector('.load-more'),
  searchBtnEl: document.querySelector('.btn-search'),
}

const pixabayAPI = new PixabayAPI();

const showLastPageNotification = () => {
  Notiflix.Notify.info(`Were sorry, but you've reached the end of search results.`);
}

const onSearchSubmit = async e => {
  e.preventDefault();
  refs.loadMoreBtnEl.disabled = true;
  refs.loadMoreBtnEl.classList.add('is-hidden');

  const { value } = e.target.elements.searchQuery;

  pixabayAPI.query = value;
  pixabayAPI.page = 1;

  if (!value.trim()) {
    Notiflix.Notify.failure('Sorry, type something');
    refs.loadMoreBtnEl.disabled = true;
    return;
  }

  try {
    const { data } = await pixabayAPI.fetchPhotos();
    const { hits, totalHits } = data


    if (hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      refs.galleryListEl.innerHTML = '';
      refs.searchBtnEl.disabled = false;
      return;
    }

    if (totalHits <= 40) {
      showLastPageNotification()
      refs.searchBtnEl.disabled = false;
    } else {
      refs.loadMoreBtnEl.disabled = false;
      refs.loadMoreBtnEl.classList.remove('is-hidden');
    }

    refs.galleryListEl.innerHTML = createGalleryCards(hits);

    e.target.reset();
  } catch (err) {
    console.log(err);
  }
};


const onLoadMoreClick = async e => {
  pixabayAPI.page += 1;

  const { data } = await pixabayAPI.fetchPhotos();
  const { hits, totalHits } = data

  refs.galleryListEl.insertAdjacentHTML('beforeend', createGalleryCards(hits));



  const isLastPage = Math.ceil(totalHits / 40) === pixabayAPI.page

  if (isLastPage) {
    showLastPageNotification()
    refs.loadMoreBtnEl.classList.add('is-hidden')
  }
};

refs.searchFormEl.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtnEl.addEventListener('click', onLoadMoreClick);

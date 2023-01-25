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

const appendRandomPhotos = async () => {
  try {
    const { data } = await pixabayAPI.fetchRandomPhotos();

    refs.galleryListEl.innerHTML = createGalleryCards(data.hits);
    refs.loadMoreBtnEl.disabled = 'true';
  } catch (err) {
    console.log(err);
  }
};

// appendRandomPhotos();

const onSearchSubmit = async e => {
  e.preventDefault();

  pixabayAPI.query = e.target.elements.searchQuery.value;
  pixabayAPI.page = 1;

  if (pixabayAPI.query === '') {
    Notiflix.Notify.failure('Sorry, type something');
    refs.loadMoreBtnEl.disabled = 'true';
  }

  try {
    const { data } = await pixabayAPI.fetchPhotos();
    if (data.hits.length === 0) {
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');

      e.target.reset();
      refs.galleryListEl.innerHTML = '';
      refs.loadMoreBtnEl.classList.add('is-hidden');
      return;
    }
    if (data.totalHits > 40) {
      e.target.reset();
      refs.loadMoreBtnEl.classList.remove('is-hidden')
    } else {
      refs.loadMoreBtnEl.classList.add('is-hidden')
    }
    if (data.totalHits < 40) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    refs.galleryListEl.innerHTML = createGalleryCards(data.hits);


  } catch (err) {
    console.log(err);
  }
};

const onLoadMoreClick = async e => {
  e.target.disabled = true;
  e.target.classList.add('disabled');

  pixabayAPI.page += 1;
  try {
    const { data } = await pixabayAPI.fetchPhotos();
    refs.galleryListEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));



    const { height: cardHeight } = document
      .querySelector(".gallery")
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

    const totalPage = Math.ceil(data.totalHits / 40);

    if (totalPage === pixabayAPI.page) {
      refs.loadMoreBtnEl.disabled = 'true';
      Notiflix.Notify.info(`Were sorry, but you've reached the end of search results.`);
    }
  }
  catch (err) {
    console.log(err);
  };
  e.target.disabled = false;
  e.target.classList.remove('disabled');
};

refs.searchFormEl.addEventListener('submit', onSearchSubmit);
refs.loadMoreBtnEl.addEventListener('click', onLoadMoreClick);

'use strict'

export const createGalleryCards = cardInfo => {
  const cardArr = cardInfo.map(el => {
    return `<div class="photo-card">
  <img class="gallery-img" src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${el.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${el.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${el.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${el.downloads}
    </p>
  </div>
</div>`
  });

  return cardArr.join('');

};
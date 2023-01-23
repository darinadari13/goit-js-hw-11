'use strict'
import axios from 'axios';

export class PixabayAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '33058317-2be3cc902f47206f95f4430ca';

  constructor() {
    this.page = 1;
    this.query = null;
  }

  fetchPhotos() {
    const searchParams = {
      params: {
        q: this.query,
        page: this.page,
        per_page: 40,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        key: PixabayAPI.API_KEY,
      },
    };
    return axios.get(`${PixabayAPI.BASE_URL}`, searchParams);
  }


  fetchRandomPhotos() {
    const randomPage = Math.ceil((1 + Math.random() * (12 + 1 - 1)));
    const searchParams = {
      params: {
        page: randomPage,
        per_page: 40,
        category: 'fashion',
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        key: PixabayAPI.API_KEY,
      },
    };
    return axios.get(`${PixabayAPI.BASE_URL}`, searchParams);
  }
}


import axios from 'axios';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const URL = 'https://pixabay.com/api/';
const KEY = '36286705-391446d46affc3bb812fbccbc';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('.input'),
  btnSearch: document.querySelector('.button-search'),
  btnLoad: document.querySelector('.button-load'),
  galleryImage: document.querySelector('.gallery'),
};

let inputValue = '';
let page = 1;
let totalImages = 0;
let hits = 0;

refs.form.addEventListener('submit', onFormSubmit);
refs.input.addEventListener('input', debounce(onInput, 250));
refs.btnLoad.addEventListener('click', onLoadMore);

async function searchImages() {
  try {
    Loading.standard('Loading...');

    const response = await axios.get(
      `${URL}?key=${KEY}&q=${inputValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );
    if (response.data.totalHits === 0) {
      Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      refs.form.reset();
    }
    hits += response.data.hits.length;
    totalImages = response.data.totalHits;

    return response.data.hits;
  } catch (error) {
    Notify.error('Download error, try again later');
    console.log(error);
  } finally {
    Loading.remove();
  }
}

function onInput(evt) {
  refs.btnSearch.removeAttribute('disabled');
  inputValue = evt.target.value.trim();
}

async function onFormSubmit(evt) {
  evt.preventDefault();
  refs.btnLoad.classList.add('load-more');
  refs.galleryImage.innerHTML = '';
  if (!inputValue && hits === 0) {
    Notify.warning('Please, enter what you want to find ');
    return;
  }
  const array = await searchImages();

  if (totalImages !== 0 || totalImages === hits || totalImages > hits) {
    Notify.info(`Hooray! We found ${totalImages} images.`);
  }

  if ((totalImages !== 0 && totalImages === hits) || totalImages > hits) {
    refs.btnLoad.classList.remove('load-more');
  }

  markupGallery(array);
  makeMessage();
  addClassToBtnLoad();

  refs.btnSearch.setAttribute('disabled', '');
}
const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 150,
  loop: false,
});

function markupGallery(array) {
  const markup = array
    .map(elem => {
      return `<div class="photo-card"> <a class="gallery__link" href="${elem.largeImageURL}" >
  <img class="gallery__image" src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy"/></a>
  <div class="info">
    <p class="info-item">
      <b>Likes:</b> ${elem.likes}
    </p>
    <p class="info-item">
      <b>Views:</b> ${elem.views}
    </p>
    <p class="info-item">
      <b>Comments:</b> ${elem.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b> ${elem.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
  refs.galleryImage.insertAdjacentHTML('beforeend', markup);
  gallery.refresh();
}

async function onLoadMore() {
  page += 1;
  const array = await searchImages();
  markupGallery(array);
  makeMessage();
  addClassToBtnLoad();
}

function makeMessage() {
  if (hits === totalImages && hits !== 0) {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

function addClassToBtnLoad() {
  if (hits === totalImages) {
    refs.btnLoad.classList.add('load-more');
  }
}

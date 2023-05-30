import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { searchImagesHandler } from './searchImagesHandler';
import { markupGallery } from './markup';

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
const gallery = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 150,
  loop: false,
});

refs.form.addEventListener('submit', onFormSubmit);
refs.input.addEventListener('input', () =>
  refs.btnSearch.removeAttribute('disabled')
);
refs.btnLoad.addEventListener('click', onLoadMore);

async function onFormSubmit(evt) {
  evt.preventDefault();

  refs.galleryImage.innerHTML = '';
  page = 1;
  hits = 0;
  inputValue = evt.target.searchQuery.value.trim();

  if (!inputValue) {
    Notify.warning('Please, enter what you want to find ');
    return;
  }

  const resp = await searchImagesHandler(inputValue, page);

  hits += resp.hits.length;
  totalImages = resp.totalHits;

  makeCheckingForm();
  markupGallery(resp.hits, refs.galleryImage);
  gallery.refresh();
  makeMessage();
  addClassToBtnLoad();
  refs.btnSearch.setAttribute('disabled', '');
}

async function onLoadMore() {
  page += 1;
  const resp = await searchImagesHandler(inputValue, page);
  hits += resp.hits.length;
  markupGallery(resp.hits, refs.galleryImage);
  gallery.refresh();
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

function makeCheckingForm() {
  if (totalImages === 0) {
    Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.form.reset();
    return;
  }
  if (totalImages !== 0 || totalImages === hits || totalImages > hits) {
    Notify.info(`Hooray! We found ${totalImages} images.`);
  }

  if ((totalImages !== 0 && totalImages === hits) || totalImages > hits) {
    refs.btnLoad.classList.remove('load-more');
  }
}

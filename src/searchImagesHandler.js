import { searchImages } from './searchImages';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export async function searchImagesHandler(inputValue, page) {
  try {
    Loading.standard('Loading...');

    const response = await searchImages(inputValue, page);

    return response.data;
  } catch (error) {
    Notify.error('Download error, try again later');
    console.log(error);
  } finally {
    Loading.remove();
  }
}

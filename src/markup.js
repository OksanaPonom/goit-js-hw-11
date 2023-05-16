export function markupGallery(array, gallery) {
  const markup = array
    .map(elem => {
      return `<div class="photo-card"> <a class="gallery__link" href="${elem.largeImageURL}" >
  <img class="gallery__image" src="${elem.webformatURL}" alt="${elem.tags}" loading="lazy" /></a>
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
  gallery.insertAdjacentHTML('beforeend', markup);
  //   refs.galleryImage.insertAdjacentHTML('beforeend', markup);
  //   gallery.refresh();
}

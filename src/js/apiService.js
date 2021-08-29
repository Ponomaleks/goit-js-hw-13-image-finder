// let Handlebars = require('handlebars');
import searchFormTemplate from '../templates/search-form.hbs';
import gallerytemplate from '../templates/image-card.hbs';
import * as basicLightbox from 'basiclightbox';
// import '../sass/';

class Pixabay {
  constructor(perPage, key) {
    this.PER_PAGE = perPage;
    this.KEY = key;
    this.refs = {
      searchFormContainer: document.getElementById('search-form-container'),
      galleryContainer: document.querySelector('.gallery'),
    };
  }

  renderSearchForm() {
    this.SearchFormMarkup = searchFormTemplate();
    this.refs.searchFormContainer.insertAdjacentHTML('afterbegin', this.SearchFormMarkup);
    this.refs.searchFormRef = document.getElementById('search-form');
    // this.refs.submitBtn = document.querySelector('.submit-btn');
    this.refs.searchFormRef.addEventListener('submit', this.onSearch.bind(this));
  }

  onSearch(e) {
    e.preventDefault();
    if (e.currentTarget.elements.query.value) {
      e.preventDefault();
      this.REQ = e.currentTarget.elements.query.value;
      this.PAGE = 1;
      fetch(
        `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.REQ}&page=${this.PAGE}&per_page=${this.PER_PAGE}&key=${this.KEY}`,
      )
        .then(responce => responce.json())
        .then(data => {
          const searchResult = data.hits;
          this.galleryMarkup = gallerytemplate(searchResult);
          this.refs.galleryContainer.innerHTML = '';
          this.refs.galleryContainer.insertAdjacentHTML('afterbegin', this.galleryMarkup);
          this.renderLoadMoreBtn();
          this.refs.galleryContainer.addEventListener('click', this.onGalleryClick.bind(this));
        });
    } else {
      this.refs.galleryContainer.innerHTML = '';
    }
  }

  renderLoadMoreBtn() {
    this.refs.galleryContainer.insertAdjacentHTML(
      'beforeend',
      '<button id="load-more-btn">load More</button>',
    );
    this.refs.LoadMoreBtn = document.getElementById('load-more-btn');
    this.refs.LoadMoreBtn.addEventListener('click', this.getNextPage.bind(this));
  }

  getNextPage() {
    this.PAGE = this.PAGE += 1;
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.REQ}&page=${this.PAGE}&per_page=${this.PER_PAGE}&key=${this.KEY}`,
    )
      .then(responce => responce.json())
      .then(data => {
        const newPageStart = document.createElement('div');
        newPageStart.setAttribute('id', `start-${this.PAGE}-page`);
        this.refs.LoadMoreBtn.replaceWith(newPageStart);
        const searchResult = data.hits;
        this.galleryMarkup = gallerytemplate(searchResult);
        this.refs.galleryContainer.insertAdjacentHTML('beforeend', this.galleryMarkup);
        this.renderLoadMoreBtn();
        newPageStart.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
  }

  onGalleryClick(e) {
    if (e.target.nodeName !== 'IMG') {
      return;
    }

    const instance = basicLightbox.create(`
        <img src="${e.target.dataset.src}" width="800" height="600">
    `);
    instance.show();
  }
}

const pixabayApi = new Pixabay(12, '23058122-31f355087b2f6a9d816f84625');
pixabayApi.renderSearchForm();

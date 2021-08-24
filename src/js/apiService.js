// let Handlebars = require('handlebars');
import searchForm from '../templates/search-form.hbs';
class Pixabay {
  constructor(req) {
    this.REQ = req;
    this.PAGE = 1;
    this.PER_PAGE = 3;
    this.KEY = '23058122-31f355087b2f6a9d816f84625';
    this.refs = {
      searchFormContainer: document.getElementById('search-form-container'),
    };
  }

  //   getRefs() {
  //     this.refs = {
  //       searchFormContainer: document.getElementById('search-form-container'),
  //     };
  //   }

  renderSearchForm() {
    this.SearchFormMarkup = searchForm();
    this.refs.searchFormContainer.insertAdjacentHTML('afterbegin', this.SearchFormMarkup);
  }

  getResponce(req) {
    this.PAGE = 1;
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.REQ}&page=${this.PAGE}&per_page=${this.PER_PAGE}&key=${this.KEY}`,
    )
      .then(responce => responce.json())
      .then(console.log);
  }

  getNextPage() {
    this.PAGE = this.PAGE += 1;
    fetch(
      `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.REQ}&page=${this.PAGE}&per_page=${this.PER_PAGE}&key=${this.KEY}`,
    )
      .then(responce => responce.json())
      .then(console.log);
  }
}

let req = 'water';
const pixabayApi = new Pixabay(req, 1);

// pixabayApi.getRefs();
pixabayApi.renderSearchForm();
pixabayApi.getResponce(req);
pixabayApi.getNextPage(req);

req = 'cats';
pixabayApi.getResponce(req);
pixabayApi.getNextPage(req);

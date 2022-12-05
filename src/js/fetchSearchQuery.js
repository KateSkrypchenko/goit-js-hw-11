const axios = require('axios').default;

export default class SearchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchSearchQuery() {
    try {
      console.log(this);
      const KEY = '31749564-17a32f2ca24bf9158a5d3e6cb';
      const URL = `https://pixabay.com/api/?key=${KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;
      const response = await axios.get(URL);
      this.incrementPage();
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

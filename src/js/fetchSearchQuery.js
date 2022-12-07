const axios = require('axios').default;

export class SearchApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.par_page = 40;
    this.key = '31749564-17a32f2ca24bf9158a5d3e6cb';
    this.baseURL = 'https://pixabay.com/api/';
  }

  async fetchSearchQuery() {
    try {
      const URL = `${this.baseURL}?key=${this.key}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.par_page}&page=${this.page}`;
      const response = await axios.get(URL);
      this.incrementPage();
      return response.data;
    } catch (error) {
      throw new Error(error);
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

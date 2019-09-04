import axios from 'axios';

export class MarvelService {

  // --------------------------------------------------
  // ENDPOINTS
  // --------------------------------------------------
  static get ENDPOINTS() {
    return {
      comic: 'https://gateway.marvel.com:443/v1/public/comics',
      comics: 'https://gateway.marvel.com:443/v1/public/comics',
      character: 'https://gateway.marvel.com:443/v1/public/characters',
      characters: 'https://gateway.marvel.com:443/v1/public/characters',
    };
  }

  // --------------------------------------------------
  // SETUP
  // --------------------------------------------------
  constructor(config) {
    this.apiKey = config.apiKey;
  }

  // --------------------------------------------------
  // AUTHENTICATION
  // --------------------------------------------------
  getAuthConfig() {
    return { apikey: this.apiKey };
  }

  // --------------------------------------------------
  // CHARACTERS-RELATED METHODS
  // --------------------------------------------------
  getCharacters(config = {}) {
    const myRequestParams = {
      apikey: this.apiKey,
      ...config
    };  
    const endpoint = MarvelService.ENDPOINTS.characters;
    return axios.get(endpoint, { params: myRequestParams })
      .then((response) => {
        return response.data.data;
      });
  }

  getComics(config = {}) {
    const endpoint = MarvelService.ENDPOINTS.comics;
    return axios.get(endpoint, { 
        params: {
          apikey: this.apiKey,
          ...config
        }
      })
      .then((response) => {
        return response.data.data;
      });
  }

  getCharacter(id, config = {}) {
    // console.warn('Whoops, it looks like / this method hasn\'t been implemented yet.');
    // - Create the `params` object.
    const myRequestParams = {
      apikey: this.apiKey,
      ...config
    };
    // - Extract the correct endpoint from `ENDPOINTS`; add the `id`.
    const endpoint = MarvelService.ENDPOINTS.characters + '/' + id;
    return axios.get(endpoint, {params: myRequestParams})
      .then((response) => {
        return response.data.data;
      })
    // TODO:

    // - Dispatch a request using `axios.get()`.
    // - Parse and return the response.
  }

  getComic(id, config = {}) {
    const myRequestParams = {
      apikey: this.apiKey,
      ...config
      };
    const endpoint = MarvelService.ENDPOINTS.comic + '/' + id;
    return axios.get(endpoint, {params: myRequestParams})
      .then((response) => {
        return response.data.data;
      })
  }
}

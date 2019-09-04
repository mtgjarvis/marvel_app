import React, { Component } from 'react';
import './App.css';
import { ResultsList } from './components/ResultsList';
import { ResultDetails } from './components/ResultDetails';
import { SearchBar } from './components/SearchBar';
import { Error } from './components/Error';
import { Loading } from './components/Loading';
import { MarvelService } from './services/MarvelService';
import { LoadMore } from './components/LoadMore';

class App extends Component {
  // --------------------------------------------------
  // SETUP
  // --------------------------------------------------
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: '',
      seachType: 'Characters',
      results: [],
      selectedResult: null,
    };

    this.fetchCharacters = this.fetchCharacters.bind(this);
    this.fetchCharacter = this.fetchCharacter.bind(this);
    this.fetchMoreCharacters = this.fetchMoreCharacters.bind(this);
    this.fetchMoreComics = this.fetchMoreComics.bind(this);
    this.fetchComic = this.fetchComic.bind(this);
    this.fetchComics = this.fetchComics.bind(this);

    this.marvelService = new MarvelService({
      apiKey: this.props.apiKey,
    });
  }

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  render() {
    const resultsElem = this.state.hasError
      ? <Error />
      : this.state.isLoading
        ? <Loading searchTerm={ this.state.searchTerm } />
        : (
          <ResultsList
            results={ this.state.results }
            searchType= { this.props.searchType }
            searchTerm={ this.state.searchTerm }
            onResultClick={ this.state.searchType === 'Character'
              ? this.fetchCharacter
              : this.fetchComic
            }
          />
        );

    const detailsElem = this.state.selectedResult
      ? (
        <ResultDetails
          image={ this.state.selectedResult.thumbnail.path +  '.' + this.state.selectedResult.thumbnail.extension }
          title={ this.state.selectedResult.name }
          description={ this.state.selectedResult.description }
          stories={ this.state.selectedResult.stories }
          urls={ this.state.selectedResult.urls }
          onClose={ () => this.setState({ selectedResult: null } )}
        />
      )
      : '';

    let loadMoreElm = '';
    if (this.state.canLoadMore) {
      loadMoreElm = <LoadMore onClick={ 
        this.state.searchType === 'Characters'
        ? this.fetchMoreCharacters
        : this.fetchMoreComics 
      }/>;
    }

    return (
      <section className="app">
        <SearchBar
          searchTerm={ this.state.searchTerm }
          searchType={this.state.searchType}
          onSubmit={ (searchTerm) => this.setState({ searchTerm }) }
          onSelect={ (searchType) => this.setState({ searchType }) }
        />
        { resultsElem }
        { loadMoreElm }
        { detailsElem }
      </section>
    );
  }

  // --------------------------------------------------
  // LIFECYCLE
  // --------------------------------------------------
  componentDidUpdate(_, prevState) {
    const searchTerm = this.state.searchTerm;
    const prevSearchTerm = prevState.searchTerm;
    const searchType = this.state.searchType;
    const prevSearchType = prevState.searchType;

    if (
      searchTerm
      && (searchTerm !== prevSearchTerm || searchType !== prevSearchType)
    ) {
      if (searchType === 'Characters') {
        this.fetchCharacters();
      } else {
        this.fetchComics();
      }
    }
  }

  // --------------------------------------------------
  // FETCHING CHARACTERS
  // --------------------------------------------------
  fetchCharacters() {
    this.setState({ isLoading: true });
    this.marvelService.getCharacters({
      nameStartsWith: this.state.searchTerm,
    })
      .then((data) => {
        console.log(data.data)
        this.setState({
          results: data.results,
          canLoadMore: data.total > data.offset + data.count,
          isLoading: false
        });
      })  
      .catch((err) => {
        this.setState({ hasError: true });
      })
  };

  fetchCharacter(id) {
    console.warn('Whoops, it looks like this method hasn\'t been implemented yet');
    this.marvelService.getCharacter(id)
      .then((data) => {
        const result = data.results[0];
        this.setState({ selectedResult: result })
      })
      .catch((err) => {
        this.setState({ hasError: true })
      });
  };

  fetchMoreCharacters() {
    this.marvelService.getCharacters({
      nameStartsWith: this.state.searchTerm,
      offset: this.state.results.length,
    })
    .then((data) => {
      this.setState({
        results: [...this.state.results, ...data.results],
        canLoadMore : data.total > data.offset + data.count,
      })
    })
    .catch((err) => {
      console.log(err);
      this.setState({ hasError: true });
    })
  }

  fetchComics() {
    this.setState({ isLoading: true, hasError: false });
    this.marvelService.getComics({
      titleStartsWith: this.state.searchTerm
    })
    .then((data) => {
      this.setState({
        results: data.results,
        canLoadMore: data.total > data.offset + data.count,
        isLoading: false
      });
    })
    .catch((err) => {
      console.log(err);
      this.setState({ hasError: true });
    });
  }

  fetchMoreComics() {
    this.marvelService.getComics({
      titleStartsWith: this.state.searchTerm,
      offset: this.state.results.length,
    })
    .then((data) => {
      this.setState({
        results: [...this.state.results, ...data.results],
        canLoadMore : data.total > data.offset + data.count,
      })
    })
    .catch((err) => {
      console.log(err);
      this.setState({ hasError: true });
    })
  }

  fetchComic(id) {
    this.marvelService.getComic(id)
      .then((data) => {
        const result = data.results[0];
        this.setState({ selectedResult: result })
      })
      .catch((err) => {
        this.setState({ hasError: true })
      });
  };

}

export default App;

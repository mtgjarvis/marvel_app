import React, { Component } from 'react';
import { ResultCard } from './ResultCard';
import { NoResults } from './NoResults';

export class ResultsList extends Component {
  render() {
    const resultsElems = this.props.results.length  //props are always passed from parent component
      ? this.props.results.map((result) => {
        return (
          <ResultCard
            key={ result.id }
            image={ result.thumbnail.path + '.' + result.thumbnail.extension }
            title={ this.props.searchType === 'Characters' ? result.title : result.name }
            onClick={ this.props.onResultClick(result.id) }
          />
        );
      })
      : <NoResults searchTerm={ this.props.searchTerm } />;

    return (
      <section className="results-list">
        { resultsElems }
      </section>
    );
  }
}

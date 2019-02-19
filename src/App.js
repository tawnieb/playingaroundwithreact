import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';

class App extends Component {

constructor(props) {
  //super(props) set this.props in constructor in case you want to access 
  // them there, otherwise they would be undefined
  super(props);
  this.state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
  };
}

setSearchTopStories = (result) => {
  const { hits, page } = result;
  const { searchKey, results } = this.state;
  const oldHits = results && results[searchKey] ? results[searchKey].hits : [];
  const updatedHits = [...oldHits, ...hits];
  this.setState({
    results: { 
      ...results, 
      [searchKey]: { hits: updatedHits, page }
    }
  });
}

fetchSearchTopStories = (searchTerm, page = 0) => {
  fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories(result))
    .catch(error => error)
}

componentDidMount() {
  const { searchTerm } = this.state;
  this.setState({ searchKey: searchTerm })
  this.fetchSearchTopStories(searchTerm);
}

onSearchSubmit = (event) => {
  const { searchTerm } = this.state;
  this.setState({ searchKey: searchTerm });
  this.fetchSearchTopStories(searchTerm);
  event.preventDefault();
}

//filter function returns new list instead of mutating old one
onDismiss = (id) => {
  const isNotId = item => item.objectID !== id;
  const updatedHits = this.state.result.hits.filter(isNotId);
  this.setState({
    result: { ...this.state.result, hits: updatedHits }
  });
}

onSearchChange = (event) => {
  this.setState({ searchTerm: event.target.value })
}

  //use map to render a list of items as HTML elements
  render() {
    //destructuring
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;
    return  (
      <div className="page">
        <div className="interactions">
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange}
          onSubmit={this.onSearchSubmit}
        >
          Search
        </Search>
        </div>
        { result &&
          <Table 
              list={result.hits}
              onDismiss={this.onDismiss}
          />
        }
      <div className='interactions'>
        <Button onClick={() => 
          this.fetchSearchTopStories(searchTerm, page + 1)}>
          More
        </Button>
      </div>
      </div>
    );  
  }
}

  const Search = ({ value, onChange, onSubmit, children }) =>
        <form onSubmit={onSubmit}>
          <input 
            type="text"
            value={value}
            onChange={onChange}
          />
          <button type="submit">
            {children}
          </button>
        </form>

  const Table = ({ list, onDismiss }) => 
        <div className="table">
          {list.map(item => 
            <div key={item.objectID} className="table-row">
              <span style={{ width: '40%' }}>
                <a href={item.url}>{item.title}</a>
              </span>
              <span style={{ width: '30% ' }}>
                {item.author}
              </span>
              <span style={{ width: '10%' }}>
                {item.num_comments}
              </span>
              <span style={{ width: '10%' }}>
                {item.points}
              </span>
              <span>
              <Button 
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              > 
                Dismiss
              </Button>
              </span>
            </div>
          )}
        </div>

const Button = ({ onClick, className = '', children }) => 
        <button
          onClick={onClick}
          className={className}
          type="button"
        >
          {children}
        </button>
  
  export default App;
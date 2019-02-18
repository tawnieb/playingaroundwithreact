import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'http://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const isSearched = searchTerm => item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

constructor(props) {
  //super(props) set this.props in constructor in case you want to access 
  // them there, otherwise they would be undefined
  super(props);
  this.state = {
    result: null,
    searchTerm: DEFAULT_QUERY,
  };
}

setSearchTopStories = (result) => {
  this.setState({ result });
}

componentDidMount() {
  const { searchTerm } = this.state;

fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
  .then(response => response.json())
  .then(result => this.setSearchTopStories(result))
  .catch(error => error);
}

//filter function returns new list instead of mutating old one
onDismiss = (id) => {
  const isNotId = item => item.objectID !== id;
  const updatedHits = this.state.result.hits.filter(isNotId);
  this.setState({ ... });
}

onSearchChange = (event) => {
  this.setState({ searchTerm: event.target.value })
}

  //use map to render a list of items as HTML elements
  render() {
    //destructuring
    const { searchTerm, result } = this.state;
    if(!result) { return null; }

    return  (
      <div className="page">
        <div className="interactions">
        <Search 
          value={searchTerm}
          onChange={this.onSearchChange}
        >
          Search
        </Search>
        </div>
        <Table 
          list={result.hits}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );  
  }
}

  const Search = ({ value, onChange, children }) =>
        <form>
          { children } <input 
            type="text"
            value={value}
            onChange={onChange}
          />
        </form>

  const Table = ({ list, pattern, onDismiss }) => 
        <div className="table">
          {list.filter(isSearched(pattern)).map(item => 
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
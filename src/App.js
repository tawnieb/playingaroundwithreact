import React, { Component } from 'react';
import './App.css';

const list = [
  {
    title: 'React',
    url: 'http://reactjs.org',
    author: 'Jordon Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'http://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]

const isSearched = searchTerm => item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase());

class App extends Component {

constructor(props) {
  //super(props) set this.props in constructor in case you want to access 
  // them there, otherwise they would be undefined
  super(props);
  this.state = {
    list,
    searchTerm: '',
  };
}

//filter function returns new list instead of mutating old one
onDismiss = (id) => {
  const updatedList = 
    this.state.list.filter(
      item => item.objectID !== id
    );
  this.setState({ list: updatedList });
}

onSearchChange = (event) => {
  this.setState({ searchTerm: event.target.value })
}

  //use map to render a list of items as HTML elements
  render() {
    //destructuring
    const { searchTerm, list } = this.state;
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
          list={list}
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
              <span style={{ width: '30% '}}>
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
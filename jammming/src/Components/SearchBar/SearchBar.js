import React from 'react';
import ReactDOM from 'react-dom';
import './SearchBar.css';

export class SearchBar extends React.Component{

  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }
  search() {
    this.props.onSearch();
  }

  handleTermChange(e) {
    e.persist();
    this.props.onTextChange(e, e.target.value);
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"  onKeyUp={this.handleTermChange}/>
        <a onClick={this.search}>SEARCH</a>
      </div>
    )
  }
}

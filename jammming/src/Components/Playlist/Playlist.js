import React from 'react';
import ReactDOM from 'react-dom';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component{
  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this);
  }
  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }
  render() {
    return(
      <div className="Playlist">
        <h5>Playlist Name</h5>
        <input defaultValue={"New Playlist"} onChange={this.handleNameChange} onClick=''/>
        <a className="Playlist-save" onClick={this.props.onSave}>{this.props.playlistButtonText}</a>
        <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemovable={this.props.isRemovable}/>
      </div>
    );
  }
}

export default Playlist;

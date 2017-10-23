import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Track} from '../Track/Track.js'
import './TrackList.css';

class TrackList extends Component {
  render() {
    return(
      <div className="TrackList">
        {
          this.props.tracks.map(track =>
            (
              <Track track={track} onRemove={this.props.onRemove} previewTrack={this.props.previewTrack}
                trackIdPlaying={this.props.trackIdPlaying} key={track.id} onAdd={this.props.onAdd}
                isRemovable={this.props.isRemovable}/>)
          )
        }
      </div>
    )
  }
}

export default TrackList;

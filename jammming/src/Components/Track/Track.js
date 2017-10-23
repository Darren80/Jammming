import React from 'react';
import ReactDOM from 'react-dom';
import './Track.css';

export class Track extends React.Component{

  constructor(props) {
    super(props);
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.renderAction = this.renderAction.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.button = this.button.bind(this);
  }

  renderAction() {
    if (!this.props.isRemovable) {
      this.addTrack();
    } else {
      this.removeTrack();
    }
  }

  addTrack() {
    this.props.onAdd(this.props.track);
  }

  removeTrack() {
    this.props.onRemove(this.props.track);
  }

  playTrack() {
    this.props.previewTrack(this.props.track);
  }

  button() {
    let buttonText = (this.props.trackIdPlaying == this.props.track.id) ? 'Pause' : 'Play'; //Is the track playing?
    if (this.props.previewTrack) { //Is preview track defined (not if its a playlist item)?
      return this.props.track.preview_url ? (<button className="button" onClick={this.playTrack}>{buttonText}</button>) :
      (<button className="button hide" onClick={this.playTrack}>Play</button>); //Does the track have a preview_url?
    }
  }

  render() {

    return (
    <div className="Track">
      {this.button()}
      <div className="Track-information">
        <h3>{this.props.track.name}</h3>
        <p>{this.props.track.artist} | {this.props.track.album}</p>
      </div>
      <a className="Track-action" onClick={this.renderAction}>{this.props.isRemovable ? '-' : '+'}</a>
    </div>
    )
  }
}

import React, { Component } from 'react';
import {SearchBar} from './Components/SearchBar/SearchBar';
import SearchResults from './Components/SearchResults/SearchResults';
import Playlist from './Components/Playlist/Playlist';
import Spotify from './utils/Spotify';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      trackAudio: '',
      trackIdPlaying: '',
      searchQuery: '',
      playlistButtonText: 'SAVE TO SPOTIFY'
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.playTrack = this.playTrack.bind(this);
    this.updateSearchQuery = this.updateSearchQuery.bind(this);
  }

  addTrack(newTrack) {
    //Check if the track is already in the playlist list by comparing ID's
    if (!this.state.playlistTracks.some(track => (newTrack.id === track.id))) {
      //Add the new track to the playlist tracks
      this.setState(prevState => ({ playlistTracks: [...prevState.playlistTracks, newTrack]}));
      //console.log(this.state.playlistTracks.some(track => (newTrack.id === track.id))); //Debug
    }
  }
  removeTrack(oldTrack) {
    this.setState(prevState => (
      { playlistTracks: prevState.playlistTracks.filter(track => (oldTrack.id != track.id))
      }));
  }
  updatePlaylistName(newName) {
    this.setState({playlistName: newName});
  }
  savePlaylist() {
    //IDK
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.createPlaylist(this.state.playlistName, trackURIs).then(success => {
      if (success) {
        this.setState({playlistTracks: [], playlistButtonText: 'Success 🎵'}, () => {
          window.setTimeout(() => {
            this.setState({playlistButtonText: 'SAVE TO SPOTIFY'});
          }, 2 * 1000); //No reason to wait for setState in order to do this. I just think this looks cool.
        });
    }
    });
  }

  playTrack(track) {

    let music = new Audio(track.preview_url + '.mp3'); //HTTPDOMAudio Object

    //Is this track already playing? It is if the track and trackPlaying ID's match.
    if (track.id == this.state.trackIdPlaying) {
      //Pause or play music
      let audio = this.state.trackAudio;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
        this.setState({trackIdPlaying: ''});
      }
    } else {
      let audio = this.state.trackAudio;
      try { audio.pause() } catch(error) {} //In the case of an error, then no music was playing.
      //Play a new track
      this.setState({
        trackAudio: music, //Put the HTTPDOMAudio Object into state.
        trackIdPlaying: track.id //Tells us which track the audio object is playing.
      }, () => {
          audio = this.state.trackAudio; //Audio must be reassigned since setState changed it.
          audio.play();

          audio.onended = () => { //Triggered when song ends.
            console.log('Song has ended.');
            this.setState({trackIdPlaying: ''});
          };
    });
    }

  }
  updateSearchQuery(e, newSearchQuery) {
    this.setState({searchQuery: newSearchQuery}, () => {
      //console.log(e.which);
      if (e.which == 13) { //Enter key
        this.search();
      }
    });
  }
  search() {
    //If there's a song playing then pause it
    try {
      this.setState({trackIdPlaying: ''});
      this.state.trackAudio.pause();
    } catch(error) {}

    Spotify.search(this.state.searchQuery).then(searchResults => {
      if (Array.isArray(searchResults)) {
        this.setState({searchResults: searchResults});
        console.log(searchResults);
      } else {
        console.log('searchResults is not an array');
      }
    }, failure => {console.log(failure)});


  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} onTextChange={this.updateSearchQuery}/>
          <div className="App-playlist">

            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} isRemovable={false}
              previewTrack={this.playTrack} trackIdPlaying={this.state.trackIdPlaying} />

            <Playlist playlistName={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} playlistTracks={this.state.playlistTracks} isRemovable={true}
              playlistButtonText={this.state.playlistButtonText}/>
          </div>
        </div>
      </div>
    );
  }
}




export default App;

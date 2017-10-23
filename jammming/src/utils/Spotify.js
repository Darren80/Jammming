let accessToken = '';
let clientID = '015ebdbf76f34b9f8f14d50a9713a859';
let responseType = 'token';
let redirectUri = 'http://localhost:3000/';
let state = () => { //Random 32bit number for the state
  let array = new Uint32Array(2);
  window.crypto.getRandomValues(array);
  return Math.round(array[0] * array[1]);
};
let scope = 'playlist-modify-public playlist-modify-private';

let SpotifyUrl = 'https://accounts.spotify.com/authorize?' + 'client_id=' + clientID + '&response_type=' +
responseType + '&redirect_uri=' + redirectUri + '&state=' + state() + '&scope=' + scope;
let trackArray;

let Spotify = {

  getAccessToken() {
    if (accessToken) {
      return accessToken;
  } else if (window.location.href.match(/access_token=([^&]*)/)) {

      //accessToken = window.location.href.match(/access_token=([^&]*)/);
      let expirationTime = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => {
        window.history.pushState('Access Token', null, '/');
      }, 3600 * 1000); //Clear history entry if the  access token has expired
      return window.location.href.match(/access_token=([^&]*)/); //returns the access token

  } else {
      window.location.href = SpotifyUrl;
    }
  },

  async search(searchQuery) {
    //accessToken = this.getAccessToken(accessToken, SpotifyUrl);
    accessToken = this.getAccessToken();
    let uri = 'https://api.spotify.com/v1/search?type=track&q=' + searchQuery;

    try {
      let response = await fetch(uri, {
        headers: {
          Authorization: `Bearer ${accessToken[1]}`
        }
      });
      if (response.status == 401) {
        window.history.pushState('Access Token', null, '/');
        accessToken = '';
        this.getAccessToken();
      }
      if (response.ok) {
        let responseJson = await response.json();
        console.log(responseJson);
        //Map out the returned object
        let tracks = responseJson.tracks.items.map((track, index) => {
          return ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            preview_url: track.preview_url
          });
        });

        return tracks;
      }
      //throw new Error('Request failed');
    } catch(error) {
        console.log(error);
    }
  },
  async createPlaylist(playlistName, trackURIs) {
    if (trackURIs.length === 0) {
      return; //Exit if not track in playlist
    }

    accessToken = this.getAccessToken();
    let myHeaders = new Headers();
    myHeaders.append('Authorization', `Bearer ${accessToken[1]}`)
    let userID;

    let response = await fetch('https://api.spotify.com/v1/me', {headers: myHeaders})
    if (response.ok) {
      let responseJson = await response.json();
      userID = responseJson.id;
    }
    //Create a new playlist
    response = await fetch('https://api.spotify.com/v1/users/' + userID + '/playlists', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken[1]}`
      },
      method: 'POST',
      body: JSON.stringify({name: playlistName})
    });
    let playlistID;
    if (response.ok) {
      let responseJson = await response.json();
      playlistID = responseJson.id;
    }

    response = await fetch('https://api.spotify.com/v1/users/'+ userID +'/playlists/'+ playlistID +'/tracks', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken[1]}`
      },
      method: 'POST',
      body: JSON.stringify(trackURIs)
    });

    if (response.ok) {
      console.log('successful! ' + playlistID);
      return await response.json;
    }

  }
};

export default Spotify;

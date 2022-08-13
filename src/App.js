import React from "react";
import axios from "axios";

const CLIENT_ID = "2f1466b032bd43ba98236f5157ed4b1e";
const REDIRECT_URI = "http://localhost:3000";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-top-read";

export default class Car extends React.Component {
  constructor() {
    super();
    this.state = { token: "" };
  }

  getToken = () => {
    debugger;
    const hash = window.location.hash;
    let token = window.localStorage.getItem("token");

    if (token && hash) {
      token = hash
        .substring(1)
        .split("&")
        .find((elem) => elem.startsWith("access_token"))
        .split("=")[1];

      window.location.hash = "";
      window.localStorage.setItem("token", token);
    }

    this.setState(
      {
        token: token,
      },
      () => {
        console.log(this.state.token);
      }
    );
  };

  searchArtists = async (e) => {
    debugger;
    e.preventDefault();
    const { data } = await axios.get(
      "https://api.spotify.com/v1/me/top/artists",
      {
        headers: {
          Authorization: `Bearer ${this.state.token}`,
        },
      }
    );

    this.setState(
      {
        artist: data.items,
      },
      () => console.log(this.state.artist)
    );
  };

  render() {
    return (
      <div>
        <button onClick={this.getToken}>Ando despechá</button>
        <header className="App-header">
          <h1>Spotify React</h1>
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}
          >
            Login to Spotify
          </a>
          : <button>Logout</button>
        </header>
        <form onSubmit={this.searchArtists}>
          <button type={"submit"}>Search</button>
        </form>
      </div>
    );
  }
}

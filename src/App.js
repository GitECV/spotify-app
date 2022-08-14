import {useEffect, useState} from "react";
import './App.css';
import axios from 'axios';

function App() {
    const CLIENT_ID = "2f1466b032bd43ba98236f5157ed4b1e"
    const REDIRECT_URI = "https://spotify-d3ng1m67k-gitecv.vercel.app/"
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE = "token"
    const SCOPES = "user-top-read"

    const [token, setToken] = useState("")
    const [artists, setArtists] = useState([])

    // Genera el token y lo almacena en el session storage
    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

            window.location.hash = ""
            window.localStorage.setItem("token", token)
        }

        setToken(token)

    }, [])

    // Permite eliminar el token y salir de la sesión
    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }

    const searchArtists = async (e) => {
      debugger;
      console.log(token)
        e.preventDefault()
        const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        setArtists(data.items)
    }

    const renderArtists = () => {
        return artists.map(artist => (
            <div key={artist.name}>
                {artist.name}
            </div>
        ))
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>Spotify React</h1>
                {!token ?
                    <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`}>Login
                        to Spotify</a>
                    : <button onClick={logout}>Logout</button>}

                {token ?
                    <form onSubmit={searchArtists}>
                        <button type={"submit"}>Search</button>
                    </form>

                    : <h2>Please login</h2>
                }

                {renderArtists()}

            </header>
        </div>
    );
}

export default App;

import {initializeApp} from "firebase/app";
import {getAuth, signInWithPopup, OAuthProvider} from "firebase/auth";
import axios from "axios";
import React, {useState} from 'react';

import logo from './logo_duo_full.svg';
import './App.css';

function App() {

    const [accessToken, setAccessToken] = useState(null)
    const [idToken, setIdToken] = useState(null)
    const firebaseConfig = {
        apiKey: "<your api key>",
        authDomain: "<your auth domain>",
        projectId: "<your project id>",
        storageBucket: "<your storage bucket>",
        messagingSenderId: "<your message sender id>",
        appId: "<your app id>"
    };
    const providerId = '<your provider id>'
    const app = initializeApp(firebaseConfig);
    const provider = new OAuthProvider(providerId);

    const apiGwDomain = "https://<your api gateway url>"

    const callApiGateway = () => {
        const token = idToken || ''
        axios
            .get(`${apiGwDomain}/?token=${token}`)
            .then((res) => {
                console.log(res)
                document.getElementById('responseMessage').innerText =
                    `Hello ${res.data.name}! Your email is ${res.data.email}!`
            })
            .catch((err) => {
                console.log(err)
                document.getElementById('responseMessage').innerText = `Got error: ${err.message}`
            });
    }

    const logIn = () => {
        const auth = getAuth(app);
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;

                setAccessToken(accessToken)
                setIdToken(idToken)
                console.log('User was authorized successfully!')
            })
            .catch((error) => {
                console.log(`Authorization failed: ${error}`)
            });
    }

    const logOut = () => {
        setIdToken(null)
        setAccessToken(null)
        document.getElementById('responseMessage').innerText = ''
        console.log("Logout success!")
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                {idToken == null ?
                    <button onClick={logIn} className="App-ripple-button">Log in</button>
                    : <button onClick={logOut} className="App-ripple-button">Log out</button>
                }
                <button onClick={callApiGateway} className="App-ripple-button">Call API-Gateway</button>
                <label id="responseMessage" className="App-label"></label>
            </header>
        </div>
    );
}

export default App;

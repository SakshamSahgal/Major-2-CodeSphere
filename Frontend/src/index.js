import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

if (process.env.NODE_ENV === 'development') {
    console.log("Runnning in Development Mode");
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_LOCALHOST;
}
else {
    console.log("Runnning in Production Mode");
    axios.defaults.baseURL = process.env.REACT_APP_SERVER_HOSTED_ON;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
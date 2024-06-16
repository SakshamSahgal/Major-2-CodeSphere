import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = process.env.REACT_APP_SERVER_URL;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <App />
);
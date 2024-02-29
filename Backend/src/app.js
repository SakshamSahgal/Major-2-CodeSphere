const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const expressWs = require('express-ws');
const path = require('path');

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
expressWs(app);
// add static folder as build
app.use(express.static(path.join(__dirname, "..", 'build')));

module.exports = { app };
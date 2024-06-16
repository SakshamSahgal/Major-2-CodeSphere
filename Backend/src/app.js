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
// add static folder as public (this will be used for things like temporary codebase)
app.use(express.static(path.join(__dirname, "..", 'public')));
// add static folder as build (this will be used to serve the react app and it is created when the docker image is built)
app.use(express.static(path.join(__dirname, "..", 'build')));

module.exports = { app };
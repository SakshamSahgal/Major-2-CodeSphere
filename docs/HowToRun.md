
# How To Run Docker Container Locally

`NOTE` : Make sure you have`Docker` installed

1. goto `root` directory.
2. run `docker build -t testimage .` to build the docker image.
3. run `docker run -p 8080:8080 testimage` to run the image.
4. You can then access the webapp from `http://localhost:8080/`

# To run Node Backend

`NOTE` : Make sure you have `Node 20` and `npm` installed

1. `cd Backend`
2. `npm install`
3. create a `.env`
4. save the required `.env` parameters
5. `node src/index.js`

# To run React Frontend

1. `cd Frontend`
2. `npm install`
3. create a `.env`
4. save the required `.env` parameters
5. npm start
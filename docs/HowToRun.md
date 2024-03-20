# How To Run Docker Container Locally

`NOTE` : Make sure you have`Docker` installed

1. create a `.env` in /Backend
2. save the `.env` with the [required parameters](./Envs/Backend.env)
3. Make sure that there is a `public/TemperoryCodeBase` folder in `Backend`, if not make it.
4. go to the `root` directory.
5. run `docker build -t testimage .` to build the docker image.
6. run `docker run -p 8080:8080 testimage` to run the image.
7. You can then access the web-app from `http://localhost:8080/`

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
4. save the `.env` with [required parameters](./Envs/Frontend.env)
5. npm start
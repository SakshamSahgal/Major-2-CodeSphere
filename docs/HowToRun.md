# How To Run Docker Container Locally

`NOTE` : Make sure you have`Docker` installed

1. create a `.env` in /Backend
2. save the `.env` with the [required parameters](./Envs/Backend.env)
3. go to the `root` directory.
4. run `docker build -t testimage .` to build the docker image.
5. run `docker run -p 8080:8080 testimage` to run the image.
6. You can then access the web-app from `http://localhost:8080/`

# To run React Frontend

1. `cd Frontend`
2. `npm install`
3. create a `.env`
4. save the `.env` with [required parameters](./Envs/Frontend.env)
5. npm start
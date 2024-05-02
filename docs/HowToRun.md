# How To Run Docker Container Locally

`NOTE` : Make sure you have`Docker` installed

1. To `Build` and `run` the docker image paste this in one line -
```
docker build
 --build-arg PORT=8080
 --build-arg CORS_ORIGIN=http://localhost:3000
 --build-arg DB_USERNAME=<username>
 --build-arg DB_PASSWORD=<password>
 --build-arg BackendHost=http://localhost:8080
 --build-arg FrontendHost=http://localhost:3000
 --build-arg JWT_SECRET_KEY=<secret>
 --build-arg OPENAI_API_KEY=<OPEN-AI-KEY>
 --build-arg PingBotDuration=300000
 --build-arg MemoryLimitForOutputFileInBytes=31457280
 -t testimage . ; docker run -p 8080:8080 testimage
 
```

4. You can then access the web-app from `http://localhost:8080`
5. This will use the static build from react in the `build` folder for frontend.

# To run React Frontend

1. `cd Frontend`
2. `npm install`
3. create a `.env`
4. save the `.env` with [required parameters](./Envs/Frontend.env)
5. npm start
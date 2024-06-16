
# Explanation of each Build Argument

1. PORT
	1. This environment variable tells the backend, which port to run the node application (server) on.
2. CORS_ORIGIN
	1. This is used to allow CORS to not block resource sharing when react frontend is running locally and is requesting from backend.
	2. value of this is of no use during deployment because the deployed docker images uses the static frontend build from the react app. (CORS doesn't block requests from static files from the backend.)
3. DB_USERNAME
	1. This is used to specify the `username` to connect to mongo DB.
4. DB_PASSWORD
	1. This is used to specify the `password` to connect to mongo DB.
5. BackendHost
	1. This is used by `pingbot` to ping to the URL.
	2. This is also used by backend to get the server URL while writing static output files in `TemporaryCodebase`. 
6. JWT_SECRET_KEY
	1. Secret key that is used to encrypt payload to get JWT token.
7. GEMINI_API_KEY
	1. Used to specify the API key for GEMINI API.
8. PingBotDuration
	1. Used to specify the duration in milliseconds in which the ping-bot will ping.
9. MemoryLimitForOutputFileInBytes
	1. Specifies the memory limit for output file while running the CPP file and writing its output stream to a file.
10. REACT_APP_SERVER_URL
	1. Used in the react frontend as environment variables (to be baked while static file building).
	2. This is used to by frontend to connect to backend.
	3. For running locally use - `http://localhost:8080`
	4. For deployment use - `https://codesphere-1pt9.onrender.com`
11. REACT_APP_SERVER_WS_URL
	1. Used in the react frontend as environment variables (to be baked into the static file while static file building).
	2. This is used to by frontend to connect ws to backend.
	3. For running locally use - `ws://localhost:8080`
	4. For deployment use - `wss://codesphere-1pt9.onrender.com`
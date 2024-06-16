# Use an official Node.js runtime as a base image
FROM node:20

# Install gcc to compile C++ code
RUN apt-get update
RUN apt-get install -y gcc g++
RUN apt-get install dos2unix

# Define build-time variables that users can pass to the builder with the docker build command using the --build-arg <varname>=<value> flag
ARG PORT
ARG CORS_ORIGIN
ARG DB_USERNAME
ARG DB_PASSWORD
ARG BackendHost
ARG JWT_SECRET_KEY
ARG GEMINI_API_KEY
ARG PingBotDuration
ARG MemoryLimitForOutputFileInBytes
ARG Server
ARG REACT_APP_SERVER_URL
ARG REACT_APP_SERVER_WS_URL

# Set environment variables using build-time variables
ENV PORT ${PORT}
ENV CORS_ORIGIN ${CORS_ORIGIN}
ENV DB_USERNAME ${DB_USERNAME}
ENV DB_PASSWORD ${DB_PASSWORD}
ENV BackendHost ${BackendHost}
ENV JWT_SECRET_KEY ${JWT_SECRET_KEY}
ENV GEMINI_API_KEY ${GEMINI_API_KEY}
ENV PingBotDuration ${PingBotDuration}
ENV MemoryLimitForOutputFileInBytes ${MemoryLimitForOutputFileInBytes}
ENV Server ${Server}

# Set the working directory in the container
WORKDIR /app

# Copy all the contents inside the Backend directory and put them in the container app directory
COPY Backend/ .

# Copy Frontend Folder
COPY Frontend/ ./Frontend

#setting the working directory to the Frontend directory
WORKDIR /app/Frontend

#create a .env file in the Frontend directory
RUN echo "REACT_APP_SERVER_URL=${REACT_APP_SERVER_URL}" >> .env \
    && echo "REACT_APP_SERVER_WS_URL=${REACT_APP_SERVER_WS_URL}" >> .env

#Run npm install in the Frontend directory
RUN npm install

#Run npm run build in the container app directory
RUN npm run build

# COPY the build folder from the Frontend directory to the app directory
RUN cp -r /app/Frontend/build /app/build

# Set the working directory in the container
WORKDIR /app

#delete the frontend directory
RUN rm -r /app/Frontend

# Install Node.js dependencies in the container app directory (backend)
RUN npm install

# Make public/TemporaryCodeBase folder if it doesn't already exist
RUN mkdir -p public/TemporaryCodeBase

# To avoid carriage return issues between Windows and Linux
RUN dos2unix src/Code/script.sh

# Make the script executable in the container
RUN chmod +x src/Code/script.sh

# Expose the port your app runs on
EXPOSE 8080

# Command to run your application
CMD ["node", "src/index.js"]
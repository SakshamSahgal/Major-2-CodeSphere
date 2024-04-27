# Use an official Node.js runtime as a base image
FROM node:20

# Install gcc to compile C++ code
RUN apt-get update
RUN apt-get install -y gcc g++
RUN apt-get install dos2unix

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY Backend/package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the Backend folder content (except dockerignore contents) to the working directory
COPY Backend .

# Define build arguments
ARG PORT
ARG CORS_ORIGIN
ARG DB_USERNAME
ARG DB_PASSWORD
ARG BackendHost
ARG FrontendHost
ARG JWT_SECRET_KEY
ARG OPENAI_API_KEY
ARG PingBotDuration
ARG MemoryLimitForOutputFileInBytes

# Create .env file with build arguments
RUN echo "PORT=${PORT}" >> .env \
    && echo "CORS_ORIGIN=${CORS_ORIGIN}" >> .env \
    && echo "DB_USERNAME=${DB_USERNAME}" >> .env \
    && echo "DB_PASSWORD=${DB_PASSWORD}" >> .env \
    && echo "BackendHost=${BackendHost}" >> .env \
    && echo "FrontendHost=${FrontendHost}" >> .env \
    && echo "JWT_SECRET_KEY=${JWT_SECRET_KEY}" >> .env \
    && echo "OPENAI_API_KEY=${OPENAI_API_KEY}" >> .env \
    && echo "PingBotDuration=${PingBotDuration}" >> .env \
    && echo "MemoryLimitForOutputFileInBytes=${MemoryLimitForOutputFileInBytes}" >> .env


# Make public/TemporaryCodeBase folder if it doesn't already exist
RUN mkdir -p public/TemporaryCodeBase

# To avoid carriage return issues between Windows and Linux
RUN dos2unix src/Code/script.sh

# Make the script executable in the container
RUN chmod +x src/Code/script.sh

# Expose the port your app runs on
EXPOSE 8080

#Check if .env file is created
RUN cat .env

# Command to run your application
CMD ["node", "src/index.js"]

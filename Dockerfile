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

# Create a script to write build arguments to .env file
RUN echo "\
PORT=$PORT\n\
CORS_ORIGIN=$CORS_ORIGIN\n\
DB_USERNAME=$DB_USERNAME\n\
DB_PASSWORD=$DB_PASSWORD\n\
BackendHost=$BackendHost\n\
FrontendHost=$FrontendHost\n\
JWT_SECRET_KEY=$JWT_SECRET_KEY\n\
OPENAI_API_KEY=$OPENAI_API_KEY\n\
PingBotDuration=$PingBotDuration\n\
MemoryLimitForOutputFileInBytes=$MemoryLimitForOutputFileInBytes\n\
" > .env

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

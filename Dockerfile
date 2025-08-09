FROM alpine:3.22.1

# Define environment variable
ENV NODE_ENV=production \
    NODE_NO_WARNNINGS=1 \
    NPM_CONFIG_LOGLEVEL=warn \
    SUPPRESS_NO_CONFIG_WARNINNG=true \ 
    NODE_VERSION=20.19.4 \ 
    NPM_VERSION=11.5.1

RUN apk add --no-cache nodejs@${NODE_VERSION} npm@${NPM_VERSION}

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --no-optional && \
    npm cache clean --force && \
    apk del npm

# Copy the rest of the application code
COPY . .

# Expose the ports the app runs on
EXPOSE 8080 8000 9000


# Command to run the application
CMD ["node", "main.js"]

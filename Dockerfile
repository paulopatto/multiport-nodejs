FROM alpine:3.20.7

# Define environment variable
ENV NODE_ENV=production \
    NODE_NO_WARNNINGS=1 \
    NPM_CONFIG_LOGLEVEL=warn \
    SUPPRESS_NO_CONFIG_WARNINNG=true \ 
    NODE_VERSION=20.15.1-r0 \ 
    NPM_VERSION=10.9.1-r0

RUN apk add --no-cache "nodejs==${NODE_VERSION}" "npm==${NPM_VERSION}"

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --no-optional && \
    npm cache clean --force && \
    apk del npm

# Copy the rest of the application code
COPY *.js ./

# Expose the ports the app runs on
EXPOSE 8080 8000 9000


# Command to run the application
CMD ["node", "main.js"]

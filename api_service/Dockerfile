# Stage: Depedency download
###########################
FROM node:18-alpine AS dependecy-stage

# Create app directory
WORKDIR /app

# Copy all source code to workdir
COPY --chown=node:node package.json ./package.json

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm install

# Stage: Build application
###########################
FROM dependecy-stage AS build-stage

# Create app directory
WORKDIR /app

# Copy all source code to workdir
COPY --chown=node:node . .

# Build application clean cache
RUN npm run build && npm cache clean --force

# Stage: Runner application
###########################
FROM build-stage AS runner-stage

EXPOSE 3001 

# Create app directory
WORKDIR /app

# Use the node user from the image (instead of the root user)
USER node

# Run the node
CMD [ "node", "dist/main.js" ]


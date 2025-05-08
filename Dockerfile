# Use the official Node.js image as a base
FROM node:23-slim

# Set working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm i --force

# Copy the entire project into the container
COPY . .

# Build the Angular app
RUN npm run build

# Use Nginx to serve the built Angular app
FROM nginx:stable-alpine

# Copy project files.
COPY --from=0 /app/dist /usr/share/nginx/html

#Copy Custom Nginx Configuration.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy security keys into the final container
COPY certs/private.key /etc/nginx/ssl/private.key
COPY certs/certificate.crt /etc/nginx/ssl/certificate.crt
COPY certs/ca_bundle.crt /etc/nginx/ssl/ca_bundle.crt

# Expose the default Nginx port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

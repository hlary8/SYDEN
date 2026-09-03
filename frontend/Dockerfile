# frontend/Dockerfile - multi-stage build for Vite + React

# Stage 1: build the app
FROM node:18-alpine AS build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# Copy package files and install
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Stage 2: serve with nginx
FROM nginx:stable-alpine

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy template and prepare for env substitution
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy build
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Replace env vars in nginx config at container start
CMD ["/bin/sh", "-c", "envsubst '${BACKEND_URL}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;' "

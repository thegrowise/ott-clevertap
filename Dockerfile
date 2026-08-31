# Base image: Lightweight Nginx Alpine
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Remove default static assets
RUN rm -rf ./*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy all application static files
COPY . .

# Expose port 80 for Nginx web server
EXPOSE 80

# Run Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]

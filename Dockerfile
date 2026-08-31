# Base image: Lightweight Nginx Alpine
FROM nginx:alpine

# Copy all static website files to Nginx default html folder
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

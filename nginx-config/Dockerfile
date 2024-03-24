# Use the official Nginx image as the base image
FROM nginx:latest

# Delete the default Nginx configuration file

# Copy frontend and backend configuration files to Nginx conf.d directory
COPY default.conf /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/nginx.conf
# Expose port 80
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]

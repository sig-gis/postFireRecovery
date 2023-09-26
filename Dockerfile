# Use an official Python runtime as a base image
FROM python:3.9

# Install Node.js and npm
RUN apt-get update && apt-get install -y nodejs npm && npm install -g bower

# Set environment variables
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container
COPY . /app/

# Install required packages
RUN pip install --no-cache-dir -r requirements.txt

# Install Gulp globally
RUN npm install -g gulp-cli

# Install Gulp and other dependencies from package.json
RUN npm install

# Install front-end dependencies using Bower
# RUN bower install --allow-root

# Build frontend assets with Gulp
RUN gulp build

# Collect static files
RUN python manage.py collectstatic --noinput --verbosity 3

# Change the ownership of the /app/static directory to www-data
RUN chown -R www-data:www-data /app/static

# Run Gunicorn
CMD ["gunicorn", "postfirerecovery.wsgi:application", "--bind", "0.0.0.0:8000"]

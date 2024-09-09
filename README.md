# PostFireRecovery Project

## Overview

This repository contains the codebase for the PostFireRecovery Project, a Django-based web application. It leverages Docker to manage the services like Nginx, Gunicorn, and PostgreSQL.

** As of 2024-09-08 the production website does not use Docker. See below for maintenance tips and tricks. **

## Pre-requisites

- Docker and Docker Compose installed
- Git for version control

## Getting Started

### For Local Development

1. **Clone the Repository**

    ```
    git clone https://github.com/sig-gis/postfirerecovery.git
    cd postfirerecovery
    ```

2. **Settings file, Environment Variables and credentials**

    Rename `settings_example.py` to `settings.py` and update the variables as needed.

    ```
    cp postfirerecovery/settings_example.py postfirerecovery/settings.py
    ```

    Rename `.env.sample` to `.env` and update the variables as needed.

    ```
    cp .env.sample .env
    ```

3. **Service account credentials**

    Make a folder named credentials and paste your `privatekey.json` service account credentials file.

    ```
    mkdir credentials

    echo <<content-of-your-privatekey-file>> > credentials/privatekey.json
    ```

4. **Build and Run Containers**

    ```
    docker-compose -f docker-compose-dev.yml up --build
    ```

    This will start the development server and you can access it at `http://localhost:8000`.

### For Production Deployment

1. **Environment Variables**

    Securely pass environment variables as needed, different from your local `.env` file.

2. **Build and Run Containers**

    ```
    docker-compose up -d --build
    ```

    This will start the production server and you can access it at `http://localhost`.

3. **Migrations**

    ```
    docker-compose run web python manage.py migrate
    ```

## Architecture

- `nginx`: Web server
- `web`: Gunicorn + Django Application
- `db`: PostgreSQL Database

## Contributing

1. Fork the repository
2. Clone your fork `git clone https://github.com/<your-username>/postfirerecovery.git`
3. Add the original repository as a remote repository `git remote add upstream https://github.com/sig-gis/postfirerecovery.git`
4. Pull the latest changes from upstream `git pull upstream main`
5. Create a new branch for your feature or bug fix `git checkout -b your-branch-name`
6. Make your changes
7. Commit your changes and push them to your fork
8. Open a pull request

For more detailed guidelines, read [CONTRIBUTING.md](CONTRIBUTING.md).

## Troubleshooting

For common issues and their resolutions, see the `TROUBLESHOOTING.md` file.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Taking the docker down and building it again

```
 docker-compose down
 docker volume prune
 docker builder prune
 docker network prune
 docker container prune
 docker image prune -a
 docker system prune -a
 sudo apt-get clean
 sudo apt-get autoremove

 docker-compose build --no-cache
 docker-compose run web python manage.py migrate
 docker-compose up -d
```

## Non Docker Maintenance

### Preface - Change is Hard
Minor changes are somewhat tricky without using docker. An example of a minor change is updating the slider years to include the next year!To incorperate this change currently you need to modify a number of files outside of the "real code" you're already changing. Here's how you can do it, in layman terms.

### Preface
This is Django web app, using gunicorn as a application server, with nginx as the web server. [See here for some background]("https://realpython.com/django-nginx-gunicorn/#incorporating-nginx).

### Making Changes
Once you've tested out your changes locally and it looks good, here is the secret sauce of how to get it to show up.

1. log into the server and clone the repo.

2. Copy the `settings.py` file from either bbhandari or jdilger to the root folder of the repo. 
    * `cp /home/jdilger/postFireRecovery/postfirerecovery/settings.py /home/{USERNAME}/postFireRecovery/postfirerecovery/settings.py`

3. Copy the `credentials` folder from either bbhandari or jdilger to the root folder of the repo. 
    * `cp -R /home/jdilger/postFireRecovery/credentials /home/{USERNAME}/postFireRecovery`
    
4. activate the conda environment `/home/bbhandari/miniconda3/envs/postfirerecovery`.  
    * you can do this by adding `. /home/bbhandari/miniconda3/etc/profile.d/conda.sh` to your `~/.bashrc` file. Make sure to refresh the file doing `source ~/.bashrc`.

5. from the root dir (postFireRecovery), follow the build commands from the Dockerfile.
* ```
    sudo npm install -g gulp-cli
    sudo npm install
    sudo gulp build
    sudo `which python` manage.py collectstatic --noinput --verbosity 3
    sudo chown -R {USERNAME}:www-data /static
    ```
6. Edit the gunicorn service file and update the path to your path. 
    * `sudo vim /etc/systemd/system/gunicorn.service`
7. Edit the nginx service file and update the path to your path.
    * `sudo vim /etc/nginx/sites-available/postfirerecovery.com`

8. Restart services:
* ```
    sudo systemctl daemon-reload
    sudo service nginx restart
    sudo service gunicorn restart
    ```

That's it. 

### Debugging
If something didn't go to plan here's some things to check.

* Check that all copied files have the correct ownership. Static files in postFireRecovery/static should be owned by you and the www-data group. Credentials should be owned by you.
* In settings.py set `DEBUG=True`. Restart gunicorn `sudo service gunicorn restart` and then watch the errors flow in. You can view them with `sudo service gunicorn status`.
* You can also view the nginx error logs `sudo cat /var/log/nginx/error.log`



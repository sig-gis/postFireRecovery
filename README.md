# PostFireRecovery Project

## Overview

This repository contains the codebase for the PostFireRecovery Project, a Django-based web application. It leverages Docker to manage the services like Nginx, Gunicorn, and PostgreSQL.

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

2. **Environment Variables**

    Rename `.env.sample` to `.env` and update the variables as needed.

    ```
    cp .env.sample .env
    ```

3. **Build and Run Containers**

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

<a name="readme-top"></a>

<!-- ABOUT THE PROJECT -->

### Built With (Frontend)

-   Vue.js + Vite
-   Tailwind CSS
-   Swiperjs
-   GSAP
-   Vuex
-   Vue-Toastification
-   Firebase

### Built With (Backend)

-   Twilio
-   Stripe
-   AMQP
-   Kong
-   Facebook
-   Docker

<!-- GETTING STARTED -->

## Getting Started with frontend

Run the following command to setup and run a local copy of the project. Note that you require node.js installed from the internet.

### Recommended IDE Setup

-   VSCode + Volar

### Installation

```bash
# clone the project
git clone https://github.com/IS213-G6-T6/Hawker-Center-Management-System.git
```

```bash
# install dependencies
npm install
```

### Run application locally

```bash
# launch development environment (authentication features may not be available)
npm run dev
```
## Getting Started with backend

This repository contains code for all the microservices that utilizes Docker containers and all the database scripts required. The application requires a WAMP database server to be running and all database scripts to be imported before the Docker container can be deployed.

Installation
1. Clone this repository onto your local machine.

2. Make sure that the WAMP database server is running and all necessary database scripts have been imported.

3. Navigate into the "docker compose" directory.

4. Open the docker-compose.yml file and change the <dockerID> field to your own DockerID.

5. Run the following command in your terminal:
docker-compose up

6. Wait for the Docker container to deploy.


<p align="right">(<a href="#readme-top">back to top</a>)</p>

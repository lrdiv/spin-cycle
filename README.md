<a id="readme-top"></a>
<br />
<div align="center">
  <a href="https://github.com/lrdiv/spin-cycle">
    <img src="assets/logo.png" alt="Logo" width="480" height="480">
  </a>

  <h1 align="center">Spin Cycle</h1>

  <p align="center">
    Daily record recommendation from your Discogs collection to your inbox
    <br />
    <a href="https://github.com/lrdiv/spin-cycle"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/lrdiv/spin-cycle/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/lrdiv/spin-cycle/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li>
          <a href="#prerequisites">Prerequisites</a>
          <ul>
            <li><a href="#running-via-docker-compose-recommended">Running via Docker Compose</a></li>
            <li><a href="#running-via-nx">Running via Nx</a></li>
          </ul>
        </li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Once your record collection grows past a certain size, analysis paralysis begins to creep in each time you attempt
to figure out what to listen to next. Sure, you could go through your collection alphabetically (or however you sort it),
but where's the fun in always knowing what the future holds? Embrace uncertainty and eliminate record analysis paralysis
with Spin Cycle!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With
* [![Nest.js][Nest.js]][Nest-url]
* [![Angular][Angular.io]][Angular-url]
* [![Nx][Nx]][Nx-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

The easiest way to run the app locally is with Docker Compose.

The only third-party dependency at the moment is [Mailgun](https://www.mailgun.com/). You should be able to create a free account for development testing purposes.

### Prerequisites

* Install Docker Desktop / Engine
  ```sh
  brew cask install docker
  ```
* Create a [new Discogs API Application](https://www.discogs.com/settings/developers) to obtain a key and secret
* To ensure you have test data, you'll want an active Discogs account with some items in a collection before running the app

### Running via Docker Compose (Recommended)

1. Clone the repo
   ```sh
   git clone https://github.com/lrdiv/spin-cycle.git
   ```
2. Create a .env file for Docker Compose to use
   ```sh
   touch .env.docker
   ```
3. Generate JWT and Session secrets (they should not be the same string)
   ```sh
   npm run secret:gen
   ```
4. Fill in the needed API keys / secrets in the .env file
   ```dotenv
   export DISCOGS_KEY="discogs key"
   export DISCOGS_SECRET="discogs secret"
   export MAILGUN_KEY="mailgun key"
   export JWT_SECRET="jwt secret"
   export SESSION_SECRET="session secret"
   ```
5. Start Docker Compose application stack
   ```sh
   docker compose up --build
   ```
6. The app will be accessible at `http://localhost:3000`
 
### Running via Nx

1. Follow steps 1-4 from above. The only difference is that your `.env` file should be named `.env` (not `.env.docker`)
2. Install global npm depencies
   ```sh
   npm install -g nx@latest
   npm install -g @angular/ci@19
   ```
3. Install local dependencies
   ```sh
   npm install
   ```
4. Run dockerized services
   ```sh
   docker compose up -d db redis
   ```
5. Add the correct `DATABASE_URL` and `REDIS_URL` to `.env`
   ```sh
   export DATABASE_URL="postgres://spincycle:spincycle@127.0.0.1:54321/spincycle"
   export REDIS_URL="redis://127.0.0.1:63791"
   ```
6. Start the local API and client servers
   ```sh
   nx run-many -t serve
   ```
7. The frontend app will be accessible at `http://localhost:4200`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [ ] Mailer Microservice
- [ ] NestJS Queues
- [ ] Advanced Customization
  - [ ] Limit to media type (LP, CD, Cassette, etc)
  - [ ] Filter out box sets and/or singles
  - [ ] Specify time of day for email delivery
- [ ] Write tests

See the [open issues](https://github.com/lrdiv/spin-cycle/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch 
   ```sh
   git checkout -b feature/amazing-feature
   ```
3. Commit your Changes
   ```sh
   git commit -m 'Add some Amazing Feature'
   ```
4. Push to the Branch
   ```sh
   git push origin feature/amazing-feature
   ```
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- LICENSE -->
## License

Distributed under the project_license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

General Inquiries - [spincycle@lrdiv.co](mailto:spincycle@lrdiv.co)

Lawrence Davis - Maintainer - [lawrence@lrdiv.co](mailto:lawrence@lrdiv.co)

Project Link: [https://github.com/lrdiv/spin-cycle](https://github.com/lrdiv/spin-cycle)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* [Discogs](https://www.discogs.com/) - For providing an incredible (and free) service to music collectors
* [Fly.io](https://fly.io) - For affordable app hosting

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[Nest.js]: https://img.shields.io/badge/NestJS-4A4A55?style=for-the-badge&logo=nestjs&logoColor=ea2845
[Nest-url]: https://nestjs.com/
[Nx]: https://img.shields.io/badge/nx-4A4A55?style=for-the-badge&logo=nx&logoColor=FF3E00
[Nx-url]: https://nx.dev
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/

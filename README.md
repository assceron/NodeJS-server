# NodeJS Web Server

<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Use Docker](#use-docker)
* [Contact](#contact)

<!-- ABOUT THE PROJECT -->
## About The Project

The web server has two main purposes:
1. Receive an XML documents containing students test scores and store them in a persistent storage.
   The server receives the XML with an HTTP POST.
   
2. Visualization of aggregate data, e.g. mean of scores in a test.
   

### Built With

* [NodeJS](https://nodejs.org/en/)
* [ExpressJS](https://expressjs.com/)
* [SQLite](https://www.sqlite.org/index.html)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites
* Install the latest [Node.js](https://nodejs.org/en/download/) 10+ LTS version.

### Installation

1. Clone the repo
```sh
git clone https://github.com/assceron/StileCodingChallenge.git
```
2. Install NPM packages
```sh
npm install 
```
3. Run the application locally
```sh
npm run start 
```
The application will be running at http://localhost:4567/. 

Endpoints available: 
* HTTP POST XML -  http://localhost:4567/import 
* HTTP GET aggregate - http://localhost:4567/results/:test-id/aggregate 

<!-- USAGE EXAMPLES -->
## Usage
* HTTP POST 
 Send the HTTP POST request with curl from command line. 
  The server first check that the XML format is correct, then add the content to the database.
 ![post-image]
 
* HTTP GET
Send the HTTP GET request with curl from command line.
 ![get-image]

<!-- ROADMAP -->
## Roadmap
- `server.js` - Defines the Express server, connects it to SQLite, manages the GET and POST requests. 
- `server.helpers.js` - Defines helpers functions, e.g. aggregation functions.
- `sql.js` - Defines the queries for the database
- `error.js` - Defines error handling functions
- `test.js` - Run examples of HTTP POST and GET on the server 

## Use Docker

You can also run this app as a Docker container:

Step 1: Clone the repo

```bash
git clone https://github.com/assceron/StileCodingChallenge.git
```

Step 2: Run docker command

```bash
docker-compose up
```

<!-- CONTACT -->
## Contact

Assunta Cerone - assceron@gmail.com

Project Link: [https://github.com/assceron/StileCodingChallenge](https://github.com/assceron/StileCodingChallenge)

<!-- IMAGES -->
[post-image]: images/post.png
[get-image]: images/get.png

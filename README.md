# EAZY-TRANSACT

Eazy-Transact is a smooth peer-2-peer transactions service. It gives fast, secure and flexible funds transfer. 


## Getting Started
Clone the Repo.
-------------
`https://github.com/Alpha1202/EAZY-TRANSACT.git`
## Prerequisites
The following tools will be needed to run this application successfully:
* Node v10.15.0 or above
* Npm v6.4 or above
## Endpoints
- POST **api/user/signup** A user can create an account

- POST **api/user/signin** A registered user can login
- POST **/api/transaction/send** An authenticated user can intiate fund transfer
- POST **/api/transaction/transfer** With a valid OTP, an authenticated user can successfully transfer funds

## Installation
**On your Local Machine**
- Pull the [develop](https://github.com/Alpha1202/EAZY-TRANSACT.git) branch off this repository
- Run `npm install` to install all dependencies
- Run npm start to start the app
- Access endpoints on **localhost:2020**

## Built With
* [Node.js](http://www.nodejs.org/) - Runtime-Enviroment
* [Sequelize](https://sequelize.org/) - Sequelize is a promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server
* [Postgres](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database
* [SendGrid](https://app.sendgrid.com/)
## Authors
* **Nzubechukwu Nnamani**

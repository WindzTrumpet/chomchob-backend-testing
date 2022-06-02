# ChomCHOB Backend Testing
### This repository is for testing my skill to apply for ChomCHOB.

## Version
1. Node.js 16.15.0
2. MariaDB 10.6.8

## Setup for Develop
1. Install node version manager at [NVM](https://github.com/nvm-sh/nvm) or [NVM for Windows](https://github.com/coreybutler/nvm-windows)
2. Install Node.js using the command `nvm install 16.15`
3. Install [Yarn](https://classic.yarnpkg.com/) package manager using the command `npm install -g yarn`
4. Install the package using the command `yarn install`
5. Start development using the command `yarn run dev` this command will use [nodemon](https://nodemon.io/) for hot restart

## Setup for Production
1. Prerequisite
   1. Docker
   2. Docker Compose
2. Config environment by rename .env.example to .env using the command `cp .env.example .env`
3. Config Nginx (This step can be skipped) at `docker/nginx/default.conf.template`
4. Start container using the command `docker-compose up -d`

For more information contact me at [chinapat.dev@gmail.com](mailto:chinapat.dev@gmail.com)
# ReactJS and NestJS - CMS
![Deploy](https://github.com/vzhyhunou/vzh-cms-2/actions/workflows/deploy.yml/badge.svg)

## Tech stack and libraries
### Backend
- NestJS
- TypeORM
- PassportJS
- nestjs-i18n
- cron
- moment
- bcrypt
### Frontend
- ReactJS
- React-admin
- React Router
- Material-UI
- ViteJS
- Jest

## Getting Started
### Running
- Download and install Node: https://nodejs.org/download/release/v20.19.5
- Download and unzip app: https://github.com/vzhyhunou/vzh-cms-2/archive/refs/heads/master.zip
- Change current directory: `cd vzh-cms-2-master`
- Install packages: `npm install`
- Build client app: `npm run build --workspace=client`
- Build server app: `npm run build --workspace=server`
- Run app: `node dist/main.js`
### Usage
- Home page: http://localhost:8090
- Admin console: http://localhost:8090/admin, use `admin`, `editor`, `manager` as username and password

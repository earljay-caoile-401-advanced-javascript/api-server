# LAB: Express (07)

## Create an Express API Server

### Author: Earl Jay Caoile

### Links and Resources

- [submission PR](https://github.com/js-401n15-eoc/lab-07/pull/2)
- [GitHub Actions](https://github.com/js-401n15-eoc/lab-07/actions)

#### Documentation

- [SuperAgent](https://visionmedia.github.io/superagent/)

### Setup

#### Configuring MongoDB

- create an .env file on the top level of this repo: `MONGODB_URI=mongodb://localhost:27017/api-server`
- start your database with the path of the DB along with the folder location for your DB files (`mongod --dbpath=/Users/path/to/data/db`: i.e. `"C:\Program Files\MongoDB\Server\4.2\bin\mongod.exe" --dbpath="D:\db"`)

#### Tests

- Testing command: `npm test` from root directory

#### UML

![UML Image](lab-07-UML.png "uml diagram")

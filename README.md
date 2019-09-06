# MongoDB authentication and authorization check
Web App for checking MongoDB authentication and authorization. Shows current user permissions and allows to test basic CRUD operations.

### Important
The app saves customer password in the server side session file. Not recommended for any production usage.

### Build
```
npm install
```
### Configuration
The app uses [config](https://www.npmjs.com/package/config) module.

Update _uri_ value with your connection string and _db_, _collection_ with your database and collection name. Do not use any collection with data since during tests documents could be modified or deleted.

Update _port_ value if you need a specific port. By default the app starts on port 80.
### Start
```
npm start
```
### Start in dev mode (nodemon)
```
npm run dev
```

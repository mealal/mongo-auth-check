const express = require("express");
const format = require('format')
const config = require('config');
const dbConfig = config.get('Config.MongoDB');
const MongoClient = require('mongodb').MongoClient;
const router = express.Router();

router.get("/", (req, res) => {
  const url = format(dbConfig.uri, req.user.username, req.user.password);
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function(client) {
      const db = client.db(dbConfig.db);
      return db.command({connectionStatus:1})
          .then(function (result) {
            return result.authInfo;
        }
      );
    }).then(function(data) {
      console.log(data);
      res.render("dashboard", { title: 'Dashboard', username : data.authenticatedUsers[0].user, roles: data.authenticatedUserRoles});
    });
});


module.exports = router;
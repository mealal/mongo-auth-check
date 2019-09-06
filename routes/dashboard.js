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
      res.render("dashboard", { title: 'Dashboard', username : data.authenticatedUsers[0].user, roles: data.authenticatedUserRoles});
    });
});

router.get("/find", (req, res) => {
  const url = format(dbConfig.uri, req.user.username, req.user.password);
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function(client) {
      let db = client.db(dbConfig.db);
      let collection = db.collection(dbConfig.collection);
      return collection.findOne({})
          .then(function (result) {
            return result;
        }
      );
    }).then(function(result) {
      res.render("operation_result", {title: 'Dashboard - find result', operation: 'find', result: JSON.stringify(result), note: 'Please note: result could be empty if you have no any documents in your test collection'});
    }).catch(function(result) {
      res.render("operation_result", {title: 'Dashboard - find result', operation: 'find', result: JSON.stringify(result)});
    });
});

router.get("/delete", (req, res) => {
  const url = format(dbConfig.uri, req.user.username, req.user.password);
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function(client) {
      let db = client.db(dbConfig.db);
      let collection = db.collection(dbConfig.collection);
      return collection.deleteOne({})
          .then(function (result) {
            return result;
        }
      );
    }).then(function(result) {
      res.render("operation_result", {title: 'Dashboard - delete result', operation: 'delete', result: JSON.stringify(result)});
    }).catch(function(result) {
      res.render("operation_result", {title: 'Dashboard - delete result', operation: 'delete', result: JSON.stringify(result)});
    });
});

router.get("/insert", (req, res) => {
  const url = format(dbConfig.uri, req.user.username, req.user.password);
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function(client) {
      let db = client.db(dbConfig.db);
      let collection = db.collection(dbConfig.collection);
      return collection.insertOne({val:"Test document"})
          .then(function (result) {
            return result;
        }
      );
    }).then(function(result) {
      res.render("operation_result", {title: 'Dashboard - insert result', operation: 'insert', result: JSON.stringify(result)});
    }).catch(function(result) {
      res.render("operation_result", {title: 'Dashboard - insert result', operation: 'insert', result: JSON.stringify(result)});
    });
});

router.get("/update", (req, res) => {
  const url = format(dbConfig.uri, req.user.username, req.user.password);
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(function(client) {
      let db = client.db(dbConfig.db);
      let collection = db.collection(dbConfig.collection);
      return collection.updateOne({}, {"$inc": {"counter": 1}})
          .then(function (result) {
            return result;
        }
      );
    }).then(function(result) {
      res.render("operation_result", {title: 'Dashboard - update result', operation: 'update', result: JSON.stringify(result)});
    }).catch(function(result) {
      res.render("operation_result", {title: 'Dashboard - update result', operation: 'update', result: JSON.stringify(result)});
    });
});

module.exports = router;
'use strict';

const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const PORT = 8080;
const app = express();

app.use(express.static(__dirname + '/assets'));
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'warehouse',
});

function connecToMySql() {
  connection.connect((err) => {
    if (err) {
      console.log("Connection failed!");
      return;
    };
    console.log("Connecteion established!");
  });
};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/assets/index.html');
});

app.get('/warehouse', function (req, res) {
  connection.query(`SELECT * FROM warehouse`, function (err, rows) {
    res.send({
      "result": "ok",
      "clothes": rows,
    })
  });
});

app.get('/price-check', function (req, res) {
  connection.query(`SELECT * FROM warehouse WHERE item_name LIKE "%${req.query.item}%" AND size="${req.query.size}"`, function (err, row) {
    if (row.in_store < req.query.quantity) {
      res.send({
        "result": "error, we don't have enough items in store",
      });
    } else {
      res.send({
        "result": "ok",
        "total_price": req.query.quantity * row[0].unit_price
      });
    };
    if (req.query.quantity < 3) {
      res.send({
        "result": "please order at least 3, one for yourself, two for your friends"
      });
    } else {
      res.send({
        "result": "ok",
        "total_price": req.query.quantity * row[0].unit_price
      });
    };
  });
});

connecToMySql();
app.listen(PORT, () => console.log(`The app is running at localhost: ${PORT}`));

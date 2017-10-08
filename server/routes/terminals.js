'use strict';

var express = require('express');
//var controller = require('./terminals.controller');
var terminals = {},
  logs = {};

var os = require('os');
var pty = require('node-pty');

var router = express.Router();
var expressWs = require('express-ws')(router);

router.post('/', function (req, res) {
  var cols = parseInt(req.query.cols),
    rows = parseInt(req.query.rows),
    term = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash', [], {
      name: 'xterm-color',
      cols: cols || 80,
      rows: rows || 24,
      cwd: process.env.PWD,
      env: process.env
    });

  console.log('Created terminal with PID: ' + term.pid);
  terminals[term.pid] = term;
  logs[term.pid] = '';
  term.on('data', function(data) {
    logs[term.pid] += data;
  });
  res.send(term.pid.toString());
  res.end();
});

router.post('/:pid/size', function (req, res) {
  var pid = parseInt(req.params.pid),
    cols = parseInt(req.query.cols),
    rows = parseInt(req.query.rows),
    term = terminals[pid];

  term.resize(cols, rows);
  console.log('Resized terminal ' + pid + ' to ' + cols + ' cols and ' + rows + ' rows.');
  res.end();
});

router.ws('/:pid', function (ws, req) {
  var term = terminals[parseInt(req.params.pid)];
  console.log('Connected to terminal ' + term.pid);
  ws.send(logs[term.pid]);

  term.on('data', function(data) {
    try {
      ws.send(data);
    } catch (ex) {
      console.log(ex);
      // The WebSocket is not open, ignore
    }
  });
  ws.on('message', function(msg) {
    term.write(msg);
  });
  ws.on('close', function () {
    term.kill();
    console.log('Closed terminal ' + term.pid);
    // Clean things up
    delete terminals[term.pid];
    delete logs[term.pid];
  });
});

// router.ws('/:pid', function(ws, req) {
//   ws.on('message', function(msg) {
//     console.log(msg);
//     console.log(req.params.pid)
//     ws.send(logs[term.pid]);
//   });
//   console.log('socket', req.testing);
// });

module.exports = router;

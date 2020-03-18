var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const fes = require('fesjs');
const conifg = require('./config/fes.config');
var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Start app with FesJs
fes.boost({ app, options: conifg });

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  if (err) {
    if (/\/webhook$/.test(req._parsedUrl.pathname)) {
      _log('webhook error', err);
      res.destroy();
    }

    if (err.name === 'fes-validation') {
      return res.status(422).send(err.data);
    }
    let isJson =
      req.headers['content-type'] &&
      req.headers['content-type'].includes('json');

    if (isJson) {
      // render the error page
      return res.status(err.status || 500).send(err.data || err.message);
    } else if (err.isJson) {
      return res.status(err.status || 500).send(err.data || err.message);
    } else {
      return res.status(err.status || 500).send(err.message);
    }
  }
});

module.exports = app;

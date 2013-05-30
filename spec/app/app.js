var express = require('express');
var mustachex = require('../../mustachex');

var app = express();

app.configure(function() {
  app.engine('html', mustachex.express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
});

app.get('/simple', function(req, res) {
  res.render('simple');
});

app.get('/simpledata', function(req, res) {
  res.render('simpledata', { name: req.param('name'), numbers: [1, 2, 3] });
});

app.get('/partialdefault', function(req, res) {
  res.render('partialdefault');
});

app.get('/partialdata', function(req, res) {
  res.render('partialdata', { name: 'John', age: 100 });
});

app.get('/custompartial', function(req, res) {
  res.render('custompartial');
});

app.get('/subpartial', function(req, res) {
  res.render('subpartial');
});

app.get('/defaultlayout', function(req, res) {
  res.render('body', { layout: true });
});

app.get('/customlayout', function(req, res) {
  res.render('body', { layout: 'customlayout' });
});

app.get('/customlayoutpath', function(req, res) {
  res.render('body', { layout: 'layout/custom' });
});

app.get('/globallayout', function(req, res) {
  res.render('body');
});

app.get('/globallayoutoverride', function(req, res) {
  res.render('body', { layout: false });
});

app.loadCustomPartials = function(onComplete) {
  mustachex.loadPartials(__dirname + '/views/custompartials', onComplete);
};

app.setGlobalLayout = function(enabled) {
  app.set('layout', enabled);
};

module.exports = app;

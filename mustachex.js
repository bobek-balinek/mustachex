var fs = require('fs');
var path = require('path');
var glob = require('glob');
var async = require('async');
var mustache = require('mustache');
var _ = require('underscore');

var _partials = null;

var _getDefaultPartialDirectory = function(filename) {
  return path.join(path.dirname(filename), 'partials');
};

var _renderTemplate = function(filename, options, onComplete) {
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) return onComplete(err);
    onComplete(null, mustache.render(data, options, _partials));
  });
};

var _loadPartials = function(directory, onComplete) {
  if (!onComplete) onComplete = function() {};
  if (_partials !== null) return onComplete(null);

  var readTemplate = function(filename, onComplete) {
    fs.readFile(filename, 'utf8', function(err, data) {
      var name = path.basename(filename, path.extname(filename));
      return onComplete(err, [name, data]);
    });
  };

  glob(path.join(directory, '*.*'), function(err, files) {
    if (err) return onComplete(err);

    async.map(files, readTemplate, function(err, templates) {
      if (!err) _partials = _.object(templates);
      return onComplete(err);
    });
  });
};

var express = function(filename, options, onComplete) {
  _loadPartials(_getDefaultPartialDirectory(filename), function(err) {
    if (err) return onComplete(err);
    _renderTemplate(filename, options, onComplete);
  });
};

var loadPartials = function(directory, onComplete) {
  _partials = null;
  return _loadPartials(directory, onComplete);
};

module.exports = {
  express: express,
  loadPartials: loadPartials
};

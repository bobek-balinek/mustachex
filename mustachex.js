var fs = require('graceful-fs');
var path = require('path');
var glob = require('glob');
var async = require('async');
var mustache = require('mustache');
var _ = require('underscore');

var _partials = null;

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

  glob(path.join(directory, '**/*.*'), function(err, files) {
    if (err) return onComplete(err);

    async.map(files, readTemplate, function(err, templates) {
      if (!err) _partials = _.object(templates);
      return onComplete(err);
    });
  });
};

var _getLayoutFilePath = function(options) {
  var layoutname = options.layout === true ? 'layout' : options.layout;
  var layoutfile = layoutname + '.' + options.settings['view engine'];
  return path.join(options.settings.views, layoutfile);
};

var loadPartials = function(directory, onComplete) {
  _partials = null;
  return _loadPartials(directory, onComplete);
};

var express = function(filename, options, onComplete) {
  if (options.layout === undefined && options.settings.layout) {
    options.layout = options.settings.layout;
  }

  if (options.settings.env === 'development') {
    _partials = null;
  }

  _loadPartials(path.join(options.settings.views, 'partials'), function(err) {
    if (err) return onComplete(err);

    return _renderTemplate(filename, options, function(err, data) {
      if (!options.layout) return onComplete(null, data);

      options.body = data;
      _renderTemplate(_getLayoutFilePath(options), options, onComplete);
    });
  });
};

module.exports = {
  express: express,
  loadPartials: loadPartials
};

# mustachex

mustachex makes using the [mustache](https://github.com/janl/mustache.js/) templating engine in [express](https://github.com/visionmedia/express) really simple.

## Installation

### npm
```
npm install mustachex
```

### GitHub
```
npm install https://github.com/martinrue/mustachex/tarball/master
```

## Usage

### Register
Register mustachex as a view engine by calling `app.engine` and passing in `mustachex.express`:

```javascript
app.configure(function() {
  app.engine('html', mustachex.express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
});
```

### Render
Calling `res.render` will then render the named mustache template from the view directory set in express:

```javascript
app.get('/', function(req, res) {
  res.render('index', { data: 'value' });
});
```

### Partials
By default, mustachex loads all partials from the subdirectory `partials` of the express view directory. 
This means that partials just work without any extra configuration required:

**views/partials/hello.html**
```html
<div>Hello {{name}}</div>
```

**views/index.html**
```html
{{> hello}}
```

**app.js**
```javascript
app.get('/', function(req, res) {
  res.render('index', { name: 'John' });
});
```

To load partials from a custom directory, call `mustachex.loadPartials` and pass the full path to a custom directory:

```javascript
mustachex.loadPartials(__dirname + '/views/custompartials');

app.configure(function() {
  app.engine('html', mustachex.express);
  app.set('view engine', 'html');
  app.set('views', __dirname + '/views');
});
```

### Layout
mustachex supports the concept of a layout template. Pass `layout: true` or `layout: 'customfile'` to `res.render` to specify
that the template should use a layout template:

**views/layout.html**
```html
<div>{{{body}}}</div>
```

**views/index.html**
```html
Some Content
```

**app.js**
```javascript
app.get('/', function(req, res) {
  res.render('index', { layout: true });
});
```

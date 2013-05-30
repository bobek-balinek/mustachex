var request = require('request');
var http = require('http');

var app = require('./app/app');
var server = http.createServer(app);
var baseUrl = 'http://localhost:10101';

beforeEach(function(done) {
  server.listen(10101, done);
});

describe('mustachex', function() {
  it('renders simple templates with no data', function(done) {
    request(baseUrl + '/simple', function(err, response, body) {
      expect(body).toBe('<h1>header</h1>');
      done();
    });
  });

  it('renders simple templates with data', function(done) {
    request(baseUrl + '/simpledata?name=bob', function(err, response, body) {
      expect(body).toBe('<h1>hello bob</h1> 123');
      done();
    });
  });

  it('renders templates with partials from default directory', function(done) {
    request(baseUrl + '/partialdefault', function(err, response, body) {
      expect(body).toBe('<h1>HEADER1</h1> <h1>HEADER2</h1> <div>Body</div>');
      done();
    });
  });

  it('renders templates with partials that access data', function(done) {
    request(baseUrl + '/partialdata', function(err, response, body) {
      expect(body).toBe('Hello John, you are 100');
      done();
    });
  });

  it('renders templates with partials in sub directories', function(done) {
    request(baseUrl + '/subpartial', function(err, response, body) {
      expect(body).toBe('sub partial');
      done();
    });
  });

  it('renders templates with default layout', function(done) {
    request(baseUrl + '/defaultlayout', function(err, response, body) {
      expect(body).toBe('<body>body content</body>');
      done();
    });
  });

  it('renders templates with custom layout', function(done) {
    request(baseUrl + '/customlayout', function(err, response, body) {
      expect(body).toBe('<custom>body content</custom>');
      done();
    });
  });

  it('renders templates with custom layout path', function(done) {
    request(baseUrl + '/customlayoutpath', function(err, response, body) {
      expect(body).toBe('<abc>body content</abc>');
      done();
    });
  });

  it('renders templates with layout via global layout setting', function(done) {
    app.setGlobalLayout(true);
    request(baseUrl + '/globallayout', function(err, response, body) {
      expect(body).toBe('<body>body content</body>');
      app.setGlobalLayout(false);
      done();
    });
  });

  it('can override global layout setting', function(done) {
    app.setGlobalLayout(true);
    request(baseUrl + '/globallayoutoverride', function(err, response, body) {
      expect(body).toBe('body content');
      app.setGlobalLayout(false);
      done();
    });
  });

  it('renders partials from custom directory', function(done) {
    app.loadCustomPartials(function() {
      request(baseUrl + '/custompartial', function(err, response, body) {
        expect(body).toBe('I am a partial and I am not');
        done();
      });
    });
  });
});

afterEach(function(done) {
  server.close(done);
});

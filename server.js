const express = require('express');
const morgan = require('morgan');

const BlogPostsRouter = require('./BlogPostsRouter');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.use('/blog-posts', BlogPostsRouter);

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve(server);
    }).on('error', err => {
      reject(err)
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

module.exports = {app, runServer, closeServer};
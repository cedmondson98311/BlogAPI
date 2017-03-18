const express = require('express');
const morgan = require('morgan');

const BlogPostsRouter = require('./BlogPostsRouter');

const app = express();

app.use(morgan('common'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/views/index.html');
});

app.use('/blog-posts', BlogPostsRouter);

app.listen(process.env.PORT || 8080, () => {
	console.log(`listening on port 8080`);
});
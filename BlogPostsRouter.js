const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models.js');

BlogPosts.create('first','blah blah blah blah','Jon Doe','1/1/11');
BlogPosts.create('second','rabble rabble rabble','Jon Doe','1/1/11');
BlogPosts.create('third','yaddi yaddi yadda','Jon Doe','1/1/11');

router.get('/', (req, res) => {
	res.json(BlogPosts.get());
	console.log('all posts retrieved');
	res.status(200).end();
});

router.post('/', jsonParser, (req, res) => {
	const reqFields = ['title','content','author','publishDate'];
	for(var i = 0; i < reqFields.length; i++) {
		const field = reqFields[i];
		if(!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`
			console.error(message);
			return res.status(400).send(message);
		}
	}
	const post = BlogPosts.create(req.body.title,req.body.content,req.body.author,req.body.publishDate);
	res.status(201).json(post);
});

router.delete('/:id', (req, res) => {
	targetPost = req.params.id;
	BlogPosts.delete(targetPost);
	console.log(`deleted post ${targetPost}`);
	res.status(204).end();
});

router.put('/:id', jsonParser, (req, res) => {
	targetPost = {
		'id':req.params.id,
		'content':req.body.content,
		'title':req.body.title,
		'author':req.body.author,
		'publishDate':req.body.publishDate
	};

	BlogPosts.update(targetPost);
	console.log(`updated post ${targetPost.id}`);
	res.status(200).json(targetPost);
})

module.exports = router;
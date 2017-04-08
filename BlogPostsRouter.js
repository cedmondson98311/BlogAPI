const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Restaurant} = require('./models');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Blog} = require('./models.js');

router.get('/', (req, res) => {
	Blog
    .find()
    .exec()
    .then(posts => {
    	res.json({
    		posts: posts.map(
    			(post) => post.apiRepr())
    	});
    })
    .catch(
      err => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
    });
});

router.get('/:id', (req, res) => {
	Blog
	.findById(req.params.id)
	.exec()
	.then(post => {
    	res.json(post.apiRepr());
    })
	.catch(err => {
		console.error(err);
		res.status(500).json({message: 'Post not Found: Internal Server Error'})
	});
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
		if(req.body.author.firstName == "" || req.body.author.lastName == "") {
			const message = {message:'A first and last name must be provided in the author field'}
			console.error(message);
			return res.status(400).json(message);
		}
	}
	Blog
	.create({
		title: req.body.title,
		author: {
			firstName:req.body.author.firstName,
			lastName:req.body.author.lastName
		},
		content: req.body.content,
		publishDate: req.body.publishDate
	})
	.then(post => res.status(201).json(post.apiRepr()))
	.catch(err => {console.error(err);
		res.status(500).json({message: 'Something went horribly wrong'});
		});
});

router.delete('/:id', (req, res) => {
	Blog
	.findByIdAndRemove(req.params.id)
	.exec()
	.then(blog => res.status(204).end())
	.catch(err => res.status(500).json({message: 'Item not deleted: internal server error'}));
});

router.put('/:id', jsonParser, (req, res) => {
	const toUpdate = {};
	const possibleFields = ['title','author','content'];

	if(!(req.body.postID)) {
		const message = {message: 'A post ID must be provided in the BODY a PUT request'};
		res.status(400).json(message);
	} else if(req.params.id != req.body.postID) {
		const message = {message: 'The parameter ID and request body ID do not match'};
		res.status(400).json(message);
	}

	possibleFields.forEach(field => {
		if(field in req.body) {
			toUpdate[field] = req.body[field];
	}
});
	Blog
	.findByIdAndUpdate(req.params.id, {$set: toUpdate})
	.exec()
	.then(post => res.status(201).json(post.apiRepr()))
	.catch(err => res.status(500).json({message: 'failed to update: internal server error'}));
});

module.exports = router;
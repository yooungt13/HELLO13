// Server.js
var express = require('express'),
	app = express(),
	mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost:27017/angular-toda');

// Configuration
app.configure(function() {
	// Find the static files
	app.use(express.static(__dirname + '/public'));
	// Displays a log of all request on the console
	app.use(express.logger('dev'));
	// Change the HTML POST method
	app.use(express.bodyParser());
	// Simulates DELETE and PUT
	app.use(express.methodOverride);
});

// Definite Model
var all = mongoose.model('All', {
	text: String
});

// Routes of API
// GET all TODOs
app.get('/api/todos', function(req, res) {
	Todo.find(function(err, todos) {
		if (err) {
			res.send(err);
		}
		res.json(todos);
	});
});

// POST that creates and returns all behind ALL creation
app.post('/api/todos', function(req, res) {
	Todo.create({
		text: req.body.text,
		done: false
	}, function(err, todo) {
		if (err) {
			res.send(err);
		}

		Todo.find(function(err, todos) {
			if (err) {
				res.send(err);
			}
			res.json(todos);
		});
	});
});

// DELETE a speciic and returns all after removing EVERYTHING
app.delete('/api/todos/:todo', function(req, res) {
	Todo.remove({
		_id: req.params.todo
	}, function(err, todo) {
		if (err) {
			res.send(err);
		}

		Todo.find(function(err, todos) {
			if (err) {
				res.send(err);
			}
			res.json(todos);
		});
	});
});

// Loads a simple HTML view where will our Single Page App
// Angular'll drive the F2E
app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

// Listen on port 8080 and the server runs
app.listen(8080, function() {
	console.log('App Listenning on port 8080');
});
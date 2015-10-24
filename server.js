// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8383; // set our port

var mongoose   = require('mongoose');
mongoose.connect('mongodb://fixwikimaps:fixwikimaps@ds043694.mongolab.com:43694/fixwikimaps'); // connect to our database
var Map     = require('./app/models/map');

// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});

// on routes that end in /maps
// ----------------------------------------------------
router.route('/maps')

	// create a map (accessed at POST http://localhost:8080/maps)
	.post(function(req, res) {
		
		var map = new Map();		// create a new instance of the Map model
		map.name = req.body.name;  // set the maps name (comes from the request)

		map.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Map created!' });
		});

		
	})

	// get all the maps (accessed at GET http://localhost:8080/api/maps)
	.get(function(req, res) {
		Map.find(function(err, maps) {
			if (err)
				res.send(err);

			res.json(maps);
		});
	});

// on routes that end in /maps/:map_id
// ----------------------------------------------------
router.route('/maps/:map_id')

	// get the map with that id
	.get(function(req, res) {
		Map.findById(req.params.map_id, function(err, map) {
			if (err)
				res.send(err);
			res.json(map);
		});
	})

	// update the map with this id
	.put(function(req, res) {
		Map.findById(req.params.map_id, function(err, map) {

			if (err)
				res.send(err);

			map.name = req.body.name;
			map.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Map updated!' });
			});

		});
	})

	// delete the map with this id
	.delete(function(req, res) {
		Map.remove({
			_id: req.params.map_id
		}, function(err, map) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});


// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
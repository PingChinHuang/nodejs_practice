const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const Canvas = require('canvas');
const mime = require('mime');
const path = require('path');
//const socket_io = require('socket.io');
const http = require('http');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	//res.send('Hello World, '  + req.url);
	res.render('index', {title: 'Login', action: '/login'});
})


app.get('/image', (req, res) => {
	fs.readFile(__dirname + '/public/image/CWT44201.jpg', (err, data) => {
		if (err) throw err;
		var img = new Canvas.Image;
		img.src = data;

		var canvas = new Canvas(img.width, img.height);
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, img.width, img.height);
	
		res.render('image', {title: 'Test Image', image_url: canvas.toDataURL()});
	})
})

app.get('/video', (req, res) => {
	//fs.readFile(__dirname + '/public/video/test.webm', (err, data) => {
		//if (err) throw err;
		//var img = new Canvas.Image;
		//img.src = data;

		//var canvas = new Canvas(1280, 720);
		//var ctx = canvas.getContext('2d');
		//ctx.drawVideo(img, 0, 0, img.width, img.height);
		res.render('video', {title: 'Test Video', 
								mp4_video_url: '/public/video/test.mp4',
								webm_video_url: '/public/video/test.webm'});
	//}
})

app.get('/public/video/test.*', (req, res) => {
	var file = __dirname + req.url;
	fs.stat(file, (err, stats) => {
		if (err) {
			res.status(404).send(req.url + 'is invalid.');
			console.log(err);
			return;
		}

		total = stats.size;
		console.log(total);
		var range = req.headers.range;
		console.log(range);
		var position = range.replace(/bytes=/, '').split('-');
		console.log(position);
		var start = parseInt(position[0], 10);
		var end = position[1] ? parseInt(position[1], 10) : total - 1;
		var chunksize = (end - start) + 1;

		res.writeHead(206, {
			'Content-Range' : 'bytes ' + start + '-' + end + '/' + total,
			'Accept-Ranges' : 'bytes',
			'Content-Length' : chunksize,
			'Content-Type' : 'video/webm'
		});

		var videostream = fs.createReadStream(file, {start : start, end : end});
		videostream.on('open', () => {
			//res.end(data.slice(start, end + 1), 'binary');
			videostream.pipe(res);
		});

		videostream.on('error', err => {
			res.end(err);
		});
	});
})

app.get('/download', (req, res) => {
	res.render('download', {title: 'Download Image',
		image_url: 'http://127.0.0.1:8081/public/image/CWT44201'});
})

app.get('/public/image/*', (req, res) => {
	var filepath = '.' + req.url + '.jpg';
	var filename = path.basename(filepath);
	var mimetype = mime.lookup(filepath);

	// Use file stream
	/*fs.stat(filepath, (err, stats) => {
		console.log(stats.size);
		res.writeHeader(200, 
			{'Content-disposition' : 'attachment; filename=' + filename,
				'Content-type' : mimetype,
				'Content-Length' : stats.size 
			});
	});

	console.log(mimetype);

	var file = fs.createReadStream(filepath);
	file.pipe(res);
	file.on('finish', (err, data) => {
		file.close();
	})
	file.on('error', (err) => {
		console.log(err);
	})*/

	// express API
	res.download(filepath, filename, err => {
		if (err) console.log(err);

	})
})

app.post('/login', (req, res) => {
	console.log(req.body)
	res.render('welcome', {
		title: 'welcome', name: req.body.name 
	}) 
})

app.get('/test', (req, res) => {
	//res.send('Hello World, '  + req.url);
	res.render('index', {title: 'Hey', user: 'Audy'});
	console.log(req.query.name);
	console.log(req.query.arg);
})

app.use('/gallery', require('node-gallery')({
	staticFiles: '../../../../../../media/superod/DATA/Photos/',
	urlRoot: 'gallery',
	title: 'Example Gallery',
	render: false
}), function (req, res, next) {
	return res.send(req.html);
});

app.use('/socketio', (req, res) => {
	res.render('socketio', {
		title: 'socketio' 
	}) 
});


var server = http.createServer(app);
var io = require('socket.io')(server);
	
server.listen(8081, () => {
	var host = server.address().adress;
	var port = server.address().port;

	console.log('http://%s:%s', host, port);
});

io.on('connection', client => {
	console.log('Connection established.');
	client.on('test', data => {
		console.log(data);
		io.emit('test_resp', '12345678');
	});

	client.on('disconnect', () => {
		console.log('Client disconnected.');
	});
});

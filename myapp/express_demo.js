const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	//res.send('Hello World, '  + req.url);
	res.render('index', {title: 'Login', action: '/login'});
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


var server = app.listen(8081, () => {
	var host = server.address().adress;
	var port = server.address().port;

	console.log('http://%s:%s', host, port);
})

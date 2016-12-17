const http=require('http');
const querystring=require('querystring');


var postData = querystring.stringify({
	'msg': 'Hello World!'
});

var options = {
	host: '127.0.0.1',
	port: 8081,
	path: '/test',
	method: 'POST', 
	headers: {
		'Content-Type' : 'test/plain',
		'Content-Length' : Buffer.byteLength(postData)
	}
};

var req = http.request(options, res => {
	console.log(res.statusCode);
	console.log(res.headers);

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', chunk => {
			console.log("Get Data");
			rawData += chunk;
		});
		res.on('end', () => {
			try {
				console.log(rawData);
			} catch (e) {
				console.log(e.message);
			}
		});
});

req.on('error', e => {
	console.log(e.message);
});
req.write(postData);
req.end();

/*http.get('http://127.0.0.1:8081/', (res) => {
		var statusCode = res.statusCode;
		console.log(statusCode);
		console.log(res.headers);

		res.setEncoding('utf8');
		let rawData = '';
		res.on('data', chunk => {
			console.log("Get Data");
			rawData += chunk;
		});
		res.on('end', () => {
			try {
				console.log(rawData);
			} catch (e) {
				console.log(e.message);
			}
		});

});*/

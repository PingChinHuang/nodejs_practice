const http = require("http");
const qs = require('querystring');

http.createServer((request, response) => {
	console.log(request.headers);
	console.log(request.url);
	console.log(request.method);

	let post_data = '';
	request.on('data', data=> {
		post_data += data;
	});

	request.on('end', () => {
		try {
			console.log(qs.parse(post_data));
		} catch (e) {

		}
	})

	response.writeHead(200, {'Content-Type':'text/plain'});

	response.write('test data\n');
	response.end('Hello World\n');
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081');

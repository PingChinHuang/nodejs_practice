const net = require('net');
const fs = require('fs');

const myServer = net.createServer(c => {
		c.on('end', () => {
			console.log('Client disconnected');
		});

		c.on('error', (err) => {
			console.log(err.toString());
		});

		c.on('data', (filename) => {
			console.log('Read File:' + filename.toString());
			fs.readFile(filename, (err, data) => {
				if (err) {
					console.error(err.toString());
					throw err;
				} else {
					c.write(data);
				}
			})
		})

		//c.write('hello\r\n');
		//c.pipe(c);
}).listen(1234, '127.0.0.1', () => {
	console.log('server bound');
});

myServer.on('error', (err) => {
		throw err;
});


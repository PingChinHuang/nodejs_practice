const net = require('net');
const readline = require('readline');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: 'node_test> '	
});

rl.prompt();

rl.on('line', line => {
	var client = net.createConnection({port: 1234}, () => {	
		console.log('connect to server');
		client.write(line);
	});

	client.on('data', (data) => {
		console.log(data.toString());
		client.end();
	});
	client.on('end', () => {
		console.log('disconnected from server');
	});
	client.on('error', (err) => {
		console.log(err.toString());
	});
}).on('close', () => {
	console.log('Exit!');
	process.exit(0);
});


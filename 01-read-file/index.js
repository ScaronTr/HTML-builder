const path = require('path');
const fs = require('fs');
const { stdout } = process;

const readableStream = fs.createReadStream(path.join(__dirname, 'text.txt'));
readableStream.on('data', data => stdout.write(data.toString()));

const path = require('path');
const fs = require('fs');
const { stdin, stdout } = require('process');

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => (err) ? console.log(err) : null);
stdout.write('Пожалуйста, введите текст\n');

stdin.on('data', (data) => {
   data = data.toString();
   if (data.trim() === 'exit') process.exit();
   fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => (err) ? console.log(err) : null);
});

process.on('SIGINT', () => process.exit());
process.on('exit', () => {
   stdout.write('Завершение работы');
});

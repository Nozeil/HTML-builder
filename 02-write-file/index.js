const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const filePath = path.join(__dirname, './text.txt');
const writableStream = fs.createWriteStream(filePath);

const close = (condition) => {
  if (condition) {
    process.exit(stdout.write('Досвидания'));
  }
};

stdout.write('Введите текст\n');

stdin.on('data', data => {
  close(data.toString().trim() === 'exit');
  writableStream.write(data);
});

process.on('SIGINT', signal => {
  close(signal);
}); 





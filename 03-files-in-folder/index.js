const fs = require('fs');
const { stdout } = process;
const path = require('path');
const kbCoefficient = 1000;

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err.message);
  }
  files.filter(dirent => dirent.isFile()).forEach(dirent => {
    const filePath = path.join(__dirname, 'secret-folder', dirent.name);
    const ext = path.extname(filePath);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err.message);
      }
      stdout.write(`${path.basename(filePath, ext)} - ${ext.slice(1)} - ${stats.size / kbCoefficient}kb\n`);
    });

  });
});
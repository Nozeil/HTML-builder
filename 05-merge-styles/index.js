const fs = require('fs');
const path = require('path');

const { readdir } = require('fs/promises');

createBundle();

async function createBundle() {
  const bundlePath = path.resolve(__dirname, 'project-dist', 'bundle.css');
  const writeStream = fs.createWriteStream(bundlePath);

  try {
    const files = (await readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true })).filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.css').map(dirent => dirent.name);

    files.forEach(file => {
      const readStream = fs.createReadStream(path.resolve(__dirname, 'styles', file), 'utf-8');
      readStream.pipe(writeStream);
    });

  } catch (err) {
    console.error(err.message);
  }

}




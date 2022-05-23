const fs = require('fs');
const path = require('path');

const { mkdir, readdir, access, rm, copyFile } = require('fs/promises');

createBundle();

async function createBundle() {
  try {
    await createIndexHtml();
    await createStyle();
    await copyDirs();
  } catch (err) {
    console.error(err.message);
  }

}

async function createDir() {
  try {
    await mkdir(path.resolve(__dirname, 'project-dist'), { recursive: true });
  } catch (err) {
    console.error(err.message);
  }
}

async function createIndexHtml() {

  try {
    await createDir();
  } catch (err) {
    console.error(err.message);
  }

  const readStream = fs.createReadStream(path.resolve(__dirname, 'template.html'), 'utf-8');

  const startSelector = '{{';
  const endSelector = '}}';
  const selectorLength = 2;

  let data = '';
  let selectors = [];

  readStream.on('data', chunk => {
    data += chunk;
    let tempData = data;

    while (tempData.indexOf(startSelector) !== -1) {
      const selector = tempData.substring(tempData.indexOf(startSelector) + selectorLength, tempData.indexOf(endSelector));
      selectors.push(selector);
      tempData = tempData.slice(tempData.indexOf(endSelector) + selectorLength);
    }

    for (let selector of selectors) {

      const selectorReadStream = fs.createReadStream(path.resolve(__dirname, 'components', selector + '.html'), 'utf-8');
      const selectorWriteStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'index.html'));

      selectorReadStream.on('data', tempChunk => {
        data = data.replace((startSelector + selector + endSelector), tempChunk);
        selectorWriteStream.write(data);
      });
    }

  });

}

async function createStyle() {
  const writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist', 'style.css'));

  try {
    let files = (await readdir(path.resolve(__dirname, 'styles'), { withFileTypes: true })).filter(dirent => dirent.isFile() && path.extname(dirent.name) === '.css').map(dirent => dirent.name);

    files.push(files.splice(files.indexOf('footer.css'), 1).join(''));

    files.forEach(file => {
      const readStream = fs.createReadStream(path.resolve(__dirname, 'styles', file), 'utf-8');
      try {
        readStream.pipe(writeStream, { end: false });
      } catch (err) {
        console.error(err.message);
        writeStream.close();
      }

    });

  } catch (err) {
    console.error(err.message);
  }

}

async function isFolderExist(dir) {
  let answer;

  try {
    await access(path.resolve(__dirname, 'project-dist', 'assets', dir), fs.constants.F_OK);
    answer = true;
  } catch {
    answer = false;
  }

  return answer;
}

async function removeFiles(dir) {
  try {
    const files = await readdir(path.resolve(__dirname, 'project-dist', 'assets', dir));

    for (const file of files) {
      try {
        await rm(path.resolve(__dirname, 'project-dist', 'assets', dir, file));
      } catch (err) {
        console.error(err.message);
      }

    }
  } catch (err) {
    console.error(err.message);
  }
}

async function createFolder(dir) {
  try {
    await mkdir(path.resolve(__dirname, 'project-dist', 'assets', dir), { recursive: true });
  } catch (err) {
    console.error(err.message);
  }
}

async function copyFiles(dir) {

  await createFolder(dir);

  try {
    const files = await readdir(path.resolve(__dirname, 'assets', dir), { withFileTypes: true });

    for (const file of files) {
      try {
        await copyFile(path.resolve(__dirname, 'assets', dir, file.name), path.resolve(__dirname, 'project-dist', 'assets', dir, file.name));
      } catch (err) {
        console.error(err.message);
      }
    }
  } catch (err) {
    console.error(err.message);
  }

}

async function copyDir(dir) {

  const exist = await isFolderExist(dir);
  if (exist) {
    await removeFiles(dir);
  }
  await copyFiles(dir);
}

async function copyDirs() {
  try {
    const dirs = await readdir(path.resolve(__dirname, 'assets'));

    for (const dir of dirs) {
      try {
        await copyDir(dir);
      } catch (err) {
        console.error(err.message);
      }

    }
  } catch (err) {
    console.error(err.message);
  }
}


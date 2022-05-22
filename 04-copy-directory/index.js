const fs = require('fs');
const path = require('path');
const { access, readdir, rm, mkdir, copyFile } = require('fs/promises');

copyDir();

async function isFolderExist() {
  let answer;

  try {
    await access(path.resolve(__dirname, 'files-copy'), fs.constants.F_OK);
    answer = true;
  } catch {
    answer = false;
  }

  return answer;
}

async function removeFiles() {
  try {
    const files = await readdir(path.resolve(__dirname, 'files-copy'));

    for (const file of files) {
      try {
        await rm(path.resolve(__dirname, 'files-copy', file));
      } catch (err) {
        console.error(err.message);
      }

    }
  } catch (err) {
    console.error(err.message);
  }
}

async function createFolder() {
  try {
    await mkdir(path.resolve(__dirname, 'files-copy'), { recursive: true });
  } catch (err) {
    console.error(err.message);
  }
}

async function copyFiles() {

  await createFolder();

  try {
    const files = await readdir(path.resolve(__dirname, 'files'), { withFileTypes: true });

    for (const file of files) {
      try {
        await copyFile(path.resolve(__dirname, 'files', file.name), path.resolve(__dirname, 'files-copy', file.name));
      } catch (err) {
        console.error(err.message);
      }
    }
  } catch (err) {
    console.error(err.message);
  }

}

async function copyDir() {

  const exist = await isFolderExist();
  if (exist) {
    await removeFiles();
  }
  await copyFiles();
}

const path = require('path');
const fs = require('fs');

copyDir();

async function copyDir() {
   fs.readdir(__dirname, (err, files) => {
      if (err) return console.log(err);

      if (files.includes('files-copy')) {
         fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
            if (err)
               return console.log(err);
            files.forEach((item) => {
               fs.unlink(path.join(__dirname, 'files-copy', item), (err) => err ? console.log(err) : null);
            });
         });
      } else {
         fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => err ? console.log(err) : null);
      }

      fs.readdir(path.join(__dirname, 'files'), (err, files) => {
         if (err) return console.log(err);
   
         files.forEach((item) => {
            fs.copyFile(path.join(__dirname, 'files', item), path.join(__dirname, 'files-copy', item), (err) => err ? console.log(err) : null);
         });
      });
   });
}

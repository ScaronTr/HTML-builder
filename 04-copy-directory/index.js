const path = require('path');
const fs = require('fs');

// copyDir();

// async function copyDir() {
//    fs.readdir(__dirname, (err, files) => {
//       if (err) return console.log(err);

//       if (files.includes('files-copy')) {
//          fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
//             if (err)
//                return console.log(err);
//             files.forEach((item) => {
//                fs.unlink(path.join(__dirname, 'files-copy', item), (err) => err ? console.log(err) : null);
//             });
//          });
//       } else {
//          fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => err ? console.log(err) : null);
//       }

//       fs.readdir(path.join(__dirname, 'files'), (err, files) => {
//          if (err) return console.log(err);
   
//          files.forEach((item) => {
//             fs.copyFile(path.join(__dirname, 'files', item), path.join(__dirname, 'files-copy', item), (err) => err ? console.log(err) : null);
//          });
//       });
//    });
// }

copyDir();

function copyDir() {
   
   let baseSrc = __dirname;
   let currentSrc = __dirname;
   let currentDir = 'files';
   let newDir = 'files-copy'; 

   createNewDir(baseSrc, newDir)

   function createNewDir(baseSrc, newDir) {
      fs.readdir(baseSrc, async (err, files) => {
         if (err) return console.log(err);

         if (files.includes(newDir)) {
            await fs.promises.rm(path.join(baseSrc, newDir), { recursive: true }, (err) => err ? console.log(err) : null);
         }
         fs.mkdir(path.join(baseSrc, newDir), { recursive: true }, (err) => err ? console.log(err) : null);
         
         copy(baseSrc, currentSrc, currentDir, newDir);
      });
   }

   function copy(baseSrc, currentSrc, currentDir, newDir) {

      fs.readdir(path.join(currentSrc, currentDir), { withFileTypes: true }, (err, files) => {
         if (err) return console.log(err);

         files.forEach((item) => {
            if (item.isFile()) {
               fs.copyFile(path.join(currentSrc, currentDir, item.name), path.join(baseSrc, newDir, item.name), (err) => err ? console.log(err) : null);
            } else if (item.isDirectory()) {
               fs.mkdir(path.join(baseSrc, newDir, item.name), { recursive: true }, (err) => err ? console.log(err) : null);
               copy(baseSrc, path.join(currentSrc, currentDir), item.name, path.join(newDir, item.name));
            }
         });
      });
   }
}
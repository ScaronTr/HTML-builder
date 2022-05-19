const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true } , (err, files) => {
   if (err) return console.log(err);

   const writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

   files.forEach((item) => {
      if (item.isFile() && path.parse(item.name).ext === '.css') {
         let readableStream = fs.createReadStream(path.join(__dirname, 'styles', item.name));
         readableStream.pipe(writableStream);
      }
   });
})
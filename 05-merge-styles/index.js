const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true } , async (err, files) => {
   if (err) return console.log(err);

   let dir = await fsPromises.readdir(path.join(__dirname, 'project-dist'));
   if (dir.includes('bundle.css')) {
      await fsPromises.unlink(path.join(__dirname, 'project-dist', 'bundle.css'));
   }
   await fsPromises.writeFile(path.join(__dirname, 'project-dist', 'bundle.css'), '');

   files.forEach(async (item) => {
      if (item.isFile() && path.parse(item.name).ext === '.css') {
         let data = await fsPromises.readFile(path.join(__dirname, 'styles', item.name), 'utf-8');
         fsPromises.appendFile(path.join(__dirname, 'project-dist', 'bundle.css'), data);
      }
   });
})
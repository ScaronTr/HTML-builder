const path = require('path');
const fs = require('fs');
const { stdout } = process;

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true} , (err, files) => {
   if (err) return console.log(err);
   
   files.forEach((item) => {
      if (item.isFile()) {
         fs.stat(path.join(__dirname, 'secret-folder', item.name), (err, stats) => {
            if (err) return console.log(err);
            stdout.write(`${path.parse(item.name).name} -- ${(path.parse(item.name).ext).slice(1)} -- ${(stats.size / 1024).toFixed(3)} kb\n`);
         })
      }
   });
})

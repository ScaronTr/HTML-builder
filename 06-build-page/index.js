const path = require('path');
const fs = require('fs');
const { Transform, pipeline } = require('stream');
const fsPromises = require('fs').promises;

createDist();

function createDist() {
   
   let baseSrc = __dirname;
   let currentSrc = __dirname;
   let currentDir = 'assets';
   let newDir = 'project-dist'; 

   createNewDir(baseSrc, newDir)

   async function createNewDir(baseSrc, newDir) {
      let files = await fsPromises.readdir(baseSrc);
      if (files.includes(newDir)) {
         await fs.promises.rm(path.join(baseSrc, newDir), { recursive: true }, (err) => err ? console.log(err) : null);
      }
      await fs.promises.mkdir(path.join(baseSrc, newDir), { recursive: true }, (err) => err ? console.log(err) : null);
      await fs.promises.mkdir(path.join(baseSrc, newDir, currentDir), { recursive: true }, (err) => err ? console.log(err) : null);

      copyFiles(baseSrc, currentSrc, currentDir, path.join(newDir, currentDir));
      createHtmlBundle();
      createCssBundle();
   }

   function copyFiles(baseSrc, currentSrc, currentDir, newDir) {
      fs.readdir(path.join(currentSrc, currentDir), { withFileTypes: true }, (err, files) => {
         if (err) return console.log(err);

         files.forEach((item) => {
            if (item.isFile()) {
               fs.copyFile(path.join(currentSrc, currentDir, item.name), path.join(baseSrc, newDir, item.name), (err) => err ? console.log(err) : null);
            } else if (item.isDirectory()) {
               fs.mkdir(path.join(baseSrc, newDir, item.name), { recursive: true }, (err) => err ? console.log(err) : null);
               copyFiles(baseSrc, path.join(currentSrc, currentDir), item.name, path.join(newDir, item.name));
            }
         });
      });
   }

   function createHtmlBundle() {
      const transform = new Transform({
         async transform(chunk) {
            let chunkStringified = chunk.toString();
            let chunkArray = chunkStringified.split('\n');
      
            let countleftSpaces;
            let data;
            for (let item of chunkArray) {
               if (item.includes('{{')) {
                  countleftSpaces = item.indexOf('{');
                  let itemTrimmed = item.trim();
                  item = item.trim();
                  item = item.slice(2, item.length - 2);               

                  data = await fsPromises.readFile(path.join(__dirname, 'components', `${item}.html`), 'utf-8');
                  data = data.split('\n');
                  data.forEach((item, index) => {
                     if (index != 0) data[index] = item.padStart(item.length + countleftSpaces);
                  })
                  data = data.join('\n');
      
                  chunkStringified = chunkStringified.replace(itemTrimmed, data);
               }
            }
            this.push(chunkStringified);
         }
      })
      


      const readableStream = fs.createReadStream(path.join(__dirname, 'template.html'));
      const writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
      
      pipeline(
         readableStream,
         transform,
         writableStream,
         (err) => {
            if (err) console.log(err);
         }
      )
   }
   
   function createCssBundle() {
      fs.readdir(path.join(__dirname, 'styles'), { withFileTypes: true } , (err, files) => {
         if (err) return console.log(err);
      
         let writableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
      
         files.forEach((item) => {
            if (item.isFile() && path.parse(item.name).ext === '.css') {
               let readableStream = fs.createReadStream(path.join(__dirname, 'styles', item.name));
               readableStream.pipe(writableStream);
            }
         });
      })
   }
}

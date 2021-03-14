const resolve = require('path').resolve
const fs = require('fs')
const sharp = require('sharp');

// joining path of directory
const inputFolder = 'test'
const outputFolder = 'image2'

const jpgOption = {
  quality: 60,
  trellisQuantisation: true,
  optimizeScans: true,
  quantisationTable: 4,
  force: false
}
const webpOption = {
  quality: 75
}
const resizeSize = [320, 480, 600, 720, 1024, 1440, 1920, 2560]
const directoryPath = resolve(__dirname, `./${inputFolder}`)
// passsing directoryPath and callback function
fs.readdir(directoryPath, (err, files) => {
  // handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }

  files.forEach((file, index) => {

    let name = file.slice(0, -4)

    resizeSize.forEach(size => {
      sharp(`./${inputFolder}/${file}`)
        .resize(size, null)
        .webp(webpOption)
        .toFile(`./${outputFolder}/${size}_${name}.webp`)

      sharp(`./${inputFolder}/${file}`)
        .resize(size, null)
        .jpeg(jpgOption)
        .toFile(`./${outputFolder}/${size}_${name}.jpg`)
    });
  })
})
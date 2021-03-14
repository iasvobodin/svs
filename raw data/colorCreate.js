const resolve = require('path').resolve
const fs = require('fs')
const ColorThief = require('colorthief');

// joining path of directory
const directoryPath = resolve(__dirname, './image')
// passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
  // handling error
  if (err) {
    return console.log('Unable to scan directory: ' + err)
  }
  const color = []
  console.log(files)
  const ff = files.filter(el => el.endsWith('jpg'))
  ff.forEach((file, index) => {


    (async () => {
      const data = await ColorThief.getPalette(`./image/${file}`, 5)
      // пушим все цвета объектами
      color.push({
        color: data,
        Name: file,
        id: index,
      })
      // записываем в файл
      try {
        fs.writeFileSync('./color.json', JSON.stringify(color, null, 2))
        console.log(`file color.json ${index} is redy`)
      } catch (error) {
        console.log(error)
      }
    })()
  })
})
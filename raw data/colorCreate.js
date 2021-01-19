// import df from './'
// const sqip = require('sqip').default
const resolve = require('path').resolve
const fs = require('fs')
const lqip = require('lqip')

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

  files.forEach((file, index) => {
    ;(async () => {
      const data = await lqip.palette(`./image/${file}`)
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
  // })

  // files.forEach((file, index) => {
  //   (async () => {
  //     const data = await sqip({
  //       input: `../img2/${file}`,
  //       plugins: [{
  //         name: 'primitive',
  //         options: {
  //           numberOfPrimitives: 25,
  //           mode: 8,
  //           alpha: 0
  //         }
  //       },
  //       {
  //         name: 'blur',
  //         options: {
  //           blur: 15
  //         }
  //       },
  //       // 'blur',
  //       'svgo',
  //       'data-uri'
  //       ]
  //     })
  //     // пушим все цвета объектами
  //     color.push({
  //       svg: data.content,
  //       Name: file,
  //       id: index,
  //       background: data.metadata.dataURI
  //     })
  //     // записываем в файл
  //     try {
  //       fs.writeFileSync('./colorrr.json', JSON.stringify(color, null, 2))
  //       console.log(`file color.json ${index} is redy`)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   })()
  // })
})

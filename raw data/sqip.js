// import path from 'path'
// import { resolve} from 'path'
// import sqip from 'sqip' // in node will be => const sqip = require('sqip').default
// const __dirname = path.resolve();
const sqip = require('sqip').default
// console.log(path.resolve('src/image'));

;(async () => {
  try {
    // Process whole folder with default settings
    const folderResults = await sqip({
      input: '../image',
      output: '../prev2',
      // width: 620,
      plugins: [
        {
          name: 'primitive',
          options: {
            numberOfPrimitives: 65,
            mode: 0,
            alpha: 0,
            // rep: 5
          },
        },
        // {
        //   name: 'blur',
        //   options: {
        //     blur: 30
        //   }
        // },
        'svgo',
        'data-uri',
      ],
    })
    console.log(folderResults)
  } catch (err) {
    console.log('Something went wrong generating the SQIP previews')
    console.error(err)
  }
})()

// // // requiring path and fs modules
// const resolve = require('path').resolve
// const fs = require('fs')
// // // const lqip = require('lqip')

// // joining path of directory
// const directoryPath = resolve(__dirname, '../img2')
// // passsing directoryPath and callback function
// fs.readdir(directoryPath, function (err, files) {
//   // handling error
//   if (err) {
//     return console.log('Unable to scan directory: ' + err)
//   }
//   const color = []

//   files.forEach((file, index) => {
//     (async () => {
//       const data = await sqip({
//         input: `src/image/${file}`,
//         plugins: [{
//           name: 'primitive',
//           options: {
//             numberOfPrimitives: 25,
//             mode: 8,
//             alpha: 0
//           }
//         },
//         {
//           name: 'blur',
//           options: {
//             blur: 15
//           }
//         },
//         // 'blur',
//         'svgo',
//         'data-uri',
//         ]
//       })
//       // пушим все цвета объектами
//       color.push({
//         svg:data.content,
//         Name: file,
//         id: index,
//         background: data.metadata.dataURI
//       })
//       // записываем в файл
//       try {
//         fs.writeFileSync('src/db/color2.json', JSON.stringify(color, null, 2))
//         console.log(`file color.json ${index} is redy`)
//       } catch (error) {
//         console.log(error)
//       }
//     })()
//   })
// })

// //   files.forEach((file, index) => {
// //     (async () => {
// //       const data = await lqip.palette(`src/image/${file}`)
// //       // пушим все цвета объектами
// //       color.push({
// //         color: data,
// //         Name: file,
// //         id: index
// //       })
// //       // записываем в файл
// //       try {
// //         fs.writeFileSync('src/db/color.json', JSON.stringify(color, null, 2))
// //         console.log(`file color.json ${index} is redy`)
// //       } catch (error) {
// //         console.log(error)
// //       }
// //     })()
// //   })
// // })

// import sqip from 'sqip' // in node will be => const sqip = require('sqip').default
// import { resolve } from 'path'

// ;(async () => {
//   try {
//     // Process whole folder with default settings
//     const folderResults = await sqip({
//       input:'src/img2',
//       output: 'src/prev3'
//     })
//     console.log(folderResults)
//   } catch (err) {
//     console.log('Something went wrong generating the SQIP previews')
//     console.error(err)
//   }
// })()

// import df from '../src/'
/* eslint-disable no-console */

const fs = require('fs')
const data = JSON.parse(fs.readFileSync('./data.json'))
const color = JSON.parse(fs.readFileSync('./color.json'))
const db = JSON.parse(fs.readFileSync('./db.json'))

function hex2rgb(hex, opacity) {
  let h = hex.replace('#', '')
  h = h.match(new RegExp('(.{' + h.length / 3 + '})', 'g'))
  for (let i = 0; i < h.length; i++)
    h[i] = parseInt(h[i].length === 1 ? h[i] + h[i] : h[i], 16)
  if (typeof opacity !== 'undefined') h.push(opacity)
  return 'rgba(' + h.join(',') + ')'
}
// сортируем все фотки по названию
data.sort(function (a, b) {
  const nameA = a.FileName.toLowerCase()
  const nameB = b.FileName.toLowerCase()
  if (nameA < nameB) {
    return -1
  }
})
// сортируем исходный файл убираем всё ненужное
const lightData = data.map((el) => {
  return {
    Name: el.FileName.slice(0, -4),
    Params: {
      Colors: color
        .find((e) => e.Name === el.FileName)
        .color.map((e) => hex2rgb(e)),
      Color: color.find((e) => e.Name === el.FileName).color[0],
      Sh: el.ShutterSpeedValue,
      F: el.ApertureValue,
      Fl: +el.FocalLength.slice(0, -3),
    },
    Aspect: +(el.ImageWidth / el.ImageHeight).toFixed(3),
    Keywords: el.Keywords,
  }
})
// const db2 = db
// db2.filter(el => el.Props.Type === 'Series')

db.Series.forEach((el) => {
  el.ImageName = lightData
    .filter((image) => image.Keywords.includes(el.Name))
    .map((image) => image.Name)
  el.Aspect = lightData
    .filter((image) => image.Keywords.includes(el.Name))
    .map((image) => image.Aspect)
  el.Cover = lightData
    .filter((image) => image.Keywords.includes(el.Name))
    .find((image) => image.Keywords.includes('cover'))
  el.Portrait = lightData
    .filter((image) => image.Keywords.includes(el.Name))
    .filter((image) => image.Keywords.includes('portrait'))
    .map((image) => image.Name)[0]
  el.PortraitAspect = lightData
    .filter((image) => image.Keywords.includes(el.Name))
    .filter((image) => image.Keywords.includes('portrait'))
    .map((image) => image.Aspect)[0]
  el.Spec = lightData
    .filter((image) => image.Keywords.includes(el.Name))
    .map((image) => image.Params)
  try {
    let name = el.Name.toLowerCase()
    fs.writeFileSync(
      `../static/db/${name}.json`,
      JSON.stringify(el, null, 2)
    )
    console.log(`file ${name} is redy`)
  } catch (error) {
    console.log(error)
  }
  // const data2 = JSON.stringify(map, null, 2)
})

try {
  fs.writeFileSync('../static/db/all.json', JSON.stringify(db.Series, null, 2))
  console.log('file ALLLL is redy')
} catch (error) {
  console.log(error)
}

function hexToRGB(h, isPct) {
  let r = 0
  let g = 0
  let b = 0
  isPct = isPct === true
  // eslint-disable-next-line eqeqeq
  if (h.length == 4) {
    r = '0x' + h[1] + h[1]
    g = '0x' + h[2] + h[2]
    b = '0x' + h[3] + h[3]
    // eslint-disable-next-line eqeqeq
  } else if (h.length == 7) {
    r = '0x' + h[1] + h[2]
    g = '0x' + h[3] + h[4]
    b = '0x' + h[5] + h[6]
  }

  r = +((r / 255) * 100).toFixed(1)
  g = +((g / 255) * 100).toFixed(1)
  b = +((b / 255) * 100).toFixed(1)

  return [r / 100, g / 100, b / 100]
}
const photoseries = db.Series.map((el, index) => {
  return {
    Id: index,
    Route: el.Name.toLowerCase(),
    Title: el.Title,
    LandscapeFileName: el.Cover.Name,
    PortraitFileName: el.Portrait,
    PortraitAspect: el.PortraitAspect,
    LandscapeAspect: el.Cover.Aspect,
    ColorHex: el.Cover.Params.Color,
    ColorVector: hexToRGB(el.Cover.Params.Color),
  }
})

try {
  fs.writeFileSync(
    '../static/db/Photoseries.json',
    JSON.stringify(photoseries, null, 2)
  )
  console.log('file Photoseries.json is redy')
} catch (error) {
  console.log(error)
}

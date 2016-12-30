'use strict'

const csv = require('csv')
const fs  = require('fs')

/* @flow */

function isFilePresent(filepath: string) {
  try {
    fs.accessSync(filepath)
    return true
  } catch(e) {
    return false
  }
}

function initStream(filepath: string) {
    let readStream = fs.createReadStream(filepath)
    return readStream.pipe(csv.parse())
}

function readNLines(start: number, end: number, skipHeader: boolean) {
    if(skipHeader === undefined) skipHeader = true

    let rowCount = 0
    let transform = csv.transform((row, cb) => {
        let result;

        if(skipHeader && rowCount === 0) {
            result = null
        } else if(start == 0 && end == -1) {
            result = row
        } else if(start <= rowCount && end >= rowCount) {
            result = row;
        } else {
            result = null
        }

        rowCount++;
        cb(null, result)
    })

    return transform
}

function countLines(filepath: string, cb) {
    let parser = csv.parse()
    fs.createReadStream(filepath).pipe(parser).on('finish', () => cb(null, parser.count - 1))
}

function getCSVHeader(filepath: string, cb) {
    let parseStream = initStream(filepath)
    let transform = readNLines(0, 0, false);
    let header;

    parseStream.pipe(transform).on('readable', () => {
        let _header = transform.read()

        if(_header) header = _header
    }).on('finish', () => {
        cb(null, header)
    }).on('error', e => {
        console.log(e)
    })
}

function getCSVData(filepath: string, start: number, end: number, cb) {
  let parseStream = initStream(filepath)
  let transform = readNLines(start, end, true)
  let data = []

  parseStream.pipe(transform).on('readable', () => {
    let tdata = transform.read()

    if(tdata) data.push(tdata)
  }).on('finish', () => {
    cb(null, data)
  })
}

// const filePath = "./data/movies.csv"
// getCSVHeader(filePath, (err, data) =>{ console.log(data) })
// getCSVData(filePath, 1, 20, (err, data) => { console.log(data.length) })
// setTimeout(() => {
//   getCSVData(filePath, 2, 30, (err, data) => { console.log(data.length) })
// })

module.exports = {
    isFilePresent: isFilePresent,
    countLines: countLines,
    getCSVData: getCSVData,
    getCSVHeader: getCSVHeader
}

'use strict'

const csv = require('csv')
const fs  = require('fs')
const parse = csv.parse()

let readStream;
let parseStream;

/* @flow */
function readNLines(start: number, end: number, skipHeader: boolean = true) {
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

function getCSVHeader(filepath: string, cb) {
    if(!readStream) readStream = fs.createReadStream(filepath)
    let transform = readNLines(0, 0, false);
    let header;

    if(!parseStream) parseStream = readStream.pipe(parse)
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
  if(!readStream) readStream = fs.createReadStream(filepath)
  if(!parseStream) parseStream = readStream.pipe(parse)

  let transform = readNLines(start, end, true)
  let data = []

  console.log(start, end);

  parseStream.pipe(transform).on('readable', () => {
    let tdata = transform.read()

    if(tdata) data.push(tdata)
  }).on('finish', () => {
    console.log(data)
    cb(null, data)
  })
}

// const filePath = "./data/movies.csv"
// getCSVHeader(filePath)
// getCSVData(filePath, 2, 10)

module.exports = {
    getCSVData: getCSVData,
    getCSVHeader: getCSVHeader
}

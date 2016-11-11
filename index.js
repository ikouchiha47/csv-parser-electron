'use strict'

const csv = require('csv')
const fs  = require('fs')
const parse = csv.parse()

let readStream;
let parseStream;

/* @flow */
function readNLines(start: number, end: number, skipHeader = true) {
    let rowCount = 0
    let transform = csv.transform((row, cb) => {
        let result;

        if(skipHeader && rowCount === 0) {
            result = null
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

function getCSVHeader(filepath: string) {
    if(!readStream) readStream = fs.createReadStream(filepath)
    let transform = readNLines(0, 0, false);

    if(!parseStream) parseStream = readStream.pipe(parse)
    parseStream.pipe(transform).on('readable', () => {
        let header = transform.read()
        if(header) console.log(header)
    })
}

function getCSVData(filepath: string, start: number, end: number) {
    let transform = readNLines(start, end, true)
    let data = []

    parseStream.pipe(transform).on('readable', () => {
        let tdata = transform.read()
    
        if(tdata) data.push(tdata)
    }).on('finish', () => {
        console.log(data)
    })
}

const filePath = "./data/movies.csv"

getCSVHeader(filePath)
getCSVData(filePath, 2, 10)
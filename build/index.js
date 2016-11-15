'use strict';

var csv = require('csv');
var fs = require('fs');
var parse = csv.parse();

var readStream = void 0;
var parseStream = void 0;


function readNLines(start, end) {
    var skipHeader = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

    var rowCount = 0;
    var transform = csv.transform(function (row, cb) {
        var result = void 0;

        if (skipHeader && rowCount === 0) {
            result = null;
        } else if (start == 0 && end == -1) {
            result = row;
        } else if (start <= rowCount && end >= rowCount) {
            result = row;
        } else {
            result = null;
        }

        rowCount++;
        cb(null, result);
    });

    return transform;
}

function getCSVHeader(filepath, cb) {
    if (!readStream) readStream = fs.createReadStream(filepath);
    var transform = readNLines(0, 0, false);
    var header = void 0;

    if (!parseStream) parseStream = readStream.pipe(parse);
    parseStream.pipe(transform).on('readable', function () {
        var _header = transform.read();

        if (_header) header = _header;
    }).on('finish', function () {
        cb(null, header);
    }).on('error', function (e) {
        console.log(e);
    });
}

function getCSVData(filepath, start, end, cb) {
    readStream = fs.createReadStream(filepath);
    parseStream = readStream.pipe(csv.parse());

    var transform = readNLines(start, end, true);
    var data = [];

    parseStream.pipe(transform).on('readable', function () {
        var tdata = transform.read();

        if (tdata) data.push(tdata);
    }).on('finish', function () {
        cb(null, data);
    });
}

// const filePath = "./data/movies.csv"
// getCSVHeader(filePath, (err, data) =>{ console.log(data) })
// getCSVData(filePath, 1, 20, (err, data) => { console.log(data.length) })
// setTimeout(() => {
//   getCSVData(filePath, 2, 30, (err, data) => { console.log(data.length) })
// })

module.exports = {
    getCSVData: getCSVData,
    getCSVHeader: getCSVHeader
};
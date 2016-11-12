const remote = require('electron').remote
const header = remote.require('./main').getCSVHeader
const body   = remote.require('./main').getCSVData


const headerSel = document.querySelector("#heading")
const bodySel   = document.querySelector("#content")

header('./data/movies.csv', (err, data) => {
  console.log(data, typeof data)
  if(!err && data && data.length) {
    let html = "<tr>"

    data.forEach(d => {
      html += `<th>${d}</th>`
    })

    html += "</tr>";

    headerSel.innerHTML += html
  }
})

body('./data/movies.csv', 0, -1, (err, datas) => {
  if(!err && datas && datas.length) {
    let html = "";

    datas.forEach(data => {
      html += "<tr>"

      data.forEach(d => {
        html += `<td>${d}</td>`
      })
      html += "</tr>"
      
    })

    bodySel.innerHTML += html
  }
})
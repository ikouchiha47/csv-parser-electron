import React from "react"
import { remote } from "electron"

const isFilePresent = remote.require('./main').isFilePresent;
const body          = remote.require('./main').getCSVData;

class Body extends React.Component {
  constructor(props: object) {
    super(props);
    this.state = { records: [], fileLoaded: false, fileName: null }
    this.handleDrop = this.handleDrop.bind(this)
    this.preventDefault = this.preventDefault.bind(this)
  }

  fetchBody(fileName: string, start: number, end: number) {
    body(fileName, start, end, (err, data) => {
      this.setState({ fileLoaded: true, records: data })
    })
  }
  
  preventDefault(e) {
    e.preventDefault()
  }

  handleDrop(e) {
    e.preventDefault();
    let file = e.dataTransfer.files[0] && e.dataTransfer.files[0].path
    if(file) {
      let filePresent = isFilePresent(file)

      if(filePresent) {
        this.fetchBody(file, 1, 20)
      }
    }
  }
  
  renderDataList() {
    return this.state.records.map((record, i) => {
      return (<tr key={`tr_${i}`}>{ record.map((data, j) => <td key={`td_${j}`}>{data}</td>) }</tr>)
    })
  }

  renderDropArea() {
    return (
        <div id="drop_area" onDragOver={this.preventDefault} onDrop={this.handleDrop}>Drop Area</div>
    )
  }

  renderTable() {
    return (
      <table>
        <tbody>{this.renderDataList()}</tbody>
      </table>
    )
  }

  render() {
    return this.state.fileLoaded ? this.renderTable() : this.renderDropArea();
  }
}

export default Body

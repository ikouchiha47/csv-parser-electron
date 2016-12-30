import React from "react"
import { remote } from "electron"

class Body extends React.Component {
  constructor(props: object) {
    super(props);
    this.state = { records: [], fileLoaded: false }
    this.handleDrop = this.handleDrop.bind(this)
    this.preventDefault = this.preventDefault.bind(this)
  }

  fetchBody(start: number, end: number) {
  }
  
  preventDefault(e) {
    e.preventDefault()
  }

  handleDrop(e) {
    e.preventDefault();
    let file = e.dataTransfer.files[0] && e.dataTransfer.files[0].path

    if(file) {
      // load the csv file data
      alert(file)
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

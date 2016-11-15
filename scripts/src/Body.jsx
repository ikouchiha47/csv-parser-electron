import React from "react"
import { remote } from "electron"
const body = remote.require('./main').getCSVData

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = { records: [] }
    window.body = body
  }

  fetchBody(start, end) {
    body("./data/movies.csv", start, end, (err, data) => {
      console.log(start, end, data)
      this.setState({ records: data })
    })
  }

  componentDidMount() {
    this.fetchBody(1, 20);
    setTimeout(() => this.fetchBody(2, 30), 2000)
  }

  renderDataList() {
    return this.state.records.map((record, i) => {
      return (<tr key={`tr_${i}`}>{ record.map((data, j) => <td key={`td_${j}`}>{data}</td>) }</tr>)
    })
  }

  render() {
    return (
      <table>
        <tbody>{this.renderDataList()}</tbody>
      </table>
    )
  }
}

export default Body

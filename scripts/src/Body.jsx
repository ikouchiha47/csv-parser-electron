import React from "react"
import { remote } from "electron"
const body = remote.require('./main').getCSVData

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = { records: [] }
  }

  componentDidMount() {
    body("./data/movies.csv",1, 20, (err, data) => {
      this.setState({ records: data })
    })
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
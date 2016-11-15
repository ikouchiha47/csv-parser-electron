import React from "react";
import { remote } from "electron"
const header = remote.require('./main').getCSVHeader

class Header extends React.Component {
  constructor(props: object) {
    super(props)
    this.state = { data: [] }
  }

  componentDidMount() {
    header('./data/movies.csv', (err, data) => {
      this.setState({data: data})
    })
  }

  renderListHeader() {
    let els = this.state.data.map((d, i) => <li key={i}>{d}</li>)

    return (
      <ul className="csv-header-list">{els}</ul>
    )
  }

  render() {
    return (
      <div className="header">
        <h1>CSViewerr</h1>
        { this.renderListHeader() }
      </div>
    )
  }
}

export default Header
import React from "react";
import { remote } from "electron"

class Header extends React.Component {
  constructor(props: object) {
    super(props)
    this.state = { data: [] }
  }

  componentDidMount() {
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

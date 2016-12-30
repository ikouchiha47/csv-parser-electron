import React from "react";
import { remote } from "electron"

class Header extends React.Component {
  constructor(props: object) {
    super(props)
  }

  render() {
    let els = this.props.data.map((d, i) => <th key={i}>{d}</th>)

    return (
        <thead>
            <tr>{els}</tr>
        </thead>
    )
  }
}

export default Header

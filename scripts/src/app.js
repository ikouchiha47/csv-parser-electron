import React from "react"
import ReactDOM from "react-dom";

import Header from "./Header.jsx"
import Body from "./Body.jsx"

class App extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        <Body/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.querySelector(".container"))
import React from "react"
import ReactDOM from "react-dom";

import Renderer from "./Renderer.jsx"

class App extends React.Component {
  render() {
    return (
      <div>
        <Renderer/>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.querySelector(".container"))

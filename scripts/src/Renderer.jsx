import React from "react"
import Infinite from "react-infinite"
import { remote } from "electron"
import Header from "./Header.jsx"

import { debounce } from "./utils"

const { getCSVHeader, getCSVData, isFilePresent, countLines } = remote.require('./main');
const cellHeight = 30 + (3 + 3) + (1 + 1)

class Body extends React.Component {
  constructor(props: object) {
    super(props);

    this.fileName = undefined;
    this.recordsLegth = 0;
    this.state = { records: [], headerData: [], fileLoaded: false, start: 0, isInfiniteLoading: false }
    this.handleDrop = this.handleDrop.bind(this)
    this.preventDefault = this.preventDefault.bind(this)
    //this.handleInfiniteLoad = debounce(this.handleInfiniteLoad 200).bind(this)
    this.handleInfiniteLoad = this.handleInfiniteLoad.bind(this)
  }

  fetchTotalLength() {
    return new Promise((res, rej) => {
      countLines(this.fileName, (err, data) => err ? rej(err) : res(data))
    })
  }

  fetchBody(start: number, end: number) {
    return new Promise((res, rej) => {
      getCSVData(this.fileName, start, end, (err, data) => {
        if(data && data.length) res(data);
        else if(!data) rej(Error("Invalid data"));
        else rej(err);
      });
    })
  }

  fetchHeader() {
    return new Promise((res, rej) => {
      getCSVHeader(this.fileName, (err, data) => {
        if(data && data.length) res(data);
        else if(!data) rej(Error("Invalid data"));
        else rej(err);
      });
    })
  }

  preventDefault(e) {
    e.preventDefault()
  }

  handleDrop(e) {
    e.preventDefault();
    let fileName = e.dataTransfer.files[0] && e.dataTransfer.files[0].path
    this.fileName = fileName

    if(fileName) {
      let filePresent = isFilePresent(fileName)

      if(filePresent) {
        this.fetchTotalLength()
            .then(length => {
              this.recordsLength= +length
              return this.fetchHeader()
            }).then(data => {
              this.setState({ headerData: data })
              return this.fetchBody(this.state.start, this.state.start + 20)
            }).then(data => {
              this.setState({ fileLoaded: true, records: data })
            }).catch(e => {
              console.log("something went wrong", e)
            })
      }
    }
  }

  handleInfiniteLoad() {
    let offsetTop = document.body.scrollTop
    let elementsScrolled = Math.floor(offsetTop / cellHeight)

    this.setState({ isInfiniteLoading: true });

    if(this.state.records.length <= this.recordsLength) {
      this.fetchBody(this.state.start + elementsScrolled, this.state.start + elementsScrolled + 20).then(data => {
        let records = [...this.state.records.slice(0, elementsScrolled), ...data]
        this.setState({
          isInfiniteLoading: false,
          records: records
        })
      })
    } else {
      this.setState({ isInfiniteLoading: false })
    }
  }

  renderDataList() {
    return this.state.records.map((record, i) => {
      return (<tr key={`tr_${i}`}>{ record.map((data, j) => <td key={`td_${j}`}>{data}</td>) }</tr>)
    })
  }

  renderTable() {
    return (
      <div>
        <table>
          <Header data={this.state.headerData}/>
          <tbody>
            <Infinite
                infiniteLoadBeginEdgeOffset={700}
                containerHeight={800}
                elementHeight={cellHeight}
                onInfiniteLoad={this.handleInfiniteLoad}
                isInfiniteLoading={this.state.isInfiniteLoading}
                useWindowAsScrollContainer>
              {this.renderDataList()}
            </Infinite>
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    return (
      <div id="drop_area" onDragOver={this.preventDefault} onDrop={this.handleDrop}>
        {this.state.fileLoaded ? this.renderTable() : null}
      </div>
    )
  }
}

export default Body

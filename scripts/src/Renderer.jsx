import React from "react"
import { remote } from "electron"
import Header from "./Header.jsx"

const { getCSVHeader, getCSVData, isFilePresent, countLines } = remote.require('./main');
const visibleRows = 20
const cellHeight = 30 + (3 + 3) + (1 + 1)

function debounce(func, wait, immediate) {
	var timeout;

  return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};

	  var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	}
}

class Body extends React.Component {
  constructor(props: object) {
    super(props);

    this.fileName = undefined;
    this.state = { records: [], headerData: [], fileLoaded: false, recordsLength: 0, start: 0, delta: 20 }
    this.handleDrop = this.handleDrop.bind(this)
    this.preventDefault = this.preventDefault.bind(this)
    this.handleScroll = debounce(this.handleScroll, 500).bind(this)
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
              this.setState({ recordsLength: +length });
              return this.fetchHeader()
            }).then(data => {
              this.setState({ headerData: data })
              return this.fetchBody(this.state.start, this.state.start + this.state.delta)
            }).then(data => {
              this.setState({ fileLoaded: true, records: data })
            }).catch(e => {
              console.log("something went wrong", e)
            })
      }
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll(e) {
    // implement debounce
    let offsetTop = e.srcElement.body.scrollTop
    let scrollHeight = document.body.scrollHeight
    let { start, delta } = this.state

    if((offsetTop + cellHeight) >= scrollHeight - window.innerHeight && (start + delta) <= this.state.recordsLength) {
      this.fetchBody(start + delta, start + delta + delta).then(data => {
        this.setState({ records: data, start: start + delta })
      })
    }
  }

  renderHiddenBlock() {
    if(this.state.start > 0) {
      return (<tr style={{height: `${this.state.start * this.state.records.length}px`}}><td colSpan={this.state.records[0].length}></td></tr>)
    }
    return null
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
            {this.renderHiddenBlock()}
            {this.renderDataList()}
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

import React from "react"
import { remote } from "electron"
import Header from "./Header.jsx"

const isFilePresent = remote.require('./main').isFilePresent;
const { getCSVHeader, getCSVData }  = remote.require('./main');

class Body extends React.Component {
    constructor(props: object) {
        super(props);
        this.state = { records: [], headerData: [], fileLoaded: false }
        this.handleDrop = this.handleDrop.bind(this)
        this.preventDefault = this.preventDefault.bind(this)
    }

    fetchBody(fileName: string, start: number, end: number) {
        return new Promise((res, rej) => {
            getCSVData(fileName, start, end, (err, data) => {
                if(data && data.length) res(data);
                else if(!data) rej(Error("Invalid data"));
                else rej(err);
            });
        })
    }

    fetchHeader(fileName: string) {
        return new Promise((res, rej) => {
            getCSVHeader(fileName, (err, data) => {
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

        if(fileName) {
            let filePresent = isFilePresent(fileName)

            if(filePresent) {
                this.fetchHeader(fileName)
                    .then(data => {
                        this.setState({ headerData: data })
                    }).then(() => {
                        return this.fetchBody(fileName, 1, 20)
                    }).then(data => {
                        this.setState({ fileLoaded: true, records: data })
                    })
            }
        }
    }
    
    renderDataList() {
        return this.state.records.map((record, i) => {
            return (<tr key={`tr_${i}`}>{ record.map((data, j) => <td key={`td_${j}`}>{data}</td>) }</tr>)
        })
    }

    renderTable() {
        console.log(this.state.headerData);

        return (
            <div>                
                <table>
                    <Header data={this.state.headerData}/>
                    <tbody>{this.renderDataList()}</tbody>
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

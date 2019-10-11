import React, {Component} from "react";
import brace from "brace";
import AceEditor from "react-ace";
import "brace/mode/python";
import "brace/theme/monokai";

const UploadButton = ({ handleFile }) =>
    (<label
        className="btn btn-primary"
        style={{
            position: "relative",
            overflow: "hidden",
            background: "#AAA",
            borderRadius: 10,
            width: 200,
            height: 80,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 20,
            cursor: 'pointer',
        }}>
        Upload{" "}
        <input
            type="file"
            // accept={"application/json,.json"}
            onChange={e => handleFile(e.target.files[0])}
            hidden
            style={{
                opacity: 0,
                position: "absolute",
                right: 0,
                top: 0
            }}
        />
    </label>);

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {index: 0, code:'', uploaded:false};
    }

    handleFileProcessing = event => {
        const code = event.target.result;
        this.setState({uploaded: true}, () => {
            this.setState({index: 0, code}, () => {
                this.animateAndDownload();
            });
        })
    };

    handleUploadFile = file => {
        // differ file processing to handleFileProcessing
        const fileReader = new FileReader();
        fileReader.onload = this.handleFileProcessing;
        fileReader.readAsText(file);
    };

    animateAndDownload = () => {
        const interval = setInterval(() => {
            const { index } = this.state;
            this.setState({index: index  + 1}, () => {
                if (index === this.state.code.length) {
                    clearInterval(interval)
                    console.log('done')
                }
            });

        }, 50)

    };


    render() {
        const { code, index, uploaded } = this.state
        return (
            <div style={{height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center'}}>
                {!uploaded?
                    <div>
                        <h1>Code Animator</h1>
                        <div style={{ display: 'flex', flexGrow: 1, alignItems: 'center'}}>
                    <UploadButton handleFile={this.handleUploadFile} />
                        </div>
                    </div>:
            <div id={"code-container"}>
            <AceEditor
                placeholder="Placeholder Text"
                mode="python"
                theme="monokai"
                name="hello"
                onLoad={this.onLoad}
                onChange={this.onChange}
                fontSize={24}
                showPrintMargin={true}
                showGutter={true}
                highlightActiveLine={true}
                value={code.substr(0, index)}
                setOptions={{
                    enableBasicAutocompletion: false,
                    enableLiveAutocompletion: false,
                    enableSnippets: false,
                    showLineNumbers: true,
                    tabSize: 2,

                }}
                style={{height: '100vh', width:'100vw'}}
            />
            </div>}
            </div>


        )
    }
}

export default App;
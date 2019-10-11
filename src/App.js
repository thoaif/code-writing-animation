import React, {Component} from "react";
import brace from "brace";
import {split as SplitEditor} from 'react-ace';
import "brace/mode/python";
import "brace/theme/monokai";

const buttonStyles = {
    borderRadius: 10,
    width: 100,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    cursor: 'pointer',
    border: 'none',
    margin: 10
};

const StartButton = ({handleStart}) =>
    <button style={{...buttonStyles}} onClick={handleStart}>
        Start
    </button>

const UploadButton = ({handleFile}) =>
    (<label
        className="btn btn-primary"
        style={{
            overflow: "hidden",
            background: "#AAA",
            borderRadius: 10,
            ...buttonStyles,
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
        this.state = {index: 0, code: ''};
    }

    handleFileProcessing = event => {
        const code = event.target.result;
        this.setState({index: 0, code}, () => {
            this.animateAndDownload();
        });
    };

    handleUploadFile = file => {
        // differ file processing to handleFileProcessing
        const fileReader = new FileReader();
        fileReader.onload = this.handleFileProcessing;
        fileReader.readAsText(file);
    };

    animateAndDownload = () => {
        this.setState({index: 0}, () => {
            const interval = setInterval(() => {
                const {index, code} = this.state;
                this.setState({index: index + 1}, () => {
                    console.log('index', index)
                    if (index === code.length) {
                        clearInterval(interval);
                        console.log('done')
                    }
                });

            }, 50)
        });
    };

    onChange = (change) => {
        this.setState({code: change[0]})
    }


    render() {
        const {code, index, uploaded} = this.state;
        return (
            <div style={{height: '100vh', width: '100vw', display: 'flex', flexDirection:'column', justifyContent: 'center'}}>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', alignItems: 'center'}}>
                    <h1 style={{height: 100}}>Code Animator</h1>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <UploadButton handleFile={this.handleUploadFile}/>
                        <StartButton handleStart={this.animateAndDownload}/>
                    </div>

                </div>
                <div id={"code-container"}>
                    <SplitEditor
                        placeholder="Placeholder Text"
                        mode="python"
                        theme="monokai"
                        name="hello"
                        onLoad={this.onLoad}
                        onChange={this.onChange}
                        fontSize={24}
                        showPrintMargin={true}
                        showGutter={true}
                        splits={2}
                        highlightActiveLine={true}
                        value={[code, code.substr(0, index)]}
                        setOptions={{
                            enableBasicAutocompletion: false,
                            enableLiveAutocompletion: false,
                            enableSnippets: false,
                            showLineNumbers: true,
                            tabSize: 2
                        }}
                        style={{height: '100vh', width: '100vw'}}
                        editorProps={{$blockScrolling: true}}
                    />
                </div>
            </div>


        )
    }
}

export default App;
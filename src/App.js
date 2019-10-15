import React, {Component} from "react";
import brace from "brace";
import {split as SplitEditor} from 'react-ace';
import "brace/mode/python";
import "brace/theme/xcode";
import JSZip from 'jszip';
import domtoimage from 'dom-to-image';
import AceEditor from "react-ace";

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

const ANIMATION_DELAY = 175;
const DELAY = 1000;

const Button = ({handleStart, text}) =>
    <button style={{...buttonStyles}} onClick={handleStart}>
        {text}
    </button>;

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

const downloadFile = async (blob, fileName) => {
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


const addPrefixZeros = (num, reference) => {
    let numString = num.toString();
    for (let i = numString.length; i < reference.toString().length; i++) {
        numString = '0' + numString;
    }
    return numString;
};

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {index: 0, code: '', panes: 2, interval: null};
    }

    handleFileProcessing = event => {
        const code = event.target.result;
        this.setState({index: 0, code}, () => {
            this.animate();
        });
    };

    handleUploadFile = file => {
        // differ file processing to handleFileProcessing
        const fileReader = new FileReader();
        fileReader.onload = this.handleFileProcessing;
        fileReader.readAsText(file);
    };

    recursiveDownload = async (zipFile) => {
        const {index, code} = this.state;
        console.log('index', index);
        if (index === code.length + 1) {
            const zipContent = await zipFile.generateAsync({type: "blob"});
            await downloadFile(zipContent, 'images.zip');
            this.setState({panes: 2, interval: null, index: 0});
            console.log('downloading');
        } else {
            this.setState({index: index + 1}, async () => {
                const dataUrl = await domtoimage.toPng(document.getElementById('code-container'));
                const idx = dataUrl.indexOf('base64,') + 'base64,'.length; // or = 28 if you're sure about the prefix
                const content = dataUrl.substring(idx);
                await zipFile.file(addPrefixZeros(index, code.length) + '.png', content, {base64: true});
                await this.recursiveDownload(zipFile);
            });

        }
    };


    downloadImages = () => {
        const zip = new JSZip();
        this.setState({panes: 1, index: 0, interval: null},
            async () => {
                await this.recursiveDownload(zip);
            });
    };

    animate = () => {
        const {interval} = this.state;
        if (interval) clearInterval(interval);
        this.setState(
            {
                index: 0,
                interval: null,
                panes: 2
            },
            () => {
                setTimeout(() => {
                    const intervalNew = setInterval(() => {
                        const {index, code} = this.state;
                        this.setState({index: index + 1, interval: intervalNew}, () => {
                            console.log('index', index);
                            if (index === code.length) {
                                clearInterval(intervalNew);
                                console.log('done')
                            }
                        });

                    }, ANIMATION_DELAY)
                }, DELAY);
            });
    };

    onChange = (change) => {
        this.setState({code: change[0]})
    };


    render() {
        const {code, index, uploaded, panes} = this.state;
        return (
            <div style={{
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '100%',
                    alignItems: 'center'
                }}>
                    <h1 style={{height: 100}}>Code Animator</h1>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <UploadButton handleFile={this.handleUploadFile}/>
                        <Button handleStart={this.animate} text={'Animate'}/>
                        <Button handleStart={this.downloadImages} text={'Download'}/>
                    </div>

                </div>
                <div id={"code-container"}>
                    {panes === 2 ? <SplitEditor
                            placeholder="Placeholder Text"
                            mode="python"
                            theme="xcode"
                            name="hello"
                            onLoad={this.onLoad}
                            onChange={this.onChange}
                            fontSize={20}
                            showPrintMargin={true}
                            showGutter={true}
                            splits={panes}
                            highlightActiveLine={true}
                            value={[code, code.substr(0, index)]}
                            setOptions={{
                                showLineNumbers: false,
                                tabSize: 2
                            }}
                            style={{height: '100vh', width: '100vw'}}
                            editorProps={{$blockScrolling: true}}
                        /> :
                        <AceEditor
                            placeholder=""
                            mode="python"
                            theme="xcode"
                            name="hello"
                            onLoad={this.onLoad}
                            onChange={this.onChange}
                            fontSize={20}
                            showPrintMargin={true}
                            showGutter={true}
                            highlightActiveLine={true}
                            value={code.substr(0, index)}
                            setOptions={{
                                enableBasicAutocompletion: false,
                                enableLiveAutocompletion: false,
                                enableSnippets: false,
                                showLineNumbers: false,
                                tabSize: 2
                            }}
                            style={{height: '100vh', width: '100vw'}}
                            editorProps={{$blockScrolling: true}}
                        />}

                </div>
            </div>
        )
    }
}

export default App;
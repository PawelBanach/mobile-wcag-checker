import React, { useState } from 'react';
import Dropzone from './Upload/components/Dropzone'
import Progress from './Upload/components/Progress';
import CheckCircleOutlineIcon from 'mdi-react/CheckCircleOutlineIcon'
import Numeric1CircleOutlineIcon from 'mdi-react/Numeric1CircleOutlineIcon'
import Numeric2CircleOutlineIcon from 'mdi-react/Numeric2CircleOutlineIcon'
import Numeric3CircleOutlineIcon from 'mdi-react/Numeric3CircleOutlineIcon'
import InsertDriveFileIcon from 'mdi-react/InsertDriveFileIcon'
import background from 'images/background2.png'

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [successfullUploaded, setSuccessfullUploaded] = useState(false);
  const [files, setFiles] = useState([]);
  const [name, setName] = useState("");

  const sendRequest = (file) => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          setUploadProgress(copy);
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = { ...uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        setUploadProgress(copy);
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        setUploadProgress(copy);
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("name", name);

      req.open("POST", "/upload");
      req.setRequestHeader('X-CSRF-Token', document.querySelector('meta[name="csrf-token"]').getAttribute('content'));
      req.send(formData);
    });
  };

  const uploadFiles = async () => {
    setUploadProgress({});
    setUploading(true);

    const promises = [];

    files.forEach(file => promises.push(sendRequest(file)));

    try {
      await Promise.all(promises);
      setSuccessfullUploaded(true);
      setUploading(false);
      window.location.href = "/mobile_apps";
    } catch (e) {
      console.log(e);
      // Handle error somehow
      setSuccessfullUploaded(true);
      setUploading(false);
    }
  };

  const renderProgress = (file) => {
    const progress = uploadProgress[file.name];
    if (uploading || successfullUploaded) {
      return (
        <div className="ProgressWrapper" alt="done" style={{
          opacity:
            progress && progress.state === "done" ? 0.5 : 0
        }}>
          <Progress progress={progress ? progress.percentage : 0} />
          <CheckCircleOutlineIcon className="CheckIcon"/>
        </div>
      );
    }
  };

  const renderActions = () => {
    if (successfullUploaded) {
      return (
        <button
          onClick={() => {
            setFiles([]);
            setSuccessfullUploaded(false);
          }}
          disabled={files.length === 0 }
        >
          Clear
        </button>
      );
    } else {
      return (
        <button
          disabled={files.length < 0 || uploading}
          onClick={uploadFiles}
        >
          Upload
        </button>
      );
    }
  };

  const onFilesAdded = (newFiles) => { setFiles(files.concat(newFiles)); };

  return (
    <div className="App">
      <div className="Header">
        <h1 className="MainHeader">MAAC</h1>
        <h4 className="SubHeader">Mobile Apps Accessibility Checker</h4>
      </div>
      <div className="Content">
        <div className="Background">
          <div className="Message">
            <span>Mobile Apps Accessibility Checker is a digital accessibility validator for mobile applications.
               It meets the requirements of WCAG 2.1. On order to validate your mobile app follow the instructions on the right side.</span>
          </div>
          <img className="BackgroundImage" src={background}/>
        </div>
        <div className="Card">
          <div className="Upload">
            <span className="Title">
              <Numeric1CircleOutlineIcon className="StepIcon"/>Name your app:
            </span>
            <input className="NameInput" type="text" onChange={(e) => setName(e.target.value)} value={name} required/>
            <span className="Title">
              <Numeric2CircleOutlineIcon className="StepIcon"/>Select directory:
            </span>
            <div className="FormContent">
              { files.length === 0 && (
                <div>
                  <Dropzone
                    onFilesAdded={onFilesAdded}
                    disabled={uploading || successfullUploaded}
                  />
                </div>
              )}
              { files.length > 0 && (
                <div className="Files">
                  { files.map(file => {
                    return (
                      <div key={file.name} className="Row">
                        <span className="Filename"><InsertDriveFileIcon className="StepIcon"/>{file.name}</span>
                        { renderProgress(file) }
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="ButtonContainer">
              <span className="Title">
                <Numeric3CircleOutlineIcon className="StepIcon"/>Send to check:
              </span>
              <div className="Actions">{renderActions()}</div>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="Footer">*/}
        {/*Footer*/}
      {/*</div>*/}
    </div>
  )
};

export default Upload;

import React, { useState } from 'react';
import Dropzone from './Upload/components/Dropzone'
import PropTypes from 'prop-types';
import Progress from './Upload/components/Progress';
import CheckCircleOutlineIcon from 'mdi-react/CheckCircleOutlineIcon'

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [successfullUploaded, setSuccessfullUploaded] = useState(false);
  const [files, setFiles] = useState([]);

  const sendRequest = (file) => {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();

      req.upload.addEventListener("progress", event => {
        if (event.lengthComputable) {
          const copy = { ...this.state.uploadProgress };
          copy[file.name] = {
            state: "pending",
            percentage: (event.loaded / event.total) * 100
          };
          this.setState({ uploadProgress: copy });
        }
      });

      req.upload.addEventListener("load", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "done", percentage: 100 };
        this.setState({ uploadProgress: copy });
        resolve(req.response);
      });

      req.upload.addEventListener("error", event => {
        const copy = { ...this.state.uploadProgress };
        copy[file.name] = { state: "error", percentage: 0 };
        this.setState({ uploadProgress: copy });
        reject(req.response);
      });

      const formData = new FormData();
      formData.append("file", file, file.name);

      req.open("POST", "http://localhost:3000/upload");
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
    } catch (e) {
      console.log(e);
      // Handle error somehow
      setSuccessfullUploaded(true);
      setUploading(false);
    }
  };

  const renderProgress = (file) => {
    const uploadProgress = uploadProgress[file.name];
    if (uploading || successfullUploaded) {
      return (
        <div className="ProgressWrapper" alt="done" style={{
          opacity:
            uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
        }}>
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
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

  const onFilesAdded = (newFiles) => { debugger; setFiles(files.concat(newFiles)); };
  debugger;
  return (
    <div className="App">
      <div className="Card">
        <div className="Upload">
          <span className="Title">Upload Files</span>
          <div className="Content">
            <div>
              <Dropzone
                onFilesAdded={onFilesAdded}
                disabled={uploading || successfullUploaded}
              />
            </div>
            <div className="Files">
              { files.map(file => {
                return (
                  <div key={file.name} className="Row">
                    <span className="Filename">{file.name}</span>
                    {renderProgress(file)}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="Actions">{renderActions()}</div>
        </div>
      </div>
    </div>
  )
};

export default Upload;

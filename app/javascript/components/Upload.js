import React, { useState } from 'react';
import Dropzone from './Upload/components/Dropzone'
import PropTypes from 'prop-types';
import Progress from './Upload/components/Progress';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [successfullUploaded, setSuccessfullUploaded] = useState(false);
  const [files, setFiles] = useState([]);

  const renderProgress = (file) => {
    const uploadProgress = uploadProgress[file.name];
    if (uploading || successfullUploaded) {
      return (
        <div className="ProgressWrapper">
          <Progress progress={uploadProgress ? uploadProgress.percentage : 0} />
          <img
            className="CheckIcon"
            alt="done"
            src="baseline-check_circle_outline-24px.svg"
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0
            }}
          />
        </div>
      );
    }
  };

  const renderActions = () => {
    debugger;
  };

  const onFilesAdded = (newFiles) => setFiles(files.concat(newFiles));

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

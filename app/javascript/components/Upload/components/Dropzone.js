import React, { useState, useRef, useEffect } from 'react'
import CloudUploadIcon from 'mdi-react/CloudUploadIcon';

const Dropzone = ({ disabled, onFilesAdded }) => {
  const fileInputRef = useRef(null);
  const [hightlight, setHightlight] = useState(false);

  const openFileDialog = () => {
    if (disabled) return;
    fileInputRef.current.click();
  };

  const fileListToArray = (list) => {
    const array = [];
    for (let i = 0; i < list.length; i++) array.push(list.item(i));
    return array;
  };

  const onChange = (event) => {
    if (disabled) return;
    const files = event.target.files;
    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }
  };

  const onDragOver = (event) => {
    event.preventDefault();

    if (disabled) return;

    setHightlight(true);
  };

  const onDragLeave = () => setHightlight(false);

  const onDrop = (event) => {
    event.preventDefault();

    if (disabled) return;

    const files = event.dataTransfer.files;
    if (onFilesAdded) {
      const array = fileListToArray(files);
      onFilesAdded(array);
    }
    setHightlight(false);
  };

  return (
    <div
      className={`Dropzone ${hightlight ? "Highlight" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFileDialog}
      style={{ cursor: disabled ? "default" : "pointer" }}
    >
      <CloudUploadIcon
        alt="upload"
        className="Icon"
      />
      <input
        ref={fileInputRef}
        className="FileInput"
        type="file"
        // multiple
        // directory=""
        // webkitdirectory=""
        onChange={onChange}
      />
      <span>Upload Files</span>
    </div>
  )
};

export default Dropzone;
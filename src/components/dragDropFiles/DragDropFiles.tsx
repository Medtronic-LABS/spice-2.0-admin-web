import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as UploadIcon } from '../../assets/images/upload_blue.svg';
import toastCenter from '../../utils/toastCenter';
import styles from './DragDropFiles.module.scss';

const DragDropFiles = () => {
  const [files, setFiles] = useState(null);
  const browseClicked = (e: any) => {
    //
  };

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    if (event.dataTransfer.files[0].type === 'text/csv') {
      setFiles(event.dataTransfer.files[0]);
    } else {
      setFiles(null);
      toastCenter.error('Error', 'Please upload a valid CSV file');
    }
  };

  const uploadHandler = (event: any) => {
    if (event.target.files[0].type === 'text/csv') {
      setFiles(event.target.files[0]);
    } else {
      setFiles(null);
      toastCenter.error('Error', 'Please upload a valid CSV file');
    }
    event.preventDefault();
  };

  return (
    <div className={styles.dragDrop} onDragOver={handleDragOver} onDrop={handleDrop}>
      <section>
        <UploadIcon />
        <label>Upload Region Mapping</label>
        <p>
          Drag and drop the files or{' '}
          <label className='link' htmlFor='file_input_id'>
            Browse
          </label>
          <input type='file' id='file_input_id' name='file' accept='.csv' onChange={uploadHandler} /> file
        </p>
        {files && (
          <div className={'d-flex justify-content-center align-items-center flex-column' + styles.fileDetail}>
            <label>{(files as any).name}</label>
            <button type='button' className='btn primary-btn'>
              Upload
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DragDropFiles;

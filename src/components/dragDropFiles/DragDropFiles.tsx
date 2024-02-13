import { useState } from 'react';
import { ReactComponent as UploadIcon } from '../../assets/images/upload_blue.svg';
import toastCenter from '../../utils/toastCenter';
import styles from './DragDropFiles.module.scss';

const acceptableFileFormat = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

interface IProps {
  onUploadSubmit: (file: any) => void;
}

const DragDropFiles = (props: IProps) => {
  const [file, setFile] = useState(null);

  const handleDragOver = (event: any) => {
    event.preventDefault();
  };

  const handleDrop = (event: any) => {
    event.preventDefault();
    if (acceptableFileFormat.includes(event.dataTransfer.files[0].type)) {
      setFile(event.dataTransfer.files[0]);
    } else {
      setFile(null);
      toastCenter.error('Error', 'Please upload a valid file');
    }
  };

  const uploadHandler = (event: any) => {
    if (acceptableFileFormat.includes(event.target.files[0].type)) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
      toastCenter.error('Error', 'Please upload a valid file');
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
          <input type='file' id='file_input_id' name='file' accept={acceptableFileFormat[0]} onChange={uploadHandler} />
          {' file'}
        </p>
        {file && (
          <div className={`d-flex flex-column justify-content-center align-items-center ${styles.fileDetail}`}>
            <label>{(file as any).name}</label>
            <button
              type='button'
              className='btn primary-btn'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                props.onUploadSubmit(file);
              }}
            >
              Upload
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default DragDropFiles;

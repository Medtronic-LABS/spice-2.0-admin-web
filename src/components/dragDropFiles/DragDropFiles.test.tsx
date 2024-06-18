import React from 'react';
import { shallow } from 'enzyme';
import DragDropFiles from './DragDropFiles';
import { act } from 'react-dom/test-utils';
import styles from './DragDropFiles.module.scss';

describe('DragDropFiles', () => {
  let wrapper: any;
  const mockOnUploadSubmit = jest.fn();

  beforeEach(() => {
    wrapper = shallow(<DragDropFiles onUploadSubmit={mockOnUploadSubmit} />);
  });

  it('should render without crashing', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('should call handleDragOver on drag over', () => {
    const event = { preventDefault: jest.fn() };
    wrapper.find('[data-testid="dragDropMainDiv"]').simulate('dragover', event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should call handleDrop on drop with valid file type', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const event = { preventDefault: jest.fn(), dataTransfer: { files: [file] } };
    act(() => {
      wrapper.find('[data-testid="dragDropMainDiv"]').simulate('drop', event);
    });
    wrapper.update();
    const fileLabel = wrapper.find(`.${styles.fileDetail} label`).text();
    expect(fileLabel).toBe(file.name);
  });

  it('should not set file state on drop with invalid file type', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { preventDefault: jest.fn(), dataTransfer: { files: [file] } };
    act(() => {
      wrapper.find('[data-testid="dragDropMainDiv"]').simulate('drop', event);
    });
    wrapper.update();
    expect(wrapper.find(`.${styles.fileDetail} label`).exists()).toBe(false);
  });

  it('should call uploadHandler on file input change with valid file type', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const event = { preventDefault: jest.fn(), target: { files: [file] } };
    act(() => {
      wrapper.find('input[type="file"]').simulate('change', event);
    });
    wrapper.update();
    const fileLabel = wrapper.find(`.${styles.fileDetail} label`).text();
    expect(fileLabel).toBe(file.name);
  });

  it('should not set file state on file input change with invalid file type', () => {
    const file = new File([''], 'test.txt', { type: 'text/plain' });
    const event = { preventDefault: jest.fn(), target: { files: [file] } };
    act(() => {
      wrapper.find('input[type="file"]').simulate('change', event);
    });
    wrapper.update();
    expect(wrapper.find(`.${styles.fileDetail} label`).exists()).toBe(false);
  });

  it('should call onUploadSubmit prop with file when upload button is clicked', () => {
    const file = new File([''], 'test.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    act(() => {
      const event = { preventDefault: jest.fn(), target: { files: [file] } };
      wrapper.find('input[type="file"]').simulate('change', event);
    });
    wrapper.update();

    act(() => {
      wrapper.find('button').simulate('click', {
        stopPropagation: () => {
          //
        },
        preventDefault: () => {
          //
        }
      });
    });

    expect(mockOnUploadSubmit).toHaveBeenCalledWith(file);
  });
});

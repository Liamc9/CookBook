import React from 'react';

const FileInput = ({ file, preview, onFileChange }) => {
  return (
    <div className="mb-4">
      {preview ? (
        <video
          src={preview}
          controls
          className="w-full h-64 border border-gray-300 rounded-md"
        />
      ) : (
        <label className="block w-full h-64 border-2 border-dashed border-gray-300 rounded-md cursor-pointer flex items-center justify-center text-gray-500">
          <span>Click to upload a file</span>
          <input
            type="file"
            accept="video/*,image/*"
            onChange={(e) => onFileChange(e.target.files[0])}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

export default FileInput;

import React from 'react';
import Input from '../../components/Input';
import FileInput from './fileInput';

const RecipeStep = ({ step, index, onFileChange, onDescriptionChange, addDescriptionField, removeDescriptionField }) => {
  return (
    <div className="p-6 border rounded-lg shadow-lg bg-white max-w-md mx-auto mt-10">
      <div className="mb-4">
        <FileInput
          file={step.file}
          preview={step.preview}
          onFileChange={(file) => onFileChange(file, index)}
        />
      </div>
      {step.descriptions.map((desc, descIndex) => (
        <div key={descIndex} className="mb-4">
          <Input
            name="description"
            id="description"
            type="textarea"
            value={desc}
            onChange={(e) => onDescriptionChange(e.target.value, index, descIndex)}
            colour="custom-brown"
            htmlFor="description"
            label={`Description ${descIndex + 1}`}
          />
          {step.descriptions.length > 1 && (
            <button
              onClick={() => removeDescriptionField(index, descIndex)}
              className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600 mt-2"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      {step.descriptions.length < 5 && (
        <button
          onClick={() => addDescriptionField(index)}
          className="rounded bg-custom-brown px-4 py-2 text-white hover:bg-custom-brown mt-2"
        >
          Add Description
        </button>
      )}
    </div>
  );
};

export default RecipeStep;

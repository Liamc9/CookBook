import React from 'react';
import Input from '../../components/Input';
import FileInput from './fileInput';

const RecipeDetails = ({ recipeName, setRecipeName, caption, setCaption, imageFile, setImageFile, imagePreview }) => {
  return (
    <div className="p-6 bg-white max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Recipe Details</h2>
      <div className="mb-4">
        <Input
          name="recipeName"
          id="recipeName"
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          colour="custom-brown"
          htmlFor="recipeName"
          label="Recipe Name"
        />
      </div>
      <div className="mb-4">
        <Input
          name="caption"
          id="caption"
          type="textarea"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          colour="custom-brown"
          htmlFor="caption"
          label="Caption"
        />
      </div>
      <FileInput
        file={imageFile}
        preview={imagePreview}
        onFileChange={(file) => setImageFile(file)}
      />
    </div>
  );
};

export default RecipeDetails;

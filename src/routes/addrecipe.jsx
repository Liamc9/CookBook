// IMPORTS
import { useState } from "react";
import { storage, db } from "../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

// CREATE FUNCTION
export default function AddRecipe() {
  // STATE VARIABLES
  const [currentStep, setCurrentStep] = useState(1);
  const [files, setFiles] = useState([null, null, null, null]);
  const [descriptions, setDescriptions] = useState(["", "", "", ""]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // HANDLERS
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onFileChange = (file, index) => {
    let newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const onDescriptionChange = (text, index) => {
    let newDescriptions = [...descriptions];
    newDescriptions[index] = text;
    setDescriptions(newDescriptions);
  };

  const handleUploadAll = async () => {
    if (files.some(file => file === null)) {
      setMessage("Please upload all files before submitting.");
      return;
    }
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const description = descriptions[i];
        const url = await uploadFileAndGetURL(file);
        const fileDoc = doc(db, "recipes", file.name);
        await setDoc(fileDoc, { url, name: file.name, description, uploadedAt: new Date() });
      }
      setMessage("All files uploaded successfully and URLs stored in Firestore.");
    } catch (error) {
      console.error("Error uploading files:", error);
      setMessage("Error uploading files. Please try again.");
    }
    setUploading(false);
  };

  const uploadFileAndGetURL = async (file) => {
    const fileRef = ref(storage, `uploads/${file.name}`);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
  };

  // RENDER FUNCTION FOR EACH STEP
  const renderFormStep = () => {
    return (
      <div className="p-4">
        <input
          type="file"
          onChange={(e) => onFileChange(e.target.files[0], currentStep - 1)}
          className="mb-2"
        />
        <textarea
          placeholder="Description"
          value={descriptions[currentStep - 1]}
          onChange={(e) => onDescriptionChange(e.target.value, currentStep - 1)}
          className="mt-2 p-2 w-full h-32 border"
        />
        <div>
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 mr-2"
          >
            Previous
          </button>
          <button
            onClick={nextStep}
            disabled={currentStep === 4}
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // RENDER
  return (
    <>
      <div className="mt-20">
        Please upload a video and provide a description for each step of the recipe.
      </div>
      {renderFormStep()}
      {currentStep === 4 && (
        <button
          onClick={handleUploadAll}
          disabled={uploading}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-300 mt-4"
        >
          {uploading ? "Uploading..." : "Submit All"}
        </button>
      )}
      {message && <p className="mt-2">{message}</p>}
    </>
  );
}

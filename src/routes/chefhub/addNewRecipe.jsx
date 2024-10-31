// MultiStepForm.js
import React, { useState } from "react";
import { db } from "../../firebase-config";
import { collection, addDoc } from "firebase/firestore";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import RecipeSwipeComponent from "../../components/RecipeSwipeComponent";
import { ProgressBar, ConfirmDeleteModal } from "liamc9npm";
import RecipeOverviewPage from "./recipeOverviewpage";
import RecipeStepsPage from "./recipesteppage";
import AdditionalDetailsPage from "./additionaldetailspage";
import { ChevronLeftIcon } from '../../assets/Icons';

const totalPages = 3;
const pageTitles = ["Recipe Overview", "Recipe Steps", "Additional Details"];
const initialFormData = {
  title: "",
  cuisine: "",
  servings: "",
  time: "",
  ingredients: [""],
  imageUrl: "",
  overviewVideoUrl: "",
  steps: [{ description: "", videoUrl: "" }],
};

const MultiStepForm = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState(initialFormData);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStepChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSteps = [...formData.steps];
    updatedSteps[index][name] = value;
    setFormData({ ...formData, steps: updatedSteps });
  };

  const handleIngredientChange = (index, e) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = e.target.value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addIngredientField = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const confirmRemoveField = (type, index) => {
    setDeleteItem({ type, index });
    setShowConfirmModal(true);
  };

  const handleRemoveField = () => {
    if (deleteItem) {
      const { type, index } = deleteItem;
      const updatedData = [...formData[type]];
      updatedData.splice(index, 1);
      setFormData({ ...formData, [type]: updatedData });
      setDeleteItem(null);
      setShowConfirmModal(false);
    }
  };

  const addStepField = () => {
    formData.steps.length < 5 &&
      setFormData({ ...formData, steps: [...formData.steps, { description: "", videoUrl: "" }] });
  };

  const handleCancelRemove = () => {
    setDeleteItem(null);
    setShowConfirmModal(false);
  };

  const handleSubmit = async () => {
    const userId = "replace_with_logged_in_user_id"; // Replace with actual user ID logic
    const formattedData = { ...formData, chef: userId };
    try {
      await addDoc(collection(db, "recipes"), formattedData);
      alert("Data saved successfully!");
      setFormData(initialFormData);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error saving data: ", error);
      alert("Failed to save data");
    }
  };

  const handleViewRecipe = () => setShowRecipeModal(true);

  return (
    <>
    <Header>
                <BackButton onClick={() => navigate(-1)}><ChevronLeftIcon className='w-6 h-6'/></BackButton>
                <FullPageTitle>Add Cookbook</FullPageTitle>
            </Header>
    <FormContainer>
      <PageTitleContainer>
        <PageTitle>{pageTitles[currentPage - 1]}</PageTitle>
        <ProgressBar currentPage={currentPage} totalPages={totalPages} />
      </PageTitleContainer>

      {currentPage === 1 && (
        <RecipeOverviewPage
          formData={formData}
          handleChange={handleChange}
          handleIngredientChange={handleIngredientChange}
          addIngredientField={addIngredientField}
          confirmRemoveIngredientField={(index) => confirmRemoveField("ingredients", index)}
        />
      )}

      {currentPage === 2 && (
        <RecipeStepsPage
          formData={formData}
          handleStepChange={handleStepChange}
          addStepField={addStepField}
          confirmRemoveStepField={(index) => confirmRemoveField("steps", index)}
        />
      )}

      {currentPage === 3 && (
        <AdditionalDetailsPage
          formData={formData}
          handleChange={handleChange}
          handleViewRecipe={handleViewRecipe}
        />
      )}

      {showRecipeModal && (
        <FullPageModal>
          <RecipeSwipeComponent recipe={formData} />
          <CloseButton onClick={() => setShowRecipeModal(false)}>Close</CloseButton>
        </FullPageModal>
      )}

      <StickyButtonContainer hasPrev={currentPage > 1}>
        {currentPage > 1 && <PrevButton onClick={handlePrev}>Previous</PrevButton>}
        {currentPage < totalPages ? (
          <NextButton onClick={handleNext}>Next</NextButton>
        ) : (
          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        )}
      </StickyButtonContainer>

      {showConfirmModal && (
        <ConfirmDeleteModal onCancel={handleCancelRemove} onConfirm={handleRemoveField} />
      )}
    </FormContainer>
    </>
  );
};

export default MultiStepForm;

// Styled Components
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px 0;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    &:hover {
        text-decoration: underline;
    }
`;

const FullPageTitle = styled.h2`
    font-size: 30px;
    font-weight: 500;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 400px;
  margin-bottom: 100px;
`;

const PageTitleContainer = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 10px;
`;

const PageTitle = styled.h2`
  margin-bottom: 10px;
  color: #333;
`;

const StickyButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: ${({ hasPrev }) => (hasPrev ? "space-between" : "flex-end")};
  padding: 10px 20px;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 500;
`;

const PrevButton = styled.button`
  padding: 10px 20px;
  background-color: #e0e0e0;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const NextButton = styled.button`
  padding: 10px 20px;
  background-color: #b08b5b;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #000000;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

const FullPageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 600;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
    z-index: 700;

`;

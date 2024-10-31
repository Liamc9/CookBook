// RecipeOverviewPage.js
import React from "react";
import { Input, CustomFileUpload } from "liamc9npm";
import styled from "styled-components";

const RecipeOverviewPage = ({
  formData,
  handleChange,
  handleIngredientChange,
  addIngredientField,
  confirmRemoveIngredientField,
}) => (
  <PageContainer>
    <Input
      type="text"
      name="title"
      label="Title"
      color="#B08B5B"
      value={formData.title}
      onChange={handleChange}
    />
    <Input
      type="text"
      name="cuisine"
      label="Cuisine"
      color="#B08B5B"
      value={formData.cuisine}
      onChange={handleChange}
    />
    <Input
      type="text"
      name="time"
      label="Time"
      color="#B08B5B"
      value={formData.time}
      onChange={handleChange}
    />
    <Input
      type="text"
      name="servings"
      label="Servings"
      color="#B08B5B"
      value={formData.servings}
      onChange={handleChange}
    />
    <CustomFileUpload
      label="Upload Overview Video"
      onUpload={(file) => handleChange({ target: { name: "overviewVideoUrl", value: file } })}
    />
    <CustomFileUpload
      label="Upload Image"
      onUpload={(file) => handleChange({ target: { name: "imageUrl", value: file } })}
    />
    <Card>
      <CardHeader>
        <StepTitle>Ingredients</StepTitle>
      </CardHeader>
      <IngredientsContainer>
        {formData.ingredients.map((ingredient, index) => (
          <IngredientWrapper key={index}>
            <Input
              type="text"
              name={`ingredient${index}`}
              placeholder={`Ingredient ${index + 1}`}
              value={ingredient}
              color="#B08B5B"
              onChange={(e) => handleIngredientChange(index, e)}
              small
            />
            <SmallRemoveButton onClick={() => confirmRemoveIngredientField(index)}>✕</SmallRemoveButton>
          </IngredientWrapper>
        ))}
        <AddIngredientButton onClick={addIngredientField}>+ Add</AddIngredientButton>
      </IngredientsContainer>
    </Card>
  </PageContainer>
);

export default RecipeOverviewPage;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;

const Card = styled.div`
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 20px;
  position: relative;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StepTitle = styled.h3`
  margin-bottom: 10px;
  color: #555;
`;

const IngredientsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const IngredientWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-bottom: 10px;
`;

const SmallRemoveButton = styled.button`
  padding: 2px 6px;
  font-size: 14px;
  margin-left: 5px;
  color: #dc3545;
`;

const AddIngredientButton = styled.button`
  padding: 5px 10px;
  background-color: #b08b5b;
  color: #fff;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
`;

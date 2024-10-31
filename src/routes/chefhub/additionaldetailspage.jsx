// AdditionalDetailsPage.js
import React from "react";
import { Input, RecipeCard } from "liamc9npm";
import styled from "styled-components";

const AdditionalDetailsPage = ({ formData, handleChange, handleViewRecipe }) => (
  <PageContainer>
   <RecipeCard  onCardClick={handleViewRecipe} recipe={formData} />
    <Input
      type="text"
      name="cookbook"
      label="Cookbook to add to"
      color="#B08B5B"
      value={formData.cookbook}
      onChange={handleChange}
    />
  </PageContainer>
);

export default AdditionalDetailsPage;

// Styled Components
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`;
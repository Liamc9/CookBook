// RecipeStepsPage.js
import React from "react";
import { Input, CustomFileUpload } from "liamc9npm";
import styled from "styled-components";

const RecipeStepsPage = ({
  formData,
  handleStepChange,
  addStepField,
  confirmRemoveStepField,
}) => (
  <PageContainer>
    {formData.steps.map((step, index) => (
      <Card key={index}>
        <CardHeader>
          <StepTitle>Step {index + 1}</StepTitle>
          <RemoveButton onClick={() => confirmRemoveStepField(index)}>Remove</RemoveButton>
        </CardHeader>
        <Input
          type="textarea"
          name="description"
          label={`Step ${index + 1} Description`}
          color="#B08B5B"
          value={step.description}
          onChange={(e) => handleStepChange(index, e)}
        />
        <CustomFileUpload
          label="Upload Step Video"
          onUpload={(file) =>
            handleStepChange(index, { target: { name: "videoUrl", value: file } })
          }
        />
      </Card>
    ))}
    {formData.steps.length < 5 && <AddButton onClick={addStepField}>+ Add Step</AddButton>}
  </PageContainer>
);

export default RecipeStepsPage;

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

const RemoveButton = styled.button`
  padding: 5px 10px;
  background-color: transparent;
  color: #dc3545;
  border: none;
  cursor: pointer;
  font-size: 16px;
`;

const AddButton = styled.button`
  padding: 10px 20px;
  background-color: #b08b5b;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
`;

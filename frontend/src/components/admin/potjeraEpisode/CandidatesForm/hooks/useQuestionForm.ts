import { useState } from "react";
import type { QuestionDto } from "../../../../../types/types";
import axiosInstance from "../../../../../api/axiosInstance";


export const useQuestionForm = (episodeId: number) => {
  const [formData, setFormData] = useState<QuestionDto>({
    questionId: 0,
    text: "",
    correctAnswer: "",
    explanation: "",
    categoryId: 0,
    difficulty: 1,
    showId: 0,
    realQuestionId: 0,
    episodeId: episodeId,
    realCandidateId: 0,
    roundType: "OneMinute",
    orderNumber: 0,
    options: ["", "", ""],
  });

  const [alreadySent, setAlreadySent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData({
      ...formData,
      options: updatedOptions,
    });
  };

  const setRealCandidateId = (candidateId: number) => {
    setFormData((prev) => ({
      ...prev,
      RealCandidateId: candidateId,
    }));
  };

  const handleSubmit = async () => {
      try {
        const response = await axiosInstance.post(
          "api/v1/Episode/addQuestion",
          formData
        );
        console.log(response);
        const newQuestion = response.data;

        return newQuestion;
      } catch (error) {
        console.error(error);
        throw error;
      }
  };
  const handleEdit = async () => {
      try {
        const response = await axiosInstance.put(
          "api/v1/Episode/editQuestion",
          formData
        );
        console.log(response);
        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
  }

  const handleDelete = async () => {
    try {
      await axiosInstance.delete("api/v1/Episode/deleteQuestion", {
        data: formData,
      });

      // Reset state
      resetForm();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const resetForm = (keepCandidateId = false, orderNumber = 0) => {
    setFormData({
      questionId: 0,
      text: "",
      correctAnswer: "",
      explanation: "",
      categoryId: 0,
      difficulty: 1,
      showId: 0,
      realQuestionId: 0,
      episodeId: episodeId,
      realCandidateId: keepCandidateId ? formData.realCandidateId : 0,
      roundType: "OneMinute",
      orderNumber: orderNumber,
      options: ["", "", ""],
    });

    setAlreadySent(false);
    setDisabled(false);
    setAllowEdit(false);
  };

  const toggleEdit = () => {
    setAllowEdit(!allowEdit);
  };

  return {
    formData,
    setFormData,
    alreadySent,
    disabled,
    allowEdit,
    handleOptionChange,
    setRealCandidateId,
    handleSubmit,
    handleDelete,
    resetForm,
    toggleEdit,
    handleEdit
  };
};
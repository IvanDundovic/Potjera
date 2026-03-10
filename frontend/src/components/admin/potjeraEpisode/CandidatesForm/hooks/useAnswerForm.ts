import { useState } from "react";
import type { RealAnswerDto } from "../../../../../types/types";
import axiosInstance from "../../../../../api/axiosInstance";


export const useAnswerForm = (episodeId: number) => {
  const [formData, setFormData] = useState<RealAnswerDto>({
    id: 0,
    episodeId: episodeId,
    realQuestionId: 0,
    candidateAnswer: "",
    hunterAnswer: "",
    candidateCorrect: false,
    hunterCorrect: false,
  });

  const [allowEdit, setAllowEdit] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);

  const setRealQuestionId = (questionId: number) => {
    setFormData((prev) => ({
      ...prev,
      realQuestionId: questionId,
    }));
  };

  // --- MODIFICIRANI handleSubmit ---
  const handleSubmit = async (overrideData?: Partial<RealAnswerDto>) => {
    try {
      // Spoji override podatke s trenutnim formData
      const dataToSubmit = { ...formData, ...overrideData };

      const response = await axiosInstance.post(
        "api/v1/Episode/addAnswer",
        dataToSubmit
      );
      console.log(response);

      setFormData(response.data);
      setAllowEdit(true);
      setAlreadySent(true);

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  const handleEdit = async () => {
    try {
      const response = await axiosInstance.put(
        "api/v1/Episode/editAnswer",
        formData
      )
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  const handleDelete = async () => {
    try {
      await axiosInstance.delete("api/v1/Episode/deleteAnswer", {
        data: formData,
      });
      console.log("Answer deleted");

      // Reset state
      resetForm(true); // Zadrži questionId
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const resetForm = (keepQuestionId = false) => {
    setFormData((prev) => ({
      id: 0,
      episodeId: episodeId,
      realQuestionId: keepQuestionId ? prev.realQuestionId : 0,
      candidateAnswer: "",
      hunterAnswer: "",
      candidateCorrect: false,
      hunterCorrect: false,
    }));

    setAlreadySent(false);
    setAllowEdit(false);
  };

  const toggleEdit = () => {
    setAllowEdit(!allowEdit);
  };

  return {
    formData,
    setFormData,
    alreadySent,
    allowEdit,
    setRealQuestionId,
    handleSubmit,
    handleDelete,
    resetForm,
    toggleEdit,
    handleEdit
  };
};
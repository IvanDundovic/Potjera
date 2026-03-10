import { useState } from "react";
import type { RealCandidateDto } from "../../../../../types/types";
import axiosInstance from "../../../../../api/axiosInstance";

export const useCandidateForm = (episodeId: number) => {
  const [formData, setFormData] = useState<RealCandidateDto>({
    id: 0,
    name: "",
    episodeId: episodeId,
    orderNumber: 0,
    finalMoney: 0,
    caught: true,
    hunterId: 0,
  });

  const [alreadySent, setAlreadySent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  const handleSubmit = async (edit : boolean) => {
    if (!edit) {
      try {
        const response = await axiosInstance.post(
          "api/v1/Episode/addCandidate",
          formData
        );
        console.log(response);

        setFormData(response.data);
        setDisabled(true);
        setAlreadySent(true);
        setAllowEdit(true);

        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    } else {
      try {
        const response = await axiosInstance.put(
          "api/v1/Episode/editCandidate",
          formData
        );
        console.log(response);

        setFormData(response.data);
        setAlreadySent(true);
        setAllowEdit(true);

        return response.data;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete("api/v1/Episode/deleteCandidate", {
        data: formData,
      });
      console.log("Candidate deleted");

      resetForm();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteById = async (candidate: RealCandidateDto) => {
    try {
      await axiosInstance.delete("api/v1/Episode/deleteCandidate", {
        data: candidate,
      });
      console.log("Candidate deleted");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Učitaj kandidata iz liste u formu za uređivanje
  const loadForEdit = () => {
    setDisabled(true);
    setAlreadySent(true);
    setAllowEdit(false); // false = forma je otključana za uređivanje
  };

const resetForm = (usedNumbers: number[] = []) => {
      const getFirstAvailable = (): number => {
        for (let i = 0; i < 5; i++) {
          if (!usedNumbers.includes(i)) return i;
        }
        return 0;
      };

      setFormData({
        id: 0,
        name: "",
        episodeId: episodeId,
        orderNumber: getFirstAvailable(),
        finalMoney: 0,
        caught: true,
        hunterId: 0,
      });

      setDisabled(false);
      setAllowEdit(false);
      setAlreadySent(false);
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
    handleSubmit,
    handleDelete,
    handleDeleteById,
    loadForEdit,
    resetForm,
    toggleEdit,
  };
};
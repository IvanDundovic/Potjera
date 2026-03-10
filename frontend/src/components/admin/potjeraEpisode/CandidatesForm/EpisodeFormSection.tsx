import { useState } from "react";

import "./styles/CandidatesForm.css"
import type { EpisodeFormData } from "../../../../types/types";
import axiosInstance from "../../../../api/axiosInstance";

interface EpisodeFormProps {
  onEpisodeCreated: (id: number) => void;
  isCreated: boolean;
  onReset: () => void;
}

const EpisodeForm = ({ onEpisodeCreated, isCreated, onReset }: EpisodeFormProps) => {
  const [formData, setFormData] = useState<EpisodeFormData>({
    id: 0,
    showId: 1,
    title: "",
    episodeNumber: 1,
    season: 1,
    broadcastDate: "",
    winner: "Lovac",
  });
  const [alreadySent, setAlreadySent] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);

  async function handleDelete() {
    try {
      await axiosInstance.delete("api/v1/Episode/deleteEpisode", {
        data: formData,
      });
      console.log("Episode deleted");

      setDisabled(false);
      setAllowEdit(false);
      setAlreadySent(false);
      setFormData({
        id: 0,
        showId: 1,
        title: "",
        episodeNumber: 1,
        season: 1,
        broadcastDate: "",
        winner: "Lovac",
      });

      onReset();
    } catch (error) {
      console.error(error);
      alert("Greška pri brisanju epizode");
    }
  }

  async function handleSubmit() {
    if (!alreadySent) {
      try {
        const response = await axiosInstance.post(
          "api/v1/Episode/addEpisode",
          {...formData, broadcastDate: new Date(formData.broadcastDate).toISOString()}
        );
        console.log(response);

        setFormData(response.data);
        setDisabled(true);
        setAlreadySent(true);
        setAllowEdit(true);

        onEpisodeCreated(response.data.id);
      } catch (error) {
        console.error(error);
        alert("Greška pri dodavanju epizode");
      }
    } else {
      try {
        const response = await axiosInstance.put(
          "api/v1/Episode/editEpisode",
          {...formData, broadcastDate: new Date(formData.broadcastDate).toISOString()}
        );
        console.log(response);

        setFormData(response.data);
        setAlreadySent(true);
        setAllowEdit(true);
      } catch (error) {
        console.error(error);
        alert("Greška pri uređivanju epizode");
      }
    }
  }

  return (
    <form
      className="game-accordion episode-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <h2>Dodaj novu epizodu</h2>

      <div className="form-row-three">
        <div className="form-floating form-col-wide">
          <input
            required
            type="text"
            className="form-control"
            id="title"
            placeholder="Naslov"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={allowEdit}
          />
          <label htmlFor="title">Naslov</label>
        </div>

        <div className="form-floating form-col-narrow">
          <input
            required
            min={1}
            step={1}
            type="number"
            className="form-control"
            id="episodeNumber"
            placeholder="Epizoda"
            value={formData.episodeNumber}
            disabled={disabled}
            onChange={(e) =>
              setFormData({
                ...formData,
                episodeNumber: e.target.value === "" ? 1 : Number(e.target.value),
              })
            }
          />
          <label htmlFor="episodeNumber">Epizoda</label>
        </div>

        <div className="form-floating form-col-narrow">
          <input
            required
            min={1}
            step={1}
            type="number"
            className="form-control"
            id="season"
            placeholder="Sezona"
            value={formData.season}
            onChange={(e) =>
              setFormData({
                ...formData,
                season: e.target.value === "" ? 1 : Number(e.target.value),
              })
            }
            disabled={disabled}
          />
          <label htmlFor="season">Sezona</label>
        </div>
      </div>

      <div className="form-row-two">
        <div className="form-floating form-col-half">
          <select
            required
            className="form-select"
            id="winner"
            value={formData.winner}
            onChange={(e) =>
              setFormData({ ...formData, winner: e.target.value })
            }
            disabled={allowEdit}
          >
            <option value="Lovac">Lovac</option>
            <option value="Ekipa">Ekipa</option>
          </select>
          
          <label htmlFor="winner">Pobjednik</label>
        </div>

        <div className="form-floating form-col-half">
          <input
            required
            type="date"
            className="form-control"
            id="broadcastDate"
            value={formData.broadcastDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                broadcastDate: e.target.value,
              })
            }
            disabled={allowEdit}
          />
          <label htmlFor="broadcastDate">Datum emitiranja</label>
        </div>
      </div>

      <div className="button-group">
        {!allowEdit && (
          <button type="submit" className="btn-primary">
            {isCreated ? "Spremljeno ✓" : "Dalje → Kandidati"}
          </button>
        )}
        {allowEdit && (
          <button
            type="button"
            onClick={() => setAllowEdit(!allowEdit)}
            className="btn-warning"
          >
            Uredi epizodu
          </button>
        )}
        {disabled && (
          <button type="button" onClick={handleDelete} className="btn-danger">
            Izbriši epizodu
          </button>
        )}
      </div>
    </form>
  );
};

export default EpisodeForm;
import { useState } from "react";
import "./adminPage.css";
import EpisodeForm from "../../components/admin/potjeraEpisode/CandidatesForm/EpisodeFormSection";
import Controller from "../../components/admin/potjeraEpisode/CandidatesForm";

const AddEpisodePage = () => {
  const [episodeId, setEpisodeId] = useState<number | null>(null);
  const [episodeCreated, setEpisodeCreated] = useState(false);

  const handleEpisodeCreated = (id: number) => {
    setEpisodeId(id);
    setEpisodeCreated(true);
  };

  const handleResetEpisode = () => {
    setEpisodeId(null);
    setEpisodeCreated(false);
  };

  return (
    <div className="add-episode-page">
      <div className="page-header">
        <h1>Unos nove epizode</h1>
      </div>

      <div className="progress-steps">
        <div className={`step ${!episodeCreated ? "active" : "completed"}`}>
          <div className="step-number">{!episodeCreated && 1}</div>
          <div className="step-label">Dodaj epizodu</div>
        </div>
        <div className="step-divider"></div>
        <div className={`step ${episodeCreated ? "active" : ""}`}>
          <div className="step-number">2</div>
          <div className="step-label">Dodaj kandidate i pitanja</div>
        </div>
      </div>

      <EpisodeForm
        onEpisodeCreated={handleEpisodeCreated}
        isCreated={episodeCreated}
        onReset={handleResetEpisode}
      />

      {episodeCreated && episodeId && (
        <div className="candidates-container">
          <Controller episodeId={episodeId} onEpisodeFinished={handleResetEpisode} />
        </div>
      )}
    </div>
  );
};

export default AddEpisodePage;
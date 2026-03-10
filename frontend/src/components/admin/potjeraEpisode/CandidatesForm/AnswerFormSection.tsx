import type { RealAnswerDto } from "../../../../types/types";


interface AnswerFormSectionProps {
  formData: RealAnswerDto;
  setFormData: (data: RealAnswerDto) => void;
  alreadySent: boolean;
}

export const AnswerFormSection = ({
  formData,
  setFormData,
  alreadySent,
}: AnswerFormSectionProps) => {
  return (
    <div>
      <h3>Odgovor</h3>
      <div className="form-floating mb-3">
        <input
          required
          type="text"
          className="form-control"
          id="candidateAnswer"
          placeholder="Odgovor kandidata"
          value={formData.candidateAnswer}
          disabled={alreadySent}
          onChange={(e) =>
            setFormData({
              ...formData,
              candidateAnswer: e.target.value,
            })
          }
        />
        <label htmlFor="candidateAnswer">Odgovor kandidata</label>
      </div>

      <div className="form-floating mb-3">
        <input
          required
          type="text"
          className="form-control"
          id="hunterAnswer"
          placeholder="Odgovor lovca"
          value={formData.hunterAnswer}
          disabled={alreadySent}
          onChange={(e) =>
            setFormData({
              ...formData,
              hunterAnswer: e.target.value,
            })
          }
        />
        <label htmlFor="hunterAnswer">Odgovor lovca</label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="candidateCorrect"
          checked={formData.candidateCorrect}
          disabled={alreadySent}
          onChange={(e) =>
            setFormData({
              ...formData,
              candidateCorrect: e.target.checked,
            })
          }
        />
        <label className="form-check-label" htmlFor="candidateCorrect">
          Kandidat točan
        </label>
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="hunterCorrect"
          checked={formData.hunterCorrect}
          disabled={alreadySent}
          onChange={(e) =>
            setFormData({
              ...formData,
              hunterCorrect: e.target.checked,
            })
          }
        />
        <label className="form-check-label" htmlFor="hunterCorrect">
          Lovac točan
        </label>
      </div>
    </div>
  );
};
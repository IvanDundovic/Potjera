import type { QuestionDto, RealAnswerDto } from "../../../../types/types";
import { AnswerFormSection } from "./AnswerFormSection";


interface CategoryDto {
  id: number;
  name: string;
  description: string;
}

interface QuestionFormSectionProps {
  formData: QuestionDto;
  setFormData: (data: QuestionDto) => void;
  formAnswerData: RealAnswerDto;
  setFormAnswerData: (data: RealAnswerDto) => void;
  categories: CategoryDto[] | undefined;
  disabled: boolean;
  allowEdit: boolean;
  onSubmit: () => void;
  onOptionChange: (index: number, value: string) => void;
  orderNumber : number;
}

export const QuestionFormSection = ({
    formData,
    setFormData,
    categories,
    disabled,
    allowEdit,
    onSubmit,
    onOptionChange,
    orderNumber,
    formAnswerData,
    setFormAnswerData
  }: QuestionFormSectionProps) => {
   // setFormAnswerData({...formAnswerData, realQuestionId : formData.realQuestionId})
    const roundOptions = () => {
    if (orderNumber === 4) {
      return (
        <option value="TwoMinute">Dvije minute</option>
      );
    }

    if (orderNumber === 0) {
      return (
        <>
          <option value="OneMinute">Jedna minuta</option>
          <option value="Board">Ploča</option>
          <option value="TwoMinute">Dvije minute</option>
        </>
      );
    }

    return (
      <>
        <option value="OneMinute">Jedna minuta</option>
        <option value="Board">Ploča</option>
      </>
    );
  };
  return (
    <div>
      <div className="form-floating mb-3">
        <input
          required
          type="text"
          className="form-control"
          id="pitanje"
          placeholder="pitanje"
          value={formData.text}
          disabled={allowEdit}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
        />
        <label htmlFor="pitanje">Pitanje</label>
      </div>

      <div className="form-floating mb-3">
        <input
          required
          type="text"
          className="form-control"
          id="odgovor"
          placeholder="Točan odgovor"
          value={formData.correctAnswer}
          disabled={allowEdit}
          onChange={(e) =>
            setFormData({
              ...formData,
              correctAnswer: e.target.value,
            })
          }
        />
        <label htmlFor="odgovor">Točan odgovor</label>
      </div>

      <div className="form-floating mb-3">
        <textarea
          className="form-control"
          placeholder="Obrazloženje"
          id="floatingTextarea2"
          disabled={allowEdit}
          value={formData.explanation}
          onChange={(e) =>
            setFormData({
              ...formData,
              explanation: e.target.value,
            })
          }
        ></textarea>
        <label htmlFor="floatingTextarea2">Obrazloženje</label>
      </div>

      <div className="form-floating mb-3">
        <select
          required
          disabled={allowEdit}
          className="form-select"
          id="kat"
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({
              ...formData,
              categoryId: Number(e.target.value),
            })
          }
        >
          {categories?.map((categorie) => (
            <option key={categorie.id} value={categorie.id}>
              {categorie.name}
            </option>
          ))}
        </select>
        <label htmlFor="kat">Kategorija</label>
      </div>

      <div className="form-floating mb-3">
        <select
          required
          disabled={allowEdit}
          className="form-select"
          id="tezina"
          value={formData.difficulty}
          onChange={(e) =>
            setFormData({
              ...formData,
              difficulty: Number(e.target.value),
            })
          }
        >
          <option value="1">Lagano</option>
          <option value="2">Srednje</option>
          <option value="3">Teško</option>
        </select>
        <label htmlFor="tezina">Težina pitanja</label>
      </div>

      <div className="form-floating mb-3">
        <select
          required
          disabled={disabled}
          className="form-select"
          id="runda"
          value={formData.roundType}
          onChange={(e) =>
            setFormData({
              ...formData,
              roundType: e.target.value,
            })
          }
        >
          {roundOptions()}
        </select>
        <label htmlFor="runda">Runda</label>
      </div>

      {formData.roundType === "Board" && (
        <>
          <div className="form-floating mb-3">
            <input
              required
              type="text"
              className="form-control"
              id="odgovorA"
              placeholder="Odgovor A"
              disabled={allowEdit}
              value={formData.options[0]}
              onChange={(e) => onOptionChange(0, e.target.value)}
            />
            <label htmlFor="odgovorA">Odgovor A</label>
          </div>
          <div className="form-floating mb-3">
            <input
              required
              type="text"
              className="form-control"
              id="odgovorB"
              placeholder="Odgovor B"
              disabled={allowEdit}
              value={formData.options[1]}
              onChange={(e) => onOptionChange(1, e.target.value)}
            />
            <label htmlFor="odgovorB">Odgovor B</label>
          </div>
          <div className="form-floating mb-3">
            <input
              required
              type="text"
              className="form-control"
              id="odgovorC"
              placeholder="Odgovor C"
              disabled={allowEdit}
              value={formData.options[2]}
              onChange={(e) => onOptionChange(2, e.target.value)}
            />
            <label htmlFor="odgovorC">Odgovor C</label>
          </div>
        </>
      )}
      {formData.text != "" && (
        <AnswerFormSection
          alreadySent = {allowEdit}
          formData={formAnswerData}
          setFormData={setFormAnswerData}
        />
      )}
      <button type="button" onClick={onSubmit} className="btn-primary">
        {disabled ? "Spremi" : "Dodaj pitanje"}
      </button>
    </div>
  );
};
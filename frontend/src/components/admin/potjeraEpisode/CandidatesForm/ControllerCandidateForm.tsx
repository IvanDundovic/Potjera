import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AnswerFormSection } from "./AnswerFormSection";
import { CandidateFormSection } from "./CandidateFormSection";
import { QuestionFormSection } from "./QuestionFormSection";
import { useCandidateForm } from "./hooks/useCandidateForm";
import { useQuestionForm } from "./hooks/useQuestionForm";
import { useAnswerForm } from "./hooks/useAnswerForm";
import "./CandidatesForm.css";
import type {
  QuestionDto,
  RealAnswerDto,
  RealCandidateDto,
} from "../../../../types/types";
import axiosInstance from "../../../../api/axiosInstance";

interface Props {
  episodeId: number;
}

interface CategoryDto {
  id: number;
  name: string;
  description: string;
}

interface HuntersDto {
  id: number;
  name: string;
  description: string;
}
interface Candidate {
  realCandidate : RealCandidateDto,
  questions : QuestionDto
}
const CandidatesForm = ({ episodeId }: Props) => {
  const [hunters, setHunters] = useState<HuntersDto[]>();
  const [categories, setCategories] = useState<CategoryDto[]>();
  const [candidateAdded, setCandidateAdded] = useState(false);
  const [addedQuestions, setAddedQuestions] = useState<QuestionDto[]>([]);
  const [addedAnswers, setAddedAnswers] = useState<RealAnswerDto[]>([]);
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const Order= ["Kapetan", "2. kandidat", "3. kandidat", "4. kandidat"]
  // Nova state varijabla za praćenje svih kandidata u epizodi
  const [allCandidates, setAllCandidates] = useState<RealCandidateDto[]>([]);
  const [selectedHunterId, setSelectedHunterId] = useState<number | null>(null);

  const candidateForm = useCandidateForm(episodeId);
  const questionForm = useQuestionForm(episodeId);
  const answerForm = useAnswerForm(episodeId);

  async function fetchHunters() {
    try {
      const response = await axiosInstance.get("api/v1/Episode/getHunters");
      setHunters(response.data.hunters);
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchCategories() {
    try {
      const response = await axiosInstance.get("api/v1/Episode/getCategories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error(error);
    }
  }

  // Fetch postojećih kandidata za ovu epizodu
  async function fetchExistingCandidates() {
    try {
      const response = await axiosInstance.get(`api/v1/Episode/getCandidates`, {
        params: { episodeId },
      });
      console.log(response.data);
      const candidatesList =
        response.data?.realCandidates || response.data || [];
      setAllCandidates(Array.isArray(candidatesList) ? candidatesList : []);

      if (candidatesList && candidatesList.length > 0) {
        setSelectedHunterId(candidatesList[0].hunterId);
      }
    } catch (error) {
      console.error("Greška pri dohvaćanju kandidata:", error);
    }
  }

  useEffect(() => {
    fetchCategories();
    fetchHunters();
    fetchExistingCandidates();
  }, []);

  const getUsedOrderNumbers = (): number[] => {
    return allCandidates.map((c) => c.orderNumber);
  };

  const canAddMoreCandidates = (): boolean => {
    return allCandidates.length < 4;
  };

  const handleDeleteCandidate = async (candidate: RealCandidateDto) => {
    try {
      await candidateForm.handleDeleteById(candidate);

      setAllCandidates((prev) => {
        const updated = prev.filter((c) => c.id !== candidate.id);
        if (updated.length === 0) {
          setSelectedHunterId(null);
        }
        return updated;
      });

      // Resetiraj cijeli flow nazad na praznu formu
      candidateForm.resetForm();
      questionForm.resetForm(false, 0);
      answerForm.resetForm(false);
      setCandidateAdded(false);
      setAddedQuestions([]);
      setAddedAnswers([]);
      setShowAnswerForm(false);
    } catch (error) {
      console.error(error);
      alert("Greška pri brisanju kandidata");
    }
  };

  const handleCandidateSubmit = async () => {
    if (!canAddMoreCandidates()) {
      alert("Već ste dodali maksimalan broj kandidata (4) za ovu epizodu!");
      return;
    }
    if (
      selectedHunterId !== null &&
      candidateForm.formData.hunterId !== selectedHunterId
    ) {
      alert("Svi kandidati u epizodi moraju imati istog lovca!");
      return;
    }
    try {
      const candidate = await candidateForm.handleSubmit();
      if (selectedHunterId === null) {
        setSelectedHunterId(candidate.hunterId);
      }
     setAllCandidates((prev) => {
      const exists = prev.some((c) => c.id === candidate.id);

      if (exists) {
        return prev.map((c) =>
          c.id === candidate.id ? candidate : c
        );
      } else {
        return [...prev, candidate];
      }
    });

      questionForm.setRealCandidateId(candidate.id);
      setCandidateAdded(true);
    } catch (error) {
      console.error(error);
      alert("Greška pri dodavanju kandidata");
    }
  };

  const handleQuestionSubmit = async () => {
    try {
      const question = await questionForm.handleSubmit();
      setAddedQuestions((prev) => [...prev, question]);
      answerForm.setRealQuestionId(question.realQuestionId);
      setShowAnswerForm(true);
    } catch (error) {
      console.error(error);
      alert("Greška pri dodavanju pitanja");
    }
  };

  const handleAnswerSubmit = async () => {
    try {
      const answer = await answerForm.handleSubmit();
      setAddedAnswers((prev) => [...prev, answer]);
    } catch (error) {
      console.error(error);
      alert("Greška pri dodavanju odgovora");
    }
  };

  const handleAddNewQuestion = () => {
    questionForm.resetForm(true, addedQuestions.length);
    answerForm.resetForm(false);
    setShowAnswerForm(false);
  };

  const handleFinal = () => {
    // Resetiraj za novog kandidata
    candidateForm.resetForm();
    questionForm.resetForm(false, 0);
    answerForm.resetForm(false);

    setCandidateAdded(false);
    setAddedQuestions([]);
    setAddedAnswers([]);
    setShowAnswerForm(false);

    alert(`Kandidat završen! Dodano ${addedQuestions.length} pitanja.`);
  };

  return (
    <form className="game-accordion" onSubmit={(e) => e.preventDefault()}>
      <h2>Dodaj kandidate</h2>

      {/* Info panel - Uvijek prikazivan */}
      <div className="candidates-info-panel">
        <div className="info-item">
          <span className="info-label">Dodano kandidata:</span>
          <span className="info-value">{allCandidates.length} / 4</span>
        </div>

        {selectedHunterId != null && (
          <div className="info-item">
            <span className="info-label">Odabrani lovac:</span>
            <span className="info-value">
              {hunters!.find((h) => h.id === selectedHunterId)?.name}
            </span>
          </div>
        )}

        {allCandidates.length > 0 && (
          <div className="info-item">
            <span className="info-label">Zauzeti poredci:</span>
            <span className="info-value">
              {getUsedOrderNumbers()
                .sort((a, b) => a - b)
                .map((n) => Order[n])
                .join(", ")}
            </span>
          </div>
        )}
      </div>
      {/* Lista svih kandidata */}
      {allCandidates.length > 0 && (
        <div className="all-candidates-list mb-3">
          <h4>👥 Kandidati u ovoj epizodi:</h4>
          <ul className="list-group">
            {allCandidates.map((candidate, index) => (
              <li key={candidate.id} className="list-group-item">
                <strong>
                  {index + 1}. {candidate.name}
                </strong>

                <span className="candidate-details">
                  <span className="detail-item">
                    📍 Poredak: {Order[candidate.orderNumber]}
                  </span>
                  <span className="detail-item">
                    💰 Novac: {candidate.finalMoney}
                  </span>
                  <span className="detail-item">🧠 Pitanja: {0}</span>
                  <span
                    className={`detail-item status ${
                      candidate.caught ? "caught" : "escaped"
                    }`}
                  >
                    {candidate.caught ? "Uhvaćen" : "Pobjegao"}
                  </span>
                </span>

                <div className="candidate-actions">
                  <button
                    className="action-btn edit-btn"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      candidateForm.setFormData(candidate);
                      candidateForm.loadForEdit();
                    }}
                  >
                    <FaEdit size={14} />
                  </button>

                  <button
                    className="action-btn delete-btn"
                    type="button"
                    onClick={() => handleDeleteCandidate(candidate)}
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Provjera da li može dodati još kandidata */}
      {!canAddMoreCandidates() ? (
        <div className="max-candidates-reached">
          <h3>⚠️ Maksimalan broj kandidata dostignut</h3>
          <p>
            Već ste dodali 4 kandidata za ovu epizodu. Ne možete dodati više.
          </p>
        </div>
      ) : (
        <>
          <CandidateFormSection
            formData={candidateForm.formData}
            setFormData={candidateForm.setFormData}
            hunters={hunters}
            disabled={candidateForm.disabled}
            allowEdit={candidateForm.allowEdit}
            onSubmit={handleCandidateSubmit}
            onDelete={candidateForm.handleDelete}
            onToggleEdit={candidateForm.toggleEdit}
            usedOrderNumbers={getUsedOrderNumbers()}
            selectedHunterId={selectedHunterId}
          />

          {candidateAdded && (
            <div className="question-section">
              {addedQuestions.length > 0 && (
                <div className="added-questions-summary">
                  <h4>Dodana pitanja: {addedQuestions.length}</h4>
                  <ul className="list-group">
                    {addedQuestions.map((q, index) => {
                      const answer = addedAnswers.find(
                        (a) => a.RealQuestionId === q.RealQuestionId,
                      );
                      return (
                        <li key={q.RealQuestionId} className="list-group-item">
                          <strong>
                            {index + 1}. {q.Text}
                          </strong>
                          <span className="question-check">✓</span>
                          {answer && (
                            <div className="answer-details">
                              <div>
                                <span className="answer-label">Kandidat:</span>{" "}
                                {answer.CandidateAnswer}{" "}
                                <span
                                  className={
                                    answer.CandidateCorrect
                                      ? "correct"
                                      : "incorrect"
                                  }
                                >
                                  {answer.CandidateCorrect ? "✓" : "✗"}
                                </span>
                              </div>
                              <div>
                                <span className="answer-label">Lovac:</span>{" "}
                                {answer.HunterAnswer}{" "}
                                <span
                                  className={
                                    answer.HunterCorrect
                                      ? "correct"
                                      : "incorrect"
                                  }
                                >
                                  {answer.HunterCorrect ? "✓" : "✗"}
                                </span>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <h3>Pitanje {addedQuestions.length + 1}</h3>
              <QuestionFormSection
                formData={questionForm.formData}
                setFormData={questionForm.setFormData}
                categories={categories}
                disabled={questionForm.disabled}
                allowEdit={questionForm.allowEdit}
                onSubmit={handleQuestionSubmit}
                onOptionChange={questionForm.handleOptionChange}
              />
            </div>
          )}

          {showAnswerForm && (
            <div className="answer-section">
              <AnswerFormSection
                formData={answerForm.formData}
                setFormData={answerForm.setFormData}
                alreadySent={answerForm.alreadySent}
                onSubmit={handleAnswerSubmit}
                onDelete={answerForm.handleDelete}
              />

              {answerForm.alreadySent && (
                <button
                  type="button"
                  onClick={handleAddNewQuestion}
                  className="btn-add-new"
                >
                  ➕ Dodaj novo pitanje
                </button>
              )}
            </div>
          )}

          {addedQuestions.length > 0 && (
            <div className="finish-section">
              <button
                type="button"
                onClick={handleFinal}
                className="btn-finish"
              >
                ✓ Završi kandidata ({addedQuestions.length} pitanja)
              </button>
            </div>
          )}
        </>
      )}
    </form>
  );
};

export default CandidatesForm;

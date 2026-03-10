import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CandidateFormSection } from "./CandidateFormSection";
import { QuestionFormSection } from "./QuestionFormSection";
import { useCandidateForm } from "./hooks/useCandidateForm";
import { useQuestionForm } from "./hooks/useQuestionForm";
import { useAnswerForm } from "./hooks/useAnswerForm";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import "./styles/Controller.css";
import type {
  QuestionDto,
  RealAnswerDto,
  RealCandidateDto,
} from "../../../../types/types";
import axiosInstance from "../../../../api/axiosInstance";

interface Props {
  episodeId: number;
  onEpisodeFinished?: () => void;
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
  questions : QuestionDto[],
  answers : RealAnswerDto[]
}
const Controller = ({ episodeId, onEpisodeFinished }: Props ) => {
  const [hunters, setHunters] = useState<HuntersDto[]>();
  const [categories, setCategories] = useState<CategoryDto[]>()
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedHunterId, setSelectedHunterId] = useState<number | null>(null);
  const [addQuestion, setAddQuestion] = useState(false);
  const [activeCandidateId, setActiveCandidateId] = useState<number | null>(null);
  const [editing, setEditing] = useState<{
  candidateId: number;
  realQuestionId: number;
} | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<number | null>(null);
  const allCandidatesHaveQuestion =
  candidates.length > 0 &&
  candidates.every(c => c.questions.length > 0);
  // konst
  const Difficulty = ["neodredeno", "Lagano", "Srednje", "Teško"]
  const Order= ["Kapetan", "2. kandidat", "3. kandidat", "4. kandidat", "Lovac"]
  //useForm
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
    useEffect(() => {
    fetchCategories();
    fetchHunters();
}, []);
 async function handleQuestionEdit() {
    try{
      const question = await questionForm.handleEdit()
      const answer = await answerForm.handleEdit();

      setCandidates(prev => 
          prev.map(c => {
            if (c.realCandidate.id !== question.realCandidateId) {
              return c;
            }

            return {
              ...c,
              questions: c.questions.map(q =>
                q.realQuestionId === question.realQuestionId
                  ? question
                  : q
              ),
              answers: c.answers.map(a =>
                a.realQuestionId === question.realQuestionId
                  ? answer
                  : a
              ),
            };
          })
        );
      setEditing(null);
    }catch (error){
      console.log(error);
      throw error;
    }
 }
  async function handleCandidateSubmit() {  
      try {
        console.log(candidateForm.formData.orderNumber);
        const realCandidate = await candidateForm.handleSubmit(candidateForm.formData.id != 0);
        if (selectedHunterId === null) {
        setSelectedHunterId(realCandidate.hunterId);
      }
        const newUsedNumbers = [...getUsedOrderNumbers(), realCandidate.orderNumber];
        setCandidates(prev => {
          const existing = prev.find(
            c => c.realCandidate.id === realCandidate.id
          );

          if (existing) {
            return prev.map(c =>
              c.realCandidate.id === realCandidate.id
                ? { ...c, realCandidate } 
                : c
            );
          }
          return [...prev, { realCandidate, questions: [], answers: [] }];
        });
        candidateForm.resetForm(newUsedNumbers);
        setEditingCandidate(null);
      } catch (error) {
        console.error(error);
    }
  }
  async function handleDeleteCandidate(id : number) {
      try {
        await axiosInstance.delete("api/v1/Episode/deleteCandidate", 
          {data: {...candidateForm.formData, id: id }}
        );
        setCandidates(prev => {
          const updated = prev.filter(c => c.realCandidate.id !== id);

          if (updated.length === 0) {
            setSelectedHunterId(null);
          }

          return updated;
        });
      } catch (error) {
        console.error(error);
      }
    }
  const getUsedOrderNumbers = () : number[] => {
    return candidates.map((c) => c.realCandidate.orderNumber);
  }
  async function handleQuestionSubmit(){
    try {
    const question = await questionForm.handleSubmit();
    const answer = await answerForm.handleSubmit({
      realQuestionId: question.realQuestionId,
    });
    setCandidates(prev =>
      prev.map(c =>
        c.realCandidate.id === question.realCandidateId
          ? {
              ...c,
              questions: [...c.questions, question],
              answers: [...c.answers, answer],
            }
          : c
      )
    );
    setAddQuestion(false);
    questionForm.resetForm();
    answerForm.resetForm();
    } catch (error) {
      
    }
  }

  async function handleDeleteQuestion(
  candidateId: number,
  questionId: number,
  realQuestionId: number
) {
  try {
      await axiosInstance.delete("api/v1/Episode/deleteQuestion", {
        data: {...questionForm.formData, questionId: questionId},
      });
    setCandidates(prev =>
      prev.map(c => {
        if (c.realCandidate.id !== candidateId) return c;

        return {
          ...c,
          questions: c.questions.filter(q => q.realQuestionId !== realQuestionId),
          answers: c.answers.filter(a => a.realQuestionId !== realQuestionId),
        };
      })
    );
  } catch (error) {
    console.error(error);
  }
}

  return  (<>
          {candidates.length > 0 && (
            <div className="all-candidates-list mb-3">
              <h4>Kandidati:</h4>
              <ul className="list-group">
                {candidates.map((candidate, index) => {
                  const candidateId = candidate.realCandidate.id;

                  const candidateAccordionId = `accordionCandidate${candidateId}`;
                  const candidateCollapseId = `collapseCandidate${candidateId}`;

                  const questionsAccordionId = `accordionQuestions${candidateId}`;
                  const questionsCollapseId = `collapseQuestions${candidateId}`;

                  return (
                    <li key={candidateId} className="list-group-item">
                      
                      {/* ===== GLAVNI ACCORDION (KANDIDAT) ===== */}
                      <div className="accordion" id={candidateAccordionId}>
                        <div className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#${candidateCollapseId}`}
                            >
                              <span className="candidate-details w-100 d-flex justify-content-between align-items-center">
                                <span>
                                  <strong>
                                    {index + 1}. {candidate.realCandidate.name}
                                  </strong>

                                  <span className="ms-3">
                                    Poredak: {Order[candidate.realCandidate.orderNumber]}
                                  </span>

                                  <span className="ms-3">
                                    Novac: {candidate.realCandidate.finalMoney}
                                  </span>

                                  <span className="ms-3">
                                    Pitanja: {candidate.questions.length}
                                  </span>

                                  <span
                                    className={`ms-3 ${
                                      candidate.realCandidate.caught
                                        ? "text-danger"
                                        : "text-success"
                                    }`}
                                  >
                                    {candidate.realCandidate.caught
                                      ? "Uhvaćen"
                                      : "Pobjegao"}
                                  </span>
                                  <div className="candidate-actions">
                                    <button
                                      className="action-btn edit-btn"
                                      type="button"
                                      onClick={() => {
                                        candidateForm.setFormData(candidate.realCandidate);
                                        setEditingCandidate(candidate.realCandidate.id);
                                      }}
                                    >
                                    <FaEdit size={14} />
                                    </button>
{    candidate.questions.length == 0 && <button
                                      className="action-btn delete-btn"
                                      type="button"
                                      onClick={() => {
                                        handleDeleteCandidate(candidate.realCandidate.id);
                                      }}
                                    >
                                      <FaTrash size={14} />
                                    </button>}
                                  </div>
                                </span>
                              </span>
                            </button>
                          </h2>
                          
                          { editingCandidate === candidate.realCandidate.id ? (<><CandidateFormSection
                              formData={candidateForm.formData}
                              setFormData={candidateForm.setFormData}
                              hunters={hunters}
                              disabled={true}
                              allowEdit={candidateForm.allowEdit}
                              onSubmit={handleCandidateSubmit}
                              onDelete={candidateForm.handleDelete}
                              onToggleEdit={candidateForm.toggleEdit}
                              usedOrderNumbers={getUsedOrderNumbers()}
                              selectedHunterId={selectedHunterId}
                            /><button
                                        className="btn btn-primary mt-3"
                                        type="button"
                                        onClick={() => {
                                            candidateForm.resetForm(getUsedOrderNumbers());
                                            setEditingCandidate(null);
                                        }
                                        }
                                      >
                                        Odustani
                                      </button>
                            </>) : 
                          (<div
                            id={candidateCollapseId}
                            className="accordion-collapse collapse"
                            data-bs-parent={`#${candidateAccordionId}`}
                          >
                            <div className="accordion-body">

                              <div className="accordion" id={questionsAccordionId}>
                                <div className="accordion-item">
                                  <h2 className="accordion-header">
                                    <button
                                      className="accordion-button collapsed"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#${questionsCollapseId}`}
                                    >
                                      Pitanja ({candidate.questions.length})
                                    </button>
                                  </h2>

                                  <div
                                    id={questionsCollapseId}
                                    className="accordion-collapse collapse"
                                  >
                                    <div className="accordion-body">

                                      {candidate.questions.length > 0 ? (
                                        candidate.questions.map((q) => {
                                          const answer = candidate.answers.find(
                                            (a) => a.realQuestionId === q.realQuestionId
                                          );

                                          return (
                                            <div key={q.questionId} className="mb-3 p-3 border rounded">
                                              <strong>{q.text}</strong>

                                              <div className="mt-2">Točan odgovor: {q.correctAnswer}</div>

                                              <div>Kandidatov odgovor: {answer?.candidateAnswer ?? "N/A"}</div>
                                              <div>Lovčev odgovor: {answer?.hunterAnswer ?? "N/A"}</div>

                                              <div>Runda: {q.roundType}</div>
                                              <div>Težina: {Difficulty[q.difficulty]}</div>
{!editing &&                                 <div className="candidate-actions">
                                              <button
                                                className="action-btn edit-btn"
                                                type="button"
                                                onClick={() => {
                                                    setAddQuestion(false);
                                                    setEditing({
                                                      candidateId: candidate.realCandidate.id,
                                                      realQuestionId: q.realQuestionId
                                                    });
                                                  questionForm.setFormData(q);
                                                  answerForm.setFormData(answer!);  
                                                }}
                                              >
                                                <FaEdit size={14} />
                                              </button>
                                              <button
                                                className="action-btn delete-btn"
                                                type="button"
                                                onClick={() => {
                                                  handleDeleteQuestion(candidate.realCandidate.id, q.questionId, q.realQuestionId)
                                                }}
                                              >
                                                <FaTrash size={14} />
                                              </button>
                                            </div>}
                                                  {!addQuestion && editing &&
                                                    editing.candidateId === candidate.realCandidate.id && editing.realQuestionId === q.realQuestionId && (
<  >                                                  <QuestionFormSection
                                                    formData={questionForm.formData}
                                                    setFormData={questionForm.setFormData}
                                                    formAnswerData={answerForm.formData}
                                                    setFormAnswerData={answerForm.setFormData}
                                                    categories={categories}
                                                    disabled={true}
                                                    allowEdit={questionForm.allowEdit}
                                                    onSubmit={handleQuestionEdit}
                                                    onOptionChange={questionForm.handleOptionChange}
                                                    orderNumber={candidate.realCandidate.orderNumber}
                                                />                                       <button
                                        className="btn btn-primary mt-3"
                                        type="button"
                                        onClick={() => {
                                            questionForm.resetForm();   
                                            answerForm.resetForm();
                                            setEditing(null);                        
                                            setAddQuestion(false);
                                        }
                                        }
                                      >
                                        Odustani
                                      </button>
                                      </>
                                              )}
                                            </div>
                                          );
                                        })
                                      ) : (
                                        
                                        <div className="text-muted">Nema dodanih pitanja.</div>
                                      )}
                                      {addQuestion && activeCandidateId === candidate.realCandidate.id ? 
                                      <><QuestionFormSection
                                          formData={questionForm.formData}
                                          setFormData={questionForm.setFormData}
                                          formAnswerData={answerForm.formData}
                                          setFormAnswerData={answerForm.setFormData}
                                          categories={categories}
                                          disabled={questionForm.disabled}
                                          allowEdit={questionForm.allowEdit}
                                          onSubmit={handleQuestionSubmit}
                                          onOptionChange={questionForm.handleOptionChange}
                                          orderNumber={candidate.realCandidate.orderNumber}
                                      />
                                      <button
                                        className="btn btn-primary mt-3"
                                        type="button"
                                        onClick={() => {
                                            questionForm.resetForm();   
                                            setEditing(null);                        
                                            setAddQuestion(false);
                                        }
                                        }
                                      >
                                        Odustani
                                      </button>
                                      </> :
                                      <button
                                        className="btn btn-primary mt-3"
                                        type="button"
                                        onClick={() => {
                                            setEditing(null);
                                            questionForm.resetForm();
                                            setActiveCandidateId(candidate.realCandidate.id)
                                            questionForm.setFormData(prev => ({...prev, 
                                            realCandidateId : candidate.realCandidate.id}))                            
                                            setAddQuestion(true);
                                        }
                                        }
                                      >
                                        + Dodaj pitanje
                                      </button>
                                      }
                                      

                                    </div>
                                  </div>
                                </div>
                              </div>


                            </div>
                          </div>)}
                        </div>
                      </div>


                    </li>
                  );
                })}
              </ul>
            </div>
          )}

            {!editingCandidate && candidates.length < 5 && <CandidateFormSection
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
          />}
          {candidates.length == 5 && !allCandidatesHaveQuestion && <>
          <div className="alert alert-success" role="alert">
            <h4 className="alert-heading">Dodali ste sve kandidate za ovu epizodu</h4>
            <p>Da bi nastavili dodajte jedno pitanje barem svakom kandidatu</p>
            <hr/>
            <p className="mb-0">Još malo pa gotovo!</p>
          </div>
          </>}
          {allCandidatesHaveQuestion &&
          <button
            type="button"
            className="btn btn-success"
            onClick={onEpisodeFinished}
          >
            Završi
          </button>}
          </>);
}

export default Controller;
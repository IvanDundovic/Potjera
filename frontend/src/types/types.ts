

export interface EpisodeFormData {
  id: number;
  showId: number;
  title: string;
  episodeNumber: number;
  season: number;
  broadcastDate: string; 
  winner: string;
}

export interface RealCandidateDto {
  id: number;
  name: string;
  episodeId: number;
  orderNumber: number;
  finalMoney: number;
  hunterId: number;
  caught: boolean;
}

export interface QuestionDto {
  questionId: number;
  text: string;
  correctAnswer: string;
  explanation?: string;
  categoryId: number;
  difficulty: number;
  showId: number;
  realQuestionId: number;
  episodeId: number;
  realCandidateId: number;
  roundType: string;
  orderNumber: number;
  options: string[]
}

export interface RealAnswerDto {
  id: number;
  episodeId: number;
  realQuestionId: number;
  candidateAnswer?: string;
  hunterAnswer?: string;
  candidateCorrect: boolean;
  hunterCorrect: boolean;
}
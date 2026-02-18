using PotjeraAPI.DTOs;

namespace PotjeraAPI.Interfaces;

public interface IEpisodeService
{
    Task AddEpisodeAsync(EpisodeDto dto);
    Task DeleteEpisodeAsync(EpisodeDto dto);
    Task<GetAllEpisodesResponseDto> GetAllEpisodesAsync(EpisodeDto dto);
    Task EditEpisodeAsync(EpisodeDto dto);

    Task AddRealCandidateAsync(RealCandidateDto dto);
    Task DeleteRealCandidateAsync(RealCandidateDto dto);
    Task UpdateRealCandidateAsync(RealCandidateDto dto);
    Task<GetAllRealCandidatesDto> GetAllRealCandidatesAsync(RealCandidateDto dto);

    Task AddRealQuestionForCandidateAsync(QuestionDto dto);
    Task DeleteRealQuestionForCandidateAsync(QuestionDto dto);
    Task<GetAllQuestionsForCandidateDto> GetAllRealQuestionsForCandidateAsync(QuestionDto dto);
    Task UpdateRealQuestionForCandidateAsync(QuestionDto dto);

    Task AddRealAnswerAsync(RealAnswerDto dto);
    Task DeleteRealAnswerAsync(RealAnswerDto dto);
    Task<GetAllRealAnswersDto> GetAllRealAnswersAsync(RealAnswerDto dto);
}


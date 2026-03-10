using PotjeraAPI.DTOs;

namespace PotjeraAPI.Interfaces;

public interface IEpisodeService
{
    Task<EpisodeDto> AddEpisodeAsync(EpisodeDto dto);
    Task DeleteEpisodeAsync(EpisodeDto dto);
    Task<GetAllEpisodesResponseDto> GetAllEpisodesAsync(EpisodeDto dto);
    Task<EpisodeDto> EditEpisodeAsync(EpisodeDto dto);

    Task<RealCandidateDto> AddRealCandidateAsync(RealCandidateDto dto);
    Task DeleteRealCandidateAsync(RealCandidateDto dto);
    Task<RealCandidateDto> UpdateRealCandidateAsync(RealCandidateDto dto);
    Task<GetAllRealCandidatesDto> GetAllRealCandidatesAsync(int episodeId);

    Task<QuestionDto> AddRealQuestionForCandidateAsync(QuestionDto dto);
    Task DeleteRealQuestionForCandidateAsync(QuestionDto dto);
    Task<GetAllQuestionsForCandidateDto> GetAllRealQuestionsForCandidateAsync(QuestionDto dto);
    Task<QuestionDto> UpdateRealQuestionForCandidateAsync(QuestionDto dto);

    Task<RealAnswerDto> AddRealAnswerAsync(RealAnswerDto dto);
    Task DeleteRealAnswerAsync(RealAnswerDto dto);
    Task<RealAnswerDto> UpdateRealAnswer(RealAnswerDto dto);
    Task<GetAllRealAnswersDto> GetAllRealAnswersAsync(RealAnswerDto dto);

    Task<GetAllShowsDto> GetAllShowsAsync();
    Task<GetAllCategoriesDto> GetAllCategoriesAsync();
    Task<GetAllHuntersDto> GetAllHuntersAsync();
}


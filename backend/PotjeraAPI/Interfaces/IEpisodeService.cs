using PotjeraAPI.DTOs;

namespace PotjeraAPI.Interfaces;

public interface IEpisodeService
{
    Task AddEpisodeAsync(EpisodeDto dto);
    Task DeleteEpisodeAsync(EpisodeDto dto);
    Task<GetAllEpisodesResponseDto> GetAllEpisodesAsync(EpisodeDto dto);
    Task EditEpisodeAsync(EpisodeDto dto);

    void AddRealCandidateAsync();
    void DeleteRealCandidateAsync();
    void UpdateRealCandidateAsync();
    void GetAllRealCandidatesAsync();

    void AddRealQuestionForCandidateAsync();
    void DeleteRealQuestionForCandidateAsync();
    void GetAllRealQuestionsForCandidateAsync();
    void UpdateRealQuestionForCandidateAsync();
}


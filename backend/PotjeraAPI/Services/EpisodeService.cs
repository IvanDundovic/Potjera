using Microsoft.EntityFrameworkCore;
using PotjeraAPI.Data;
using PotjeraAPI.DTOs;
using PotjeraAPI.Interfaces;
using PotjeraAPI.Models;
using System.Threading.Tasks;

namespace PotjeraAPI.Services;

public class EpisodeService(ApplicationDbContex contex) : IEpisodeService
{
    public async Task AddEpisodeAsync(EpisodeDto dto)
    {
        var episode = await contex.Episodes
            .FirstOrDefaultAsync(episode => episode.ShowId == dto.ShowId 
                                 && episode.EpisodeNumber == dto.EpisodeNumber
                                 && episode.Season == dto.Season);
        if (episode == null)
        {
            episode = new Episode
            {
                ShowId = dto.ShowId,
                Title = dto.Title,
                EpisodeNumber = dto.EpisodeNumber,
                Season = dto.Season,
                BroadcastDate = dto.BroadcastDate,
                Winner = dto.Winner!
            };
            await contex.Episodes.AddAsync(episode);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Episode already exists");
    }

    public void AddRealCandidateAsync()
    {
        throw new NotImplementedException();
    }

    public void AddRealQuestionForCandidateAsync()
    {
        throw new NotImplementedException();
    }

    public async Task DeleteEpisodeAsync(EpisodeDto dto)
    {
        var episodeToDelete = await contex.Episodes
            .FirstOrDefaultAsync(e => e.ShowId == dto.ShowId
            && e.Id == dto.Id);
        if (episodeToDelete != null)
        {
            contex.Episodes.Remove(episodeToDelete);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Episode does not exist");
    }

    public void DeleteRealCandidateAsync()
    {
        throw new NotImplementedException();
    }

    public void DeleteRealQuestionForCandidateAsync()
    {
        throw new NotImplementedException();
    }

    public async Task EditEpisodeAsync(EpisodeDto dto)
    {
        var episodeToEdit = await contex.Episodes
            .FirstOrDefaultAsync(e => e.ShowId == dto.ShowId
            && e.Id == dto.Id);
        if (episodeToEdit != null) 
        {
            episodeToEdit.Title = dto.Title;
            episodeToEdit.Winner = dto.Winner!;
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Episode does not exists");
    }

    public async Task<GetAllEpisodesResponseDto> GetAllEpisodesAsync(EpisodeDto dto)
    {
        var listOfEpisodes = await contex.Episodes
             .Select(e => new EpisodeDto
             {
                 Id = e.Id,
                 ShowId = e.ShowId,
                 EpisodeNumber = e.EpisodeNumber,
                 Season = e.Season,
                 BroadcastDate = e.BroadcastDate,
                 Title = e.Title,
                 Winner = e.Winner
             })
             .Where(e => e.ShowId == dto.ShowId)
             .ToListAsync();
        return new GetAllEpisodesResponseDto { Episodes = listOfEpisodes };
    }

    public void GetAllRealCandidatesAsync()
    {
        throw new NotImplementedException();
    }

    public void GetAllRealQuestionsForCandidateAsync()
    {
        throw new NotImplementedException();
    }

    public void UpdateRealCandidateAsync()
    {
        throw new NotImplementedException();
    }

    public void UpdateRealQuestionForCandidateAsync()
    {
        throw new NotImplementedException();
    }
}


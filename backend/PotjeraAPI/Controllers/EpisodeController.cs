using Microsoft.AspNetCore.Mvc;
using PotjeraAPI.DTOs;
using PotjeraAPI.Interfaces;

namespace PotjeraAPI.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class EpisodeController(IEpisodeService episodeService) : ControllerBase
{
    [HttpPost("addEpisode")]
    public async Task<IActionResult> AddEpisodeAsync([FromBody]EpisodeDto dto)
    {
        await episodeService.AddEpisodeAsync(dto);
        return Ok(new { message = "Episode successfully added." });
    }

    [HttpPut("editEpisode")]
    public async Task<IActionResult> EditEpisodeAsync([FromBody]EpisodeDto dto)
    {
        await episodeService.EditEpisodeAsync(dto);
        return Ok(new { message = "Episode successfully edited." });
    }
    [HttpGet]
    public async Task<IActionResult> GetAllEpisodesAsync([FromQuery] EpisodeDto dto)
    {
        var allEpisodes = await episodeService.GetAllEpisodesAsync(dto);
        return Ok(allEpisodes);
    }
    [HttpDelete("delete")]
    public async Task<IActionResult> DeleteEpisodeAsync([FromBody] EpisodeDto dto)
    {
        await episodeService.DeleteEpisodeAsync(dto);
        return Ok(new { message = "Episode successfully deleted." });
    }
}


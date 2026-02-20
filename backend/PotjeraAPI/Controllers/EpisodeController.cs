using Microsoft.AspNetCore.Mvc;
using PotjeraAPI.DTOs;
using PotjeraAPI.Interfaces;

namespace PotjeraAPI.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class EpisodeController(IEpisodeService episodeService) : ControllerBase
{
    #region Episode
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

    [HttpGet("getEpisodes")]
    public async Task<IActionResult> GetAllEpisodesAsync([FromQuery] EpisodeDto dto)
    {
        var allEpisodes = await episodeService.GetAllEpisodesAsync(dto);
        return Ok(allEpisodes);
    }

    [HttpDelete("deleteEpisode")]
    public async Task<IActionResult> DeleteEpisodeAsync([FromBody] EpisodeDto dto)
    {
        await episodeService.DeleteEpisodeAsync(dto);
        return Ok(new { message = "Episode successfully deleted." });
    }
    #endregion

    #region Candidate
    [HttpPost("addCandidate")]
    public async Task<IActionResult> AddQuestionAsync([FromBody] RealCandidateDto dto)
    {
        await episodeService.AddRealCandidateAsync(dto);
        return Ok(new { message = "Candidate successfully added." });
    }

    [HttpPut("editCandidate")]
    public async Task<IActionResult> EditCandidateAsync([FromBody] RealCandidateDto dto)
    {
        await episodeService.UpdateRealCandidateAsync(dto);
        return Ok(new { message = "Candidate successfully edited." });
    }

    [HttpGet("getCandidates")]
    public async Task<IActionResult> GetAllCandidatesAsync([FromQuery] RealCandidateDto dto)
    {
        var allCandidates = await episodeService.GetAllRealCandidatesAsync(dto);
        return Ok(allCandidates);
    }

    [HttpDelete("deleteCandidate")]
    public async Task<IActionResult> DeleteCandidateAsync([FromBody] RealCandidateDto dto)
    {
        await episodeService.DeleteRealCandidateAsync(dto);
        return Ok(new { message = "Candidate successfully deleted." });
    }
    #endregion

    #region Question
    [HttpPost("addQuestion")]
    public async Task<IActionResult> AddQuestionAsync([FromBody] QuestionDto dto)
    {
        await episodeService.AddRealQuestionForCandidateAsync(dto);
        return Ok(new { message = "Question successfully added." });
    }

    [HttpPut("editQuestion")]
    public async Task<IActionResult> EditQuestionAsync([FromBody] QuestionDto dto)
    {
        await episodeService.UpdateRealQuestionForCandidateAsync(dto);
        return Ok(new { message = "Question successfully edited." });
    }

    [HttpGet("getQuestions")]
    public async Task<IActionResult> GetAllQuestionAsync([FromQuery] QuestionDto dto)
    {
        var allQuestion = await episodeService.GetAllRealQuestionsForCandidateAsync(dto);
        return Ok(allQuestion);
    }

    [HttpDelete("deleteQuestion")]
    public async Task<IActionResult> DeleteQuestionAsync([FromBody] QuestionDto dto)
    {
        await episodeService.DeleteRealQuestionForCandidateAsync(dto);
        return Ok(new { message = "Question successfully deleted." });
    }
    #endregion

    #region Answer

    [HttpPost("addAnswer")]
    public async Task<IActionResult> AddAnswerAsync([FromBody] RealAnswerDto dto)
    {
        await episodeService.AddRealAnswerAsync(dto);
        return Ok(new { message = "Answer successfully added." });
    }

    [HttpGet("getAnswers")]
    public async Task<IActionResult> GetAllAnswersAsync([FromQuery] RealAnswerDto dto)
    {
        var allAnswers = await episodeService.GetAllRealAnswersAsync(dto);
        return Ok(allAnswers);
    }

    [HttpDelete("deleteAnswer")]
    public async Task<IActionResult> DeleteAnswerAsync([FromBody] RealAnswerDto dto)
    {
        await episodeService.DeleteRealAnswerAsync(dto);
        return Ok(new { message = "Answer successfully deleted." });
    }
    #endregion

    #region Shows
    [HttpGet("getShows")]

    public async Task<IActionResult> GetAllShowsAsync()
    {
        var allShows = await episodeService.GetAllShowsAsync();
        return Ok(allShows);
    }
    #endregion

    #region Hunters
    [HttpGet("getHunters")]
    public async Task<IActionResult> GetAllHuntersAsync()
    {
        var allHunters = await episodeService.GetAllHuntersAsync();
        return Ok(allHunters);
    }
    #endregion

    #region Categories
    [HttpGet("getCategories")]
    public async Task<IActionResult> GetAllCategoriesAsync()
    {
        var allCategories = await episodeService.GetAllCategoriesAsync();
        return Ok(allCategories);
    }
    #endregion
}



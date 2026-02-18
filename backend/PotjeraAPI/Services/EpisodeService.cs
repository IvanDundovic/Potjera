using Microsoft.EntityFrameworkCore;
using PotjeraAPI.Data;
using PotjeraAPI.DTOs;
using PotjeraAPI.Interfaces;
using PotjeraAPI.Models;

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

    public async Task AddRealCandidateAsync(RealCandidateDto dto)
    {
        var candidate = await contex.RealCandidates
            .FirstOrDefaultAsync(rc => rc.EpisodeId == dto.EpisodeId
            && rc.OrderNumber == dto.OrderNumber);
        if (candidate == null)
        {
            candidate = new RealCandidate
            {
                Name = dto.Name,
                OrderNumber = dto.OrderNumber,
                EpisodeId = dto.EpisodeId,
                Caught = dto.Caught,
                FinalMoney = dto.FinalMoney,
                HunterId = dto.HunterId,
            };
            await contex.RealCandidates.AddAsync(candidate);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Candidate with this order number is already added");
    }

    public async Task AddRealQuestionForCandidateAsync(QuestionDto dto)
    {
        var question = await contex.Questions
            .FirstOrDefaultAsync(q => q.Text == dto.Text);
        if(question == null)
        {
            question = new Question
            {
                CorrectAnswer = dto.CorrectAnswer,
                Text = dto.Text,
                Difficulty = dto.Difficulty,
                Explanation = dto.Explanation,
                ShowId = dto.ShowId,
                CategoryId = dto.CategoryId
            };
            await contex.Questions.AddAsync(question);
            await contex.SaveChangesAsync();

            var realQuestion = new RealQuestion
            {
                RoundType = dto.RoundType,
                EpisodeId = dto.EpisodeId,
                Question = question,
                RealCandidateId = dto.RealCandidateId,
                OrderNumber = dto.OrderNumber,

            };
            await contex.RealQuestions.AddAsync(realQuestion);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Question is already added");
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

    public async Task DeleteRealCandidateAsync(RealCandidateDto dto)
    {
        var candidateToDelete = await contex.RealCandidates
            .FirstOrDefaultAsync(rc => rc.Id == dto.Id
                && rc.EpisodeId == dto.EpisodeId);
        if (candidateToDelete != null)
        {
            contex.RealCandidates.Remove(candidateToDelete);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Candidate does not exist");
    }

    public async Task DeleteRealQuestionForCandidateAsync(QuestionDto dto)
    {
        var questionToDelete = await contex.RealQuestions
            .FirstOrDefaultAsync(q => q.Id == dto.QuestionId);
        if (questionToDelete != null)
        {
            contex.RealQuestions.Remove(questionToDelete);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Question does not exist");
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

    public async Task<GetAllRealCandidatesDto> GetAllRealCandidatesAsync(RealCandidateDto dto)
    {
        var listOfRealCandidates = await contex.RealCandidates
            .Select(rc => new RealCandidateDto
            {
                Id = rc.Id,
                Name = rc.Name,
                EpisodeId = rc.EpisodeId,
                Caught = rc.Caught,
                FinalMoney = rc.FinalMoney,
                HunterId = rc.HunterId,
                OrderNumber = rc.OrderNumber,
            })
            .Where(rc => rc.EpisodeId == dto.EpisodeId)
            .ToListAsync();
        return new GetAllRealCandidatesDto { RealCandidates = listOfRealCandidates };
    }

    public async Task<GetAllQuestionsForCandidateDto> GetAllRealQuestionsForCandidateAsync(QuestionDto dto)
    {
        var listOfQuestions = await contex.RealQuestions
            .Where(rq => rq.RealCandidateId == dto.RealCandidateId)
            .Select(rq => new QuestionDto
            {
                CorrectAnswer = rq.Question!.CorrectAnswer,
                EpisodeId = rq.EpisodeId,
                RoundType = rq.RoundType,
                Text = rq.Question.Text,
                CategoryId = rq.Question.CategoryId,
                Difficulty = rq.Question.Difficulty,
                Explanation = rq.Question.Explanation,
                OrderNumber = rq.OrderNumber,
                QuestionId = rq.QuestionId,
                ShowId = rq.Question.ShowId
            }) 
            .ToListAsync();
        return new GetAllQuestionsForCandidateDto { Questions  = listOfQuestions };
    }

    public async Task UpdateRealCandidateAsync(RealCandidateDto dto)
    {
        var candidateToEdit = await contex.RealCandidates
            .FirstOrDefaultAsync(rc =>  rc.Id == dto.Id);
        if(candidateToEdit != null)
        {
            candidateToEdit.Name = dto.Name;
            candidateToEdit.Caught = dto.Caught;
            candidateToEdit.FinalMoney = dto.FinalMoney;
            await contex.SaveChangesAsync();
        }else throw new Exception("Candidate does not exist");
    }

    public async Task UpdateRealQuestionForCandidateAsync(QuestionDto dto)
    {
        var realQuestionToEdit = await contex.RealQuestions
            .FirstOrDefaultAsync(rq => rq.Id == dto.RealQuestionId
            && rq.RealCandidateId == dto.RealCandidateId);
        if (realQuestionToEdit != null)
        {
            var questionToEdit = await contex.Questions.FindAsync(realQuestionToEdit.QuestionId);
            questionToEdit!.Text = dto.Text;
            questionToEdit.Explanation = dto.Explanation;
            questionToEdit.Difficulty = dto.Difficulty;
            questionToEdit.CategoryId = dto.CategoryId;
            questionToEdit.CorrectAnswer = dto.CorrectAnswer;
            realQuestionToEdit.RoundType = dto.RoundType;
            realQuestionToEdit.OrderNumber = dto.OrderNumber;
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Question does not exist");           
    }

    public async Task AddRealAnswerAsync(RealAnswerDto dto)
    {
        var realAnswer = await contex.RealAnswers
            .FirstOrDefaultAsync(ra => ra.RealQuestionId == dto.RealQuestionId);
        if (realAnswer == null)
        {
            realAnswer = new RealAnswer
            {
                RealQuestionId = dto.RealQuestionId,
                CandidateAnswer = dto.CandidateAnswer,
                CandidateCorrect = dto.CandidateCorrect,
                HunterAnswer = dto.HunterAnswer,
                HunterCorrect = dto.HunterCorrect,
                TimeToAnswerCandidate = CalculateTimeRand("Candidate"),
                TimeToAnswerHunter = CalculateTimeRand("Hunter")
            };
            await contex.RealAnswers.AddAsync(realAnswer);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Answer already added");
    }
    public async Task DeleteRealAnswerAsync(RealAnswerDto dto)
    {
        var answerToDelete = await contex.RealAnswers
            .FirstOrDefaultAsync(e => e.Id == dto.Id);
        if (answerToDelete != null)
        {
            contex.RealAnswers.Remove(answerToDelete);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Answer does not exist");
    }
    public async Task<GetAllRealAnswersDto> GetAllRealAnswersAsync(RealAnswerDto dto)
    {
        var listOfAnswers = await contex.RealAnswers
            .Where(ra => ra.RealQuestion!.EpisodeId == dto.EpisodeId)
            .Select(ra => new RealAnswerDto
            {
                CandidateAnswer = ra.CandidateAnswer,
                HunterAnswer = ra.HunterAnswer,
                HunterCorrect = ra.HunterCorrect,
                CandidateCorrect = ra.CandidateCorrect
            })
            .ToListAsync();
        return new GetAllRealAnswersDto { Answers = listOfAnswers };
    }
    public double CalculateTimeRand(string str)
    {
        double result;
        Random rand = new();
        switch (str)
        {
            case "Hunter":
                double r = rand.NextDouble();
                result = rand.Next(2, 5) * r;
                return result;
            case "Candidate":
                r = rand.NextDouble();
                result = rand.Next(2, 5) * r * 0.8;
                return result;
        }
        return 3.4;
    }
}


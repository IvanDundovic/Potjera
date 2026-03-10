using Microsoft.EntityFrameworkCore;
using PotjeraAPI.Data;
using PotjeraAPI.DTOs;
using PotjeraAPI.Interfaces;
using PotjeraAPI.Models;

namespace PotjeraAPI.Services;

public class EpisodeService(ApplicationDbContex contex) : IEpisodeService
{
    public async Task<EpisodeDto> AddEpisodeAsync(EpisodeDto dto)

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
        return new EpisodeDto
        {
            BroadcastDate = episode.BroadcastDate,
            EpisodeNumber = episode.EpisodeNumber,
            Id = episode.Id,
            Season = episode.Season,
            ShowId = episode.ShowId,
            Title = episode.Title,
            Winner = episode.Winner
        };
    }

    public async Task<RealCandidateDto> AddRealCandidateAsync(RealCandidateDto dto)
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
            return new RealCandidateDto
            {
                Name = candidate.Name,
                Caught = candidate.Caught,
                EpisodeId = candidate.EpisodeId,
                FinalMoney = candidate.FinalMoney,
                HunterId = candidate.HunterId,
                Id = candidate.Id,
                OrderNumber = candidate.OrderNumber
            };
        }
        else throw new Exception("Candidate with this order number is already added");
    }

    public async Task<QuestionDto> AddRealQuestionForCandidateAsync(QuestionDto dto)
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

            return new QuestionDto
            {
                CorrectAnswer = question.CorrectAnswer,
                RoundType = realQuestion.RoundType,
                Text = question.Text,
                CategoryId = question.CategoryId,
                Difficulty = question.Difficulty,
                EpisodeId = realQuestion.EpisodeId,
                Explanation = question.Explanation,
                OrderNumber = realQuestion.OrderNumber,
                QuestionId = realQuestion.QuestionId,
                RealCandidateId = realQuestion.RealCandidateId,
                RealQuestionId = realQuestion.Id,
                ShowId = question.ShowId
            };
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
        var questionToDelete = await contex.Questions
            .FirstOrDefaultAsync(q => q.Id == dto.QuestionId);
        if (questionToDelete != null)
        {
            contex.Questions.Remove(questionToDelete);
            await contex.SaveChangesAsync();
        }
        else throw new Exception("Question does not exist");
    }

    public async Task<EpisodeDto> EditEpisodeAsync(EpisodeDto dto)
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
        return new EpisodeDto
        {
            BroadcastDate = episodeToEdit.BroadcastDate,
            EpisodeNumber =     episodeToEdit.EpisodeNumber,
            Id = episodeToEdit.Id,
            Season = episodeToEdit.Season,
            ShowId = episodeToEdit.ShowId,
            Title =  episodeToEdit.Title,
            Winner = episodeToEdit.Winner
        };
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

    public async Task<GetAllRealCandidatesDto> GetAllRealCandidatesAsync(int episodeId)
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
            .Where(rc => rc.EpisodeId == episodeId)
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

    public async Task<RealCandidateDto> UpdateRealCandidateAsync(RealCandidateDto dto)
    {
        var candidateToEdit = await contex.RealCandidates
            .FirstOrDefaultAsync(rc =>  rc.Id == dto.Id);
        if(candidateToEdit != null)
        {
            candidateToEdit.Name = dto.Name;
            candidateToEdit.Caught = dto.Caught;
            candidateToEdit.FinalMoney = dto.FinalMoney;
            await contex.SaveChangesAsync();
            return new RealCandidateDto
            {
                Name = candidateToEdit.Name,
                OrderNumber = candidateToEdit.OrderNumber,
                Id = candidateToEdit.Id,
                HunterId = candidateToEdit.HunterId,
                FinalMoney = candidateToEdit.FinalMoney,
                EpisodeId = candidateToEdit.EpisodeId,
                Caught = candidateToEdit.Caught
            };
        }else throw new Exception("Candidate does not exist");
    }

    public async Task<QuestionDto> UpdateRealQuestionForCandidateAsync(QuestionDto dto)
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
            realQuestionToEdit.OrderNumber = dto.OrderNumber;
            await contex.SaveChangesAsync();
            return new QuestionDto
            {
                CorrectAnswer = questionToEdit.CorrectAnswer,
                RoundType = realQuestionToEdit.RoundType,
                Text =  questionToEdit.Text,
                CategoryId = questionToEdit.CategoryId,
                Difficulty = questionToEdit.Difficulty,
                EpisodeId = realQuestionToEdit.EpisodeId,
                Explanation = questionToEdit.Explanation,
                OrderNumber = realQuestionToEdit.OrderNumber,
                QuestionId = realQuestionToEdit.QuestionId,
                RealCandidateId = realQuestionToEdit.RealCandidateId,
                RealQuestionId = realQuestionToEdit.Id,
                ShowId = questionToEdit.ShowId
            };
        }
        else throw new Exception("Question does not exist");           
    }

    public async Task<RealAnswerDto> UpdateRealAnswer(RealAnswerDto dto)
    {
        var answerToEdit = await contex.RealAnswers.FirstOrDefaultAsync(ra => ra.Id == dto.Id);

        if (answerToEdit != null) 
        { 
            answerToEdit.HunterAnswer = dto.HunterAnswer;
            answerToEdit.HunterCorrect = dto.HunterCorrect;
            answerToEdit.CandidateCorrect = dto.CandidateCorrect;
            answerToEdit.CandidateAnswer = dto.CandidateAnswer;

            contex.SaveChanges();
            return new RealAnswerDto
            {
                CandidateAnswer = answerToEdit.CandidateAnswer,
                CandidateCorrect = answerToEdit.CandidateCorrect,
                HunterCorrect = answerToEdit.HunterCorrect,
                HunterAnswer = answerToEdit.HunterAnswer,
                Id = answerToEdit.Id,
                RealQuestionId = answerToEdit.RealQuestionId
            };
        }
        else throw new Exception("Question does not exist");
    }
    public async Task<RealAnswerDto> AddRealAnswerAsync(RealAnswerDto dto)
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
            return new RealAnswerDto
            {
                EpisodeId = realAnswer.Id,
                Id = realAnswer.Id,
                CandidateAnswer = realAnswer.CandidateAnswer,
                CandidateCorrect = realAnswer.CandidateCorrect,
                HunterAnswer = realAnswer.HunterAnswer,
                HunterCorrect = realAnswer.HunterCorrect,
                RealQuestionId = realAnswer.RealQuestionId
            };
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

    public async Task<GetAllShowsDto> GetAllShowsAsync()
    {
        var listOfShows = await contex.Shows
            .Select(s => new ShowDto
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description
            })
            .ToListAsync();
        return new GetAllShowsDto { Shows = listOfShows };
    }
    public async Task<GetAllCategoriesDto> GetAllCategoriesAsync()
    {
        var listOfCategories = await contex.Categories
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description
            })
            .ToListAsync();

        return new GetAllCategoriesDto { Categories = listOfCategories };
    }
    public async Task<GetAllHuntersDto> GetAllHuntersAsync()
    {
        var listOfHunters = await contex.Hunters
    .Select(h => new HunterDto
    {
        Id = h.Id,
        Name = h.Name,
        Description = h.Description
    })
    .ToListAsync();

        return new GetAllHuntersDto { Hunters = listOfHunters };
    }
}


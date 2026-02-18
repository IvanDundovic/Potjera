namespace PotjeraAPI.DTOs;
public class QuestionDto
{
    //question
    public int QuestionId { get; set; }
    public required string Text { get; set; }
    public required string CorrectAnswer { get; set; }
    public string? Explanation { get; set; }
    public int CategoryId { get; set; }
    public int Difficulty { get; set; }
    public int ShowId { get; set; }
    // real question
    public int RealQuestionId { get; set; }
    public int EpisodeId { get; set; }
    public int RealCandidateId { get; set; }
    public required string RoundType { get; set; }
    public int OrderNumber { get; set; }
}


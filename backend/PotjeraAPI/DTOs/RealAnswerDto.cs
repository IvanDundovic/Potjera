namespace PotjeraAPI.DTOs;

public class RealAnswerDto
{
    public int Id { get; set; }
    public int EpisodeId { get; set; }
    public int RealQuestionId { get; set; }
    public string? CandidateAnswer { get; set; }
    public string? HunterAnswer { get; set; }
    public bool CandidateCorrect { get; set; }
    public bool HunterCorrect { get; set; }
}


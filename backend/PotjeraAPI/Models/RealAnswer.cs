namespace PotjeraAPI.Models;

public class RealAnswer
{
    public int Id { get; set; }
    public int RealQuestionId { get; set; }
    public RealQuestion? RealQuestion { get; set; }
    public string? CandidateAnswer { get; set; }
    public string? HunterAnswer { get; set; }
    public bool CandidateCorrect { get; set; }
    public bool HunterCorrect { get; set; }
    public Double TimeToAnswerCandidate { get; set; } = 1.7;
    public Double TimeToAnswerHunter { get; set; } = 1.45;
}


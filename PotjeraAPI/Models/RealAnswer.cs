namespace PotjeraAPI.Models;

public class RealAnswer
{
    public int Id { get; set; }
    public int RealQuestionId { get; set; }
    public string? CandidateAnswer { get; set; }
    public string? HunterAnswer { get; set; }
    public bool CandidateCorrect { get; set; }
    public bool HunterCorrect { get; set; }
    public float TimeToAnswerCandidate { get; set; }
    public float TimeToAnswerHunter {  get; set; }
}


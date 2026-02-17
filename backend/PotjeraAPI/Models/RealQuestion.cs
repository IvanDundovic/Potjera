namespace PotjeraAPI.Models;

public class RealQuestion
{
    public int Id { get; set; }
    public int EpisodeId { get; set; }
    public Episode? Episode { get; set; }
    public int RealCandidateId { get; set; }
    public RealCandidate? RealCandidate { get; set; }
    public int QuestionId { get; set; }
    public Question? Question { get; set; }
    public required string RoundType { get; set; }
    public int OrderNumber { get; set; }
    public RealAnswer? RealAnswer { get; set; }
}


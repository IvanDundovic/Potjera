namespace PotjeraAPI.Models;

public class Episode
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public Show? Show { get; set; }
    public string? Title { get; set; }
    public int EpisodeNumber { get; set; }
    public int Season {  get; set; }
    public DateTime BroadcastDate { get; set; }
    public string Winner { get; set; } = "Hunter";

    public ICollection<RealCandidate>? RealCandidates { get; set; }
    public ICollection<RealQuestion>? RealQuestions { get; set; }
}

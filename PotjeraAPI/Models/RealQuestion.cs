namespace PotjeraAPI.Models;

public class RealQuestion
{
    public int Id { get; set; }
    public int RealEpisodeId { get; set; }
    public int RealCandidateId { get; set; }
    public required string RoundType { get; set; }
    public int OrderNumber { get; set; }
}


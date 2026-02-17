namespace PotjeraAPI.Models;
public class RealCandidate
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public int EpisodeId { get; set; }
    public Episode? Episode { get; set; }
    public int OrderNumber { get; set; }
    public int FinalMoney { get; set; }
    public bool Caught {  get; set; }
    public int HunterId { get; set; }
    public Hunter? Hunter { get; set; }

    public ICollection<RealQuestion>? RealQuestions { get; set; }
}


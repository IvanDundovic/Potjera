namespace PotjeraAPI.Models;

public class Episode
{
    public int Id { get; set; }
    public int ShowId { get; set; }
    public string? Title { get; set; }
    public int EpisodeNumber { get; set; }
    public int Season {  get; set; }
    public DateTime BroadcastDate { get; set; }
    public required string Winner { get; set; }
}

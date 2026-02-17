using PotjeraAPI.Models;

namespace PotjeraAPI.DTOs;
public class EpisodeDto
{
    public int Id {  get; set; }
    public int ShowId { get; set; }
    public string? Title { get; set; }
    public int EpisodeNumber { get; set; }
    public int Season { get; set; }
    public DateTime BroadcastDate { get; set; }
    public string? Winner { get; set; }
}


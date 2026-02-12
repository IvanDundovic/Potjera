namespace PotjeraAPI.Models;

public class GameSession
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int EpisodeId {  get; set; }
    public int FinalResult { get; set; }
    public int MoneyWon { get; set; }
}


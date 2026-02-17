namespace PotjeraAPI.Models;

public class GameSession
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }
    public int EpisodeId {  get; set; }
    public Episode? Episode { get; set; }
    public decimal FinalResult { get; set; }
    public int MoneyWon { get; set; }

    public ICollection<GameAnswer>? GameAnswers { get; set; }
}


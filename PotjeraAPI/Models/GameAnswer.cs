namespace PotjeraAPI.Models;

public class GameAnswer
{
    public int Id { get; set; }
    public int GameSessionId { get; set; }
    public GameSession? GameSession { get; set; }
    public int RealQuestionId { get; set; }
    public RealQuestion? RealQuestion { get; set; }
    public string? UserAnswer { get; set; }
    public bool IsCorrect {  get; set; }
    public double TimeTaken { get; set; }
}



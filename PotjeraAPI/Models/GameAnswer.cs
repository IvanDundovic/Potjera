namespace PotjeraAPI.Models;

public class GameAnswer
{
    public int Id { get; set; }
    public int GameSessionId { get; set; }
    public int RealQuestionId { get; set; }
    public string? UserAnswer { get; set; }
    public bool IsCorrect {  get; set; }
    public float TimeTaken { get; set; }
}



namespace PotjeraAPI.Models;

public class Question
{
    public int Id { get; set; }
    public required string Text { get; set; }
    public required string CorrectAnswer { get; set; }
    public string? Explanation { get; set; }
    public int CategoryId { get; set; }
    public int Difficulty { get; set; }
    public int ShowId { get; set; }
}

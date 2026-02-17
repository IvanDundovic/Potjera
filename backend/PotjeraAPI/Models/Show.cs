namespace PotjeraAPI.Models;
 public class Show
 {
    public int Id { get; set; }
    public required string Name { get; set; }
    public string? Description { get; set; }

    public ICollection<Episode>? Episodes { get; set; }
    public ICollection<Question>? Questions { get; set; }
 }


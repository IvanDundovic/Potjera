namespace PotjeraAPI.Models;
public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = null!;
    public string? PasswordHash { get; set; }
    public string UserName { get; set; } = "Korisnik";
    public DateTime LastLogIn { get; set; }
    public string Role { get; set; } = "User";
    public DateTime CreatedAt { get; set; }

    public ICollection<GameSession>? GameSessions { get; set; }

}


using Microsoft.EntityFrameworkCore;
using PotjeraAPI.Models;

namespace PotjeraAPI.Data;

public class ApplicationDbContex(DbContextOptions<ApplicationDbContex> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Show> Shows { get; set; }
    public DbSet<Episode> Episodes { get; set; }
    public DbSet<Hunter> Hunters { get; set; }
    public DbSet<RealAnswer > RealAnswers { get; set; }
    public DbSet<RealCandidate> RealCandidates { get; set; }
    public DbSet<RealQuestion> RealQuestions { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<QuestionOption> QuestionOptions { get; set; }

    public override void OnModelCreating(ModelBuilder modelBuilder)
    {

    }
}


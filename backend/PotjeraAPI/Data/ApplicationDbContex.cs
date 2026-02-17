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

    private static void ConfigureUser(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(200);

            entity.HasIndex(e => e.Email).IsUnique();
            entity.Property(e => e.UserName).HasMaxLength(20);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Role).HasMaxLength(30);
            
            entity.HasMany(e => e.GameSessions)
                .WithOne(g =>  g.User)
                .HasForeignKey(gs => gs.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
    private static void ConfigureShow(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Show>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(50);

            entity.Property(e => e.Description).HasMaxLength(255);

            entity.HasMany(e => e.Episodes)
                .WithOne(ep => ep.Show)
                .HasForeignKey(ep => ep.ShowId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Questions)
                .WithOne(q => q.Show)
                .HasForeignKey(q => q.ShowId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
    private static void ConfigureEpisode(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Episode>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Title).HasMaxLength(200);

            entity.Property(e => e.Winner).HasMaxLength(100);

            entity.HasMany(e => e.RealQuestions)
                .WithOne(rq => rq.Episode)
                .HasForeignKey(rq => rq.EpisodeId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.RealCandidates)
                .WithOne(rc => rc.Episode)
                .HasForeignKey(rc => rc.EpisodeId)
                .OnDelete(DeleteBehavior.Cascade);
        }); 
    }
    private static void ConfigureHunter(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Hunter>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasMany(e => e.RealCandidates)
                .WithOne(rc => rc.Hunter)
                .HasForeignKey(rc => rc.HunterId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
    private static void ConfigureRealQuestion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RealQuestion>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.RoundType)
                .IsRequired()
                .HasMaxLength(50);

            entity.HasOne(e => e.RealAnswer)
                 .WithOne(ra => ra.RealQuestion)
                 .HasForeignKey<RealAnswer>(ra => ra.RealQuestionId)
                 .OnDelete(DeleteBehavior.Cascade);
        });
    }
    private static void ConfigureRealCandidate(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RealCandidate>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.HasMany(e => e.RealQuestions)
                .WithOne(rq => rq.RealCandidate)
                .HasForeignKey(rq => rq.RealCandidateId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
    private static void ConfigureCategory(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Name)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Description)
                .HasMaxLength(500);

            entity.HasMany(e => e.Questions)
                .WithOne(q => q.Category)
                .HasForeignKey(q => q.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
    private static void ConfigureQuestionOption(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<QuestionOption>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Text)
                .IsRequired()
                .HasMaxLength(100);
        });
    }
    private static void ConfigureQuestion(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Text)
                .IsRequired();

            entity.Property(e => e.CorrectAnswer)
                .IsRequired()
                .HasMaxLength(200);

            entity.Property(e => e.Difficulty)
                .HasMaxLength(50);
            entity.HasMany(e => e.Options)
                .WithOne(o => o.Question)
                .HasForeignKey(o => o.QuestionId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.RealQuestions)
                .WithOne(rq => rq.Question)
                .HasForeignKey(rq => rq.QuestionId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
    private static void ConfigureRealAnswer(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<RealAnswer>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.CandidateAnswer)
                .HasMaxLength(300);

            entity.Property(e => e.HunterAnswer)
                .HasMaxLength(300);
        });
    }
    private static void ConfigureGameSession(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GameSession>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasMany(e => e.GameAnswers)
                .WithOne(ga => ga.GameSession)
                .HasForeignKey(ga => ga.GameSessionId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
    private static void ConfigureGameAnswer(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<GameAnswer>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.UserAnswer)
                .IsRequired()
                .HasMaxLength(300);
        });
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ConfigureUser(modelBuilder);
        ConfigureShow(modelBuilder);
        ConfigureEpisode(modelBuilder);
        ConfigureHunter(modelBuilder);
        ConfigureRealQuestion(modelBuilder);
        ConfigureRealCandidate(modelBuilder);
        ConfigureCategory(modelBuilder);
        ConfigureQuestionOption(modelBuilder);
        ConfigureQuestion(modelBuilder);
        ConfigureRealAnswer(modelBuilder);
        ConfigureGameSession(modelBuilder);
        ConfigureGameAnswer(modelBuilder);

        base.OnModelCreating(modelBuilder);
    }
}


using Microsoft.EntityFrameworkCore;
using PotjeraAPI.Data;
using PotjeraAPI.DTOs;
using PotjeraAPI.Interfaces;
using PotjeraAPI.Models;
using System.Security.Cryptography.X509Certificates;

namespace PotjeraAPI.Services;

public class AuthService(ApplicationDbContex contex) : IAuthService
{
    public async Task<RegisterDto> RegisterAsync(RegisterDto dto)
    {
        var user = await contex.Users.FirstOrDefaultAsync(u => u!.Email == dto.Email!.ToLower());

        if (user == null) 
        {
            user = new User
            {
                Email = dto.Email!.ToLower(),
                CreatedAt = DateTime.UtcNow,
                PasswordHash = "PrivremenaLozinka"
            };
            await contex.Users.AddAsync(user);
            await contex.SaveChangesAsync();
        }
        return new RegisterDto { Email = user.Email.ToLower(), Password = user.PasswordHash, Role = user.Role };
    }
}


using PotjeraAPI.DTOs;

namespace PotjeraAPI.Interfaces;

public interface IAuthService
{
    Task<RegisterDto> RegisterAsync(RegisterDto dto);
}


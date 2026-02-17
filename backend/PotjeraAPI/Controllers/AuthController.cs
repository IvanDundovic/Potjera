using Microsoft.AspNetCore.Mvc;
using PotjeraAPI.DTOs;
using PotjeraAPI.Interfaces;

namespace PotjeraAPI.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] RegisterDto dto)
    {
        var user = await authService.RegisterAsync(dto);
        return Ok(user);
    }
}

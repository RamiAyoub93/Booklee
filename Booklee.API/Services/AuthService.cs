using Booklee.API.DTOs.Auth;
using Booklee.API.Helpers;
using Booklee.API.Models;
using Booklee.API.Repositories.Interfaces;
using Booklee.API.Services.Interfaces;

namespace Booklee.API.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _users;
    private readonly JwtHelper _jwt;

    public AuthService(IUserRepository users, JwtHelper jwt)
    {
        _users = users;
        _jwt = jwt;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _users.EmailExistsAsync(dto.Email))
            throw new ArgumentException("Email already in use.");

        if (dto.Role != "Customer" && dto.Role != "Owner")
            throw new ArgumentException("Role must be 'Customer' or 'Owner'.");

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = dto.Role
        };

        await _users.CreateAsync(user);
        var token = _jwt.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _users.GetByEmailAsync(dto.Email)
            ?? throw new UnauthorizedAccessException("Invalid email or password.");

        if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Invalid email or password.");

        var token = _jwt.GenerateToken(user);

        return new AuthResponseDto
        {
            Token = token,
            User = MapToDto(user)
        };
    }

    public async Task<UserDto> GetCurrentUserAsync(int userId)
    {
        var user = await _users.GetByIdAsync(userId)
            ?? throw new KeyNotFoundException("User not found.");
        return MapToDto(user);
    }

    private static UserDto MapToDto(User user) => new()
    {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        Role = user.Role,
        CompanyId = user.Company?.Id
    };
}
